import React, { useState, FC } from 'react';
import { Box, Button, Input, Typography, Card } from '@mui/material';
import { sendKaspaToKaspiano, signKRC20BatchTransfer, versionCheck } from '../../utils/KaswareUtils';
import { parse } from 'papaparse'; // For CSV parsing
import { showGlobalSnackbar } from '../alert-context/AlertContext';
import FileDownloadIconRounded from '@mui/icons-material/FileDownloadRounded';
import { verifyPaymentTransaction } from '../../utils/Utils';
import { UploadButton } from '../../pages/deploy-page/DeployPage.s';
import { fetchWalletKRC20Balance } from '../../DAL/Krc20DAL';
import { BatchTransferItem } from '../../types/Types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';

export interface BatchTransferProps {
    walletConnected: boolean;
    walletAddress: string | null;
    walletBalance: number;
}

const KASPA_TO_SOMPI = 100000000; // 1 KAS = 100,000,000 sompi
const VERIFICATION_FEE_KAS = 500;
const VERIFICATION_FEE_SOMPI = VERIFICATION_FEE_KAS * KASPA_TO_SOMPI;
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

    // Example CSV header: "address"
    // const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;

    //     const reader = new FileReader();
    //     reader.onload = (event) => {
    //         const csvText = event.target?.result?.toString();
    //         if (csvText) {
    //             parse(csvText, {
    //                 header: true,
    //                 complete: (results) => {
    //                     const list = results.data
    //                         .map((row: any) => {
    //                             const amount = parseFloat(row.amount);
    //                             const isValidAmount = !isNaN(amount) && amount > 0;
    //                             if (!isValidAmount) {
    //                                 showGlobalSnackbar({
    //                                     message: `Invalid amount in row with address ${row.address}`,
    //                                     severity: 'error',
    //                                 });
    //                                 return null; // Skip this row
    //                             }

    //                             return {
    //                                 tick: ticker,
    //                                 to: row.address.trim(),
    //                                 amount,
    //                             };
    //                         })
    //                         .filter((item: any) => item !== null); // Filter out invalid entries

    //                     setRecipientList(list); // Set the validated list for transfer
    //                 },
    //             });
    //         }
    //     };
    //     reader.readAsText(file);
    // };

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
                        const list = results.data
                            .filter((row: any) => row.address && row.amount)
                            .map((row: any) => {
                                const amount = parseFloat(row.amount);
                                const isValidAmount = !isNaN(amount) && amount > 0;
                                console.log(ticker);

                                if (!isValidAmount) {
                                    showGlobalSnackbar({
                                        message: `Invalid amount in row with address ${row.address}`,
                                        severity: 'error',
                                    });

                                    // Mark as skipped in walletListProgress
                                    setWalletListProgress((prevProgress) => [
                                        ...prevProgress,
                                        { to: row.address.trim(), amount: 0, tick: ticker, status: 'skipped' },
                                    ]);

                                    return null; // Skip this row
                                }

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
            console.log('result', res.status, res?.index, res?.txId?.revealId, res?.errorMsg);
            setWalletListProgress((prevProgress) =>
                prevProgress.map((item) =>
                    item.to === res.to && item.index === res.index
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
        if (await versionCheck()) {
            window.kasware.on('krc20BatchTransferChanged', handleKRC20BatchTransferChangedChanged);
        } else {
            showGlobalSnackbar({
                message: `Your kasware version is outdated. Please update to the latest version`,
                severity: 'error',
            });
            return;
        }
        if (!recipientList.length) {
            showGlobalSnackbar({
                message: 'Recipient list is empty',
                severity: 'error',
            });
            return;
        }
        if (!ticker) {
            showGlobalSnackbar({
                message: 'Missing ticker',
                severity: 'error',
            });
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
        const verification = await verifyPaymentTransaction(paymentTxnId, walletAddress, VERIFICATION_FEE_SOMPI);
        if (!verification) {
            showGlobalSnackbar({
                message: 'Payment required',
                severity: 'error',
            });
            return;
        }

        try {
            setIsTransferActive(true); // Activate the transfer
            // Perform batch transfer with the generated recipient list
            await signKRC20BatchTransfer(recipientList);

            window.kasware.removeListener('krc20BatchTransferChanged', handleKRC20BatchTransferChangedChanged);
            clearFields();
        } catch (e) {
            console.error('Error in batch transfer:', e);
        } finally {
            setIsTransferActive(false);
        }
    };

    const clearFields = () => {
        setTicker('');
        setPaymentMade(false);
        setPaymentTxnId(null);
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
        if (walletBalance < VERIFICATION_FEE_KAS) {
            showGlobalSnackbar({
                message: 'Insufficient funds',
                severity: 'error',
            });
            return;
        }
        const paymentTxn = await sendKaspaToKaspiano(VERIFICATION_FEE_SOMPI);

        const paymentTxnId = paymentTxn.id;

        if (!paymentTxnId) {
            showGlobalSnackbar({
                message: 'Payment failed',
                severity: 'error',
            });
            return;
        } else {
            showGlobalSnackbar({
                message: 'Payment successful',
                severity: 'success',
                txIds: [paymentTxnId],
            });
            setPaymentTxnId(paymentTxnId);
            setPaymentMade(true);
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
            <Typography variant="h5" sx={{ marginBottom: '2vh' }}>
                Batch Transfer KRC20 Tokens
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '2vh' }}>
                Enter the details below to perform a batch transfer of KRC20 tokens. You will be charged 500 KAS to
                use this service. You can also upload a list of addresses through a CSV file. Follow the Example
                Provided.
                <br />
                <Box sx={{ mt: '3vh' }}>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIconRounded />}
                        onClick={handleDownload}
                        sx={{ textTransform: 'none' }}
                    >
                        Download example CSV
                    </Button>
                </Box>
            </Typography>

            <Box sx={{ marginBottom: '1.3vh' }}>
                <Typography variant="body2">Ticker:</Typography>
                <Input value={ticker} onChange={(e) => setTicker(e.target.value)} fullWidth />
            </Box>

            <Box sx={{ marginBottom: '1.3vh' }}>
                <Typography variant="body2">Upload a CSV File:</Typography>
                <UploadButton>
                    <Input
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
                </UploadButton>
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
            <Button variant="contained" onClick={handlePayment} sx={{ marginBottom: '2vh' }}>
                Pay 500 KAS
            </Button>
            <Button
                variant="contained"
                disabled={!paymentMade || !recipientList.length || !ticker}
                onClick={handleBatchTransfer}
                sx={{ marginTop: '20px', marginRight: '10px' }}
            >
                Batch Transfer
            </Button>
            <Button
                sx={{ marginTop: '20px' }}
                onClick={handleCancelTransfer}
                disabled={!isTransferActive}
                variant="contained"
            >
                Cancel Batch Transfer
            </Button>
            {recipientList.length > 0 && (
                <Box mt={2}>
                    <Typography variant="h6">Airdrop Summary && Wallet List and Progress</Typography>
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
