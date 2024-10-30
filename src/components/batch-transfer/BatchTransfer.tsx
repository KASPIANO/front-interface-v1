import React, { useState, FC, useEffect } from 'react';
import {
    Box,
    Button,
    Input,
    Typography,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip,
} from '@mui/material';
import { sendKaspaToKaspiano, signKRC20BatchTransfer, versionCheck } from '../../utils/KaswareUtils';
import { parse } from 'papaparse'; // For CSV parsing
import { showGlobalSnackbar } from '../alert-context/AlertContext';
import FileDownloadIconRounded from '@mui/icons-material/FileDownloadRounded';
import { fetchWalletKRC20Balance } from '../../DAL/Krc20DAL';
import { BatchTransferItem } from '../../types/Types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import { checkAirdropCredits, decreaseAirdropCredits, saveAirdropData } from '../../DAL/BackendDAL';

export interface BatchTransferProps {
    walletConnected: boolean;
    walletAddress: string | null;
    walletBalance: number;
}

const KASPA_TO_SOMPI = 100000000; // 1 KAS = 100,000,000 sompi
const AIRDROP_FEE_KAS = 500;
const AIRDROP_FEE_SOMPI = AIRDROP_FEE_KAS * KASPA_TO_SOMPI;
const BatchTransfer: FC<BatchTransferProps> = (props) => {
    const { walletAddress, walletConnected, walletBalance } = props;
    const [ticker, setTicker] = useState<string>('');
    const [recipientList, setRecipientList] = useState<BatchTransferItem[]>([]);
    const [paymentMade, setPaymentMade] = useState(false); // Track if payment is made
    const [paymentTxnId, setPaymentTxnId] = useState<string | null>(null);
    const [walletListProgress, setWalletListProgress] = useState<
        {
            to: string;
            amount: number;
            tick: string;
            status: string;
            index?: number;
            errorMsg?: string;
            txId?: string;
        }[]
    >([]);
    const [isTransferActive, setIsTransferActive] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [startedPayment, setStartedPayment] = useState(false);
    const [userCredits, setUserCredits] = useState(0);
    const [usingCredits, setUsingCredits] = useState(false);
    useEffect(() => {
        const fetchUserCredits = async () => {
            try {
                // Fetch user credits from the backend
                if (!walletConnected) {
                    setUserCredits(0);
                }
                const response = await checkAirdropCredits();
                setUserCredits(response.credits);
            } catch (error) {
                console.error('Error fetching user credits:', error);
            }
        };

        fetchUserCredits();
    }, [userCredits, paymentMade, paymentTxnId, walletAddress, walletConnected]);

    // Calculate the airdrop summary
    const totalTokens = recipientList.reduce((sum, item) => sum + item.amount, 0);
    const totalAddresses = recipientList.length;

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => {
        if (startedPayment || usingCredits) {
            return;
        }

        setOpenDialog(false);
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const csvText = event.target?.result?.toString();
            if (csvText) {
                parse(csvText, {
                    header: true,
                    complete: (results) => {
                        const uniqueEntries = new Map();
                        const list = results.data
                            .filter((row: any) => row.address && row.amount)
                            .map((row: any, index: number) => {
                                const amount = parseFloat(row.amount);
                                const isValidAmount = !isNaN(amount) && amount > 0;
                                console.log(ticker);

                                if (!isValidAmount) {
                                    showGlobalSnackbar({
                                        message: `Invalid amount in row ${index + 2}`,
                                        severity: 'error',
                                    });

                                    // Mark as skipped in walletListProgress
                                    setWalletListProgress((prevProgress) => [
                                        ...prevProgress,
                                        {
                                            to: row.address.trim(),
                                            amount: 0,
                                            tick: ticker,
                                            status: 'Invalid Amount',
                                        },
                                    ]);

                                    return null; // Skip this row
                                }
                                const addressKey = `${row.address.trim()}_${amount}`;
                                if (uniqueEntries.has(addressKey)) {
                                    showGlobalSnackbar({
                                        message: `Duplicate entry found`,
                                        severity: 'error',
                                    });

                                    // Mark as skipped in walletListProgress for duplicate
                                    setWalletListProgress((prevProgress) => [
                                        ...prevProgress,
                                        {
                                            to: row.address.trim(),
                                            amount,
                                            tick: ticker,
                                            status: 'Duplicate Wallet',
                                        },
                                    ]);

                                    return null; // Skip duplicate entries
                                }

                                uniqueEntries.set(addressKey, true);

                                // Mark as pending in walletListProgress
                                setWalletListProgress((prevProgress) => [
                                    ...prevProgress,
                                    {
                                        to: row.address.trim(),
                                        amount,
                                        tick: ticker,
                                        status: 'pending',
                                        index: prevProgress.length,
                                    },
                                ]);

                                return {
                                    tick: ticker,
                                    to: row.address.trim(),
                                    amount,
                                };
                            })
                            .filter((item: any) => item !== null); // Filter out invalid entries

                        setRecipientList(list);
                        e.target.value = ''; // Set the validated list for transfer
                    },
                });
            }
        };
        reader.readAsText(file);
    };

    const handleKRC20BatchTransferChangedChanged = (ress: any[]) => {
        ress.forEach((res) => {
            setWalletListProgress((prevProgress) =>
                prevProgress.map((item) =>
                    item.to === res.to && item.amount === res.amount
                        ? {
                              ...item,
                              status: res.status,
                              index: res.index,
                              errorMsg: res.errorMsg,
                              txId: res.txId?.revealId,
                          }
                        : item,
                ),
            );
        });
    };

    const calculateTotalAmount = (): number => recipientList.reduce((total, item) => total + item.amount, 0);

    const handleTokenBalanceVerification = async (): Promise<boolean> => {
        const totalAmount = calculateTotalAmount();
        const balance = await fetchWalletKRC20Balance(walletAddress, ticker);

        if (balance >= totalAmount) {
            return true;
        } else {
            showGlobalSnackbar({
                message: 'Token balance is insufficient',
                severity: 'error',
            });
            return false;
        }
    };

    const handleBatchTransfer = async () => {
        setIsVerifying(true);
        if (await versionCheck()) {
            window.kasware.on('krc20BatchTransferChanged', handleKRC20BatchTransferChangedChanged);
        } else {
            showGlobalSnackbar({
                message: `Your kasware version is outdated. Please update to the latest version`,
                severity: 'error',
            });
            setIsVerifying(false);
            return;
        }
        if (!recipientList.length) {
            showGlobalSnackbar({
                message: 'Recipient list is empty',
                severity: 'error',
            });
            setIsVerifying(false);
            return;
        }
        if (!ticker) {
            showGlobalSnackbar({
                message: 'Missing ticker',
                severity: 'error',
            });
            setIsVerifying(false);
            return;
        }

        // Verify token balance before proceeding
        const tokenAmountVerification = await handleTokenBalanceVerification();
        if (!tokenAmountVerification) {
            showGlobalSnackbar({
                message: 'Token balance is insufficient',
                severity: 'error',
            });
            return;
        }

        // Verify payment transaction

        try {
            setIsTransferActive(true); // Activate the transfer
            setIsVerifying(false);
            // Perform batch transfer with the generated recipient list
            await signKRC20BatchTransfer(recipientList);

            window.kasware.removeListener('krc20BatchTransferChanged', handleKRC20BatchTransferChangedChanged);
            showGlobalSnackbar({ message: 'Airdrop completed', severity: 'success' });
            clearFields();
        } catch (e) {
            console.error('Error in batch transfer:', e);
        } finally {
            setIsTransferActive(false);
        }
    };

    const handleTickerChange = (newTicker: string) => {
        setTicker(newTicker);
        setRecipientList((prevList) => prevList.map((item) => ({ ...item, tick: newTicker })));
        setWalletListProgress((prevProgress) => prevProgress.map((item) => ({ ...item, tick: newTicker })));
    };

    const clearFields = () => {
        setTicker('');
        setPaymentMade(false);
        setPaymentTxnId(null);
        setIsVerifying(false);
    };

    const handleCancelTransfer = async () => {
        await (window as any).kasware.cancelKRC20BatchTransfer();
        setWalletListProgress((prevProgress) =>
            prevProgress.map((item) => (item.status === 'pending' ? { ...item, status: 'cancelled' } : item)),
        );
        setIsTransferActive(false);
        showGlobalSnackbar({ message: 'Batch transfer cancelled', severity: 'info' });
        handleCleanWalletList();
    };

    const handlePayment = async () => {
        if (!walletConnected) {
            showGlobalSnackbar({
                message: 'Please connect your wallet',
                severity: 'error',
            });
            return;
        }
        if (walletBalance < AIRDROP_FEE_KAS) {
            showGlobalSnackbar({
                message: 'Insufficient funds',
                severity: 'error',
            });
            return;
        }
        setStartedPayment(true);
        try {
            const paymentTxn = await sendKaspaToKaspiano(AIRDROP_FEE_SOMPI);

            const paymentTxnId = paymentTxn.id;

            if (!paymentTxnId) {
                showGlobalSnackbar({
                    message: 'Payment failed',
                    severity: 'error',
                });
                return;
            }
            await saveAirdropData(ticker, paymentTxnId);
            showGlobalSnackbar({
                message: 'Payment successful',
                severity: 'success',
                txIds: [paymentTxnId],
            });
            setStartedPayment(false);
            setPaymentTxnId(paymentTxnId);
        } catch (error) {
            console.error('Error in handlePayment:', error);
            showGlobalSnackbar({
                message: 'An error occurred while processing your payment. Please try again.',
                severity: 'error',
            });
        } finally {
            setStartedPayment(false);
        }
    };

    const handleCreditReduction = async () => {
        try {
            setUsingCredits(true);
            const tokenAmountVerification = await handleTokenBalanceVerification();
            if (!tokenAmountVerification) {
                showGlobalSnackbar({
                    message: 'Token balance is insufficient',
                    severity: 'error',
                });
                setUsingCredits(false);
                handleCloseDialog();
                return;
            }
            if (walletBalance < 30) {
                showGlobalSnackbar({
                    message: 'You Need 30 KAS to use the Airdrop tool',
                    severity: 'error',
                });
                setUsingCredits(false);
                handleCloseDialog();
                return;
            }
            const result = await decreaseAirdropCredits();
            if (result.message === 'Credits successfully decreased.') {
                setUserCredits(userCredits - 1);
                showGlobalSnackbar({
                    message: 'Airdrop credit used successfully',
                    severity: 'success',
                });
                handleCloseDialog();
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                setTimeout(() => {}, 700);
                setPaymentMade(true);
                setUsingCredits(false);
            } else {
                showGlobalSnackbar({
                    message: 'No credits available or wallet address not found.',
                    severity: 'error',
                });
                setUsingCredits(false);
                handleCloseDialog();
            }
        } catch (error) {
            console.error('Error in handleCreditReduction:', error);
            showGlobalSnackbar({
                message: 'An error occurred while using your credit. Please try again.',
                severity: 'error',
            });
            setUsingCredits(false);
            handleCloseDialog();
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/example_csv.csv';
        link.download = 'example_csv.csv';
        link.type = 'text/csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCleanWalletList = () => {
        setRecipientList([]);
        setWalletListProgress([]);
    };
    return (
        <Card sx={{ padding: '20px', margin: '20px', width: '80%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ marginBottom: '2vh' }}>
                    Airdrop KRC20 Tokens
                </Typography>
                <Typography sx={{ marginBottom: '2vh' }}>Credits: {userCredits}</Typography>
            </Box>
            <Typography variant="body2" sx={{ marginBottom: '2vh' }}>
                Please enter the required details below to initiate an airdrop of KRC20 tokens. Each payment incurs
                a fee of 500 KAS, granting you up to 3 uses of the airdrop tool. You may also upload a CSV file
                with a list of recipient addresses—simply follow the provided example format.
                <br />
                <Box sx={{ mt: '3vh', display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIconRounded />}
                        onClick={handleDownload}
                        sx={{ textTransform: 'none' }}
                    >
                        Download example CSV
                    </Button>

                    <Tooltip title="You can use the Airdrop tool up to 3 times per payment 500 KAS.">
                        <span>
                            <Button onClick={handlePayment} variant="outlined" disabled={startedPayment}>
                                {startedPayment ? 'Processing Payment...' : 'Get More Credits'}
                            </Button>
                        </span>
                    </Tooltip>
                </Box>
            </Typography>

            <Box sx={{ marginBottom: '1.3vh' }}>
                <Typography variant="body2">Ticker:</Typography>
                <Input value={ticker} onChange={(e) => handleTickerChange(e.target.value)} fullWidth />
            </Box>

            <Box sx={{ marginBottom: '1.3vh' }}>
                <Typography variant="body2">Upload a CSV File:</Typography>
                <label>
                    <Tooltip title="Please Add Ticker First to start process">
                        <span>
                            <Input
                                disabled={recipientList.length > 0 || !ticker}
                                sx={{ display: 'none' }}
                                inputProps={{ accept: '.csv' }}
                                type="file"
                                onChange={handleCSVUpload}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                component="span"
                                disabled={recipientList.length > 0 || !ticker}
                                sx={{ marginRight: '10px' }}
                            >
                                Choose File
                            </Button>
                        </span>
                    </Tooltip>
                </label>
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    onClick={() => handleCleanWalletList()}
                    disabled={recipientList.length === 0 || isTransferActive}
                >
                    Clear Wallet Address List
                </Button>
                <Typography variant="caption" sx={{ marginTop: '5px', display: 'block' }}>
                    CSV format: One column header named "address" with wallet addresses in each row and second
                    column named "amount" with the tokens for each address.
                </Typography>
            </Box>
            <Button
                variant="contained"
                onClick={handleOpenDialog}
                sx={{ marginTop: '20px', marginRight: '10px' }}
                disabled={!recipientList.length || !ticker || isTransferActive || isVerifying || !walletConnected}
            >
                Review Airdrop
            </Button>
            <Button
                variant="contained"
                disabled={
                    !paymentMade ||
                    !recipientList.length ||
                    !ticker ||
                    isTransferActive ||
                    isVerifying ||
                    !walletConnected
                }
                onClick={handleBatchTransfer}
                sx={{ marginTop: '20px', marginRight: '10px' }}
            >
                {isVerifying ? 'Verifying...' : 'Start Airdrop'}
            </Button>
            <Button
                sx={{ marginTop: '20px' }}
                onClick={handleCancelTransfer}
                disabled={!isTransferActive}
                variant="contained"
            >
                Cancel Airdrop
            </Button>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Airdrop Summary</DialogTitle>
                <DialogContent>
                    <Typography>Ticker: {ticker}</Typography>
                    <Typography>Total Amount of Tokens: {totalTokens}</Typography>
                    <Typography>Total Addresses: {totalAddresses}</Typography>
                </DialogContent>
                <DialogActions>
                    {userCredits > 0 ? (
                        <Button
                            onClick={handleCreditReduction}
                            color="primary"
                            variant="contained"
                            disabled={startedPayment || usingCredits || !walletConnected || paymentMade}
                        >
                            {usingCredits ? 'Loading...' : 'Use Credit'}
                        </Button>
                    ) : (
                        <Button
                            onClick={handlePayment}
                            color="primary"
                            variant="contained"
                            disabled={startedPayment}
                        >
                            {startedPayment ? 'Verifiying payment' : 'Pay 500 KAS for 3 Credits'}
                        </Button>
                    )}
                    <Button onClick={handleCloseDialog} color="secondary" disabled={startedPayment}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            {recipientList.length > 0 && (
                <Box mt={2}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography variant="h6">Airdrop Wallet List and Progress</Typography>
                        {isTransferActive && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                    sx={{
                                        mr: 1,
                                        color: 'error.light',
                                        fontWeight: 'medium',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    - Please do not refresh or leave the page
                                </Typography>
                                <CircularProgress size={20} />
                            </Box>
                        )}
                    </Box>
                    <ol>
                        {walletListProgress.map((item, index) => (
                            <li
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem',
                                }}
                            >
                                <Typography variant="body2" style={{ marginRight: 10, fontWeight: 'bold' }}>
                                    Address: {item.to} - Amount: {item.amount} {ticker}
                                </Typography>
                                <Typography variant="body2" style={{ marginRight: 10 }}>
                                    Status: {item.status}
                                </Typography>
                                {item.index !== undefined && (
                                    <Typography variant="body2">Index: {item.index}</Typography>
                                )}
                                {item.tick && <Typography variant="body2">Ticker: {item.tick}</Typography>}
                                {item.errorMsg && (
                                    <Typography variant="body2" color="error">
                                        Error: {item.errorMsg}
                                    </Typography>
                                )}
                                {item.txId && <Typography variant="body2">Transaction ID: {item.txId}</Typography>}
                                <Box>
                                    {item.status === 'success' && <CheckCircleIcon color="success" />}
                                    {item.status === 'failed' && <ErrorIcon color="error" />}
                                    {item.status === 'cancelled' && <CancelIcon color="disabled" />}
                                    {item.status === 'skipped' && (
                                        <ErrorIcon color="error" titleAccess="Skipped due to invalid amount" />
                                    )}
                                    {item.status === 'pending' && isTransferActive && (
                                        <CircularProgress size={16} />
                                    )}
                                </Box>
                            </li>
                        ))}
                    </ol>
                </Box>
            )}
        </Card>
    );
};

export default BatchTransfer;
