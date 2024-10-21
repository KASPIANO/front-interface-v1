import React, { useState, FC } from 'react';
import { Box, Button, Input, Typography, Card } from '@mui/material';
import { sendKaspaToKaspiano, signKRC20BatchTransfer } from '../../utils/KaswareUtils';
import { parse } from 'papaparse'; // For CSV parsing
import { showGlobalSnackbar } from '../alert-context/AlertContext';
import FileDownloadIconRounded from '@mui/icons-material/FileDownloadRounded';
import { verifyPaymentTransaction } from '../../utils/Utils';
import { UploadButton } from '../../pages/deploy-page/DeployPage.s';
import { fetchWalletKRC20Balance } from '../../DAL/Krc20DAL';

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
    const [recipientList, setRecipientList] = useState<any[]>([]);
    const [txid, setTxid] = useState('');
    const [paymentMade, setPaymentMade] = useState(false); // Track if payment is made
    const [paymentTxnId, setPaymentTxnId] = useState<string | null>(null);

    // Example CSV header: "address"
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
                            .map((row: any) => {
                                const amount = parseFloat(row.amount);
                                const isValidAmount = !isNaN(amount) && amount > 0;
                                debugger;
                                if (!isValidAmount) {
                                    showGlobalSnackbar({
                                        message: `Invalid amount in row with address ${row.address}`,
                                        severity: 'error',
                                    });
                                    return null; // Skip this row
                                }

                                return {
                                    tick: ticker,
                                    to: row.address.trim(),
                                    amount,
                                };
                            })
                            .filter((item: any) => item !== null); // Filter out invalid entries

                        setRecipientList(list); // Set the validated list for transfer
                    },
                });
            }
        };
        reader.readAsText(file);
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
            console.log('Recipient list:', recipientList);
            // Perform batch transfer with the generated recipient list
            const txid = await signKRC20BatchTransfer(recipientList);
            setTxid(txid);
            clearFields();
        } catch (e) {
            console.error('Error in batch transfer:', e);
            setTxid('Error in transaction');
        }
    };
    const clearFields = () => {
        setTicker('');
        setPaymentMade(false);
        setPaymentTxnId(null);
        setRecipientList([]);
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

            <Button variant="contained" onClick={handlePayment} sx={{ marginBottom: '2vh' }} disabled={true}>
                Pay 500 KAS
            </Button>
            <Box sx={{ marginBottom: '1.3vh' }}>
                <Typography variant="body2">Ticker:</Typography>
                <Input value={ticker} onChange={(e) => setTicker(e.target.value)} fullWidth />
            </Box>

            <Box sx={{ marginBottom: '1.3vh' }}>
                <Typography variant="body2">Or Upload a CSV File:</Typography>
                <UploadButton>
                    <Input
                        sx={{ display: 'none' }}
                        inputProps={{ accept: '.csv' }}
                        type="file"
                        onChange={handleCSVUpload}
                    />
                    <Button variant="contained" color="primary" component="span">
                        Choose File
                    </Button>
                </UploadButton>
                <Typography variant="caption" sx={{ marginTop: '5px', display: 'block' }}>
                    CSV format: One column header named "address" with wallet addresses in each row and second
                    column named "amount" with the tokens for each address.
                </Typography>
            </Box>
            <Button
                variant="contained"
                disabled={!paymentMade || !recipientList.length || !ticker}
                onClick={handleBatchTransfer}
                sx={{ marginTop: '20px' }}
            >
                Batch Transfer
            </Button>
            {txid && (
                <Typography variant="body2" sx={{ marginTop: '20px', wordWrap: 'break-word' }}>
                    Transaction ID: {txid}
                </Typography>
            )}
        </Card>
    );
};

export default BatchTransfer;
