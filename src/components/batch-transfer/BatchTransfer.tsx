import React, { useState, FC } from 'react';
import { Box, Button, Input, Typography, Card } from '@mui/material';
import { sendKaspaToKaspiano, signKRC20BatchTransfer } from '../../utils/KaswareUtils';
import { TransferObj } from '../../types/Types';
import { parse } from 'papaparse'; // For CSV parsing
import { showGlobalSnackbar } from '../alert-context/AlertContext';
import FileDownloadIconRounded from '@mui/icons-material/FileDownloadRounded';
import { setWalletBalanceUtil, verifyPaymentTransaction } from '../../utils/Utils';
import { fetchWalletBalance } from '../../DAL/KaspaApiDal';
import { UploadButton } from '../../pages/deploy-page/DeployPage.s';

export interface BatchTransferProps {
    walletConnected: boolean;
    walletAddress: string | null;
    setWalletBalance: (balance: number) => void;
    walletBalance: number;
}

const KASPA_TO_SOMPI = 100000000; // 1 KAS = 100,000,000 sompi
const VERIFICATION_FEE_KAS = 500;
const VERIFICATION_FEE_SOMPI = VERIFICATION_FEE_KAS * KASPA_TO_SOMPI;
const BatchTransfer: FC<BatchTransferProps> = (props) => {
    const { walletAddress, setWalletBalance, walletConnected, walletBalance } = props;
    const [ticker, setTicker] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [recipientAddresses, setRecipientAddresses] = useState('');
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
                        const addresses = results.data
                            .map((row: any) => row.address)
                            .filter((addr: string) => addr);
                        setRecipientAddresses(addresses.join(','));
                    },
                });
            }
        };
        reader.readAsText(file);
    };

    const handleBatchTransfer = async () => {
        const addresses = recipientAddresses.split(',').map((addr) => addr.trim());

        if (addresses.length === 0) {
            showGlobalSnackbar({
                message: 'Missing destination addresses ',
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
        if (!amount) {
            showGlobalSnackbar({
                message: 'Missing amount',
                severity: 'error',
            });
            return;
        }
        const verification = await verifyPaymentTransaction(paymentTxnId, walletAddress, VERIFICATION_FEE_SOMPI);
        if (!verification) {
            showGlobalSnackbar({
                message: 'Payment required',
                severity: 'error',
            });
            return;
        }

        const transferObj: TransferObj = {
            p: 'KRC-20',
            op: 'transfer',
            tick: ticker,
            amt: (parseInt(amount) * 100000000).toString(), // Assuming Kaspa uses 8 decimal places
        };

        const jsonStr = JSON.stringify(transferObj);

        try {
            console.log('Signing batch transfer:', jsonStr, addresses);
            const txid = await signKRC20BatchTransfer(jsonStr, addresses);
            setTxid(txid);
            clearFields();
        } catch (e) {
            console.error('Error in batch transfer:', e);
            setTxid('Error in transaction');
        }
    };
    const clearFields = () => {
        setTicker('');
        setAmount('');
        setRecipientAddresses('');
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
            });
            setPaymentTxnId(paymentTxnId);
            setPaymentMade(true);
        }

        const balance = await fetchWalletBalance(walletAddress);
        setWalletBalance(setWalletBalanceUtil(balance));
    };

    const validateNumbersOnly = (value: string) => {
        const regex = /^(?!0+\.?0*$)((\d+\.?\d*|\.\d+)|)$/;
        return regex.test(value);
    };

    const handleAmountChange = (value: string) => {
        if (validateNumbersOnly(value)) {
            setAmount(value);
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

            <Button variant="contained" onClick={handlePayment} sx={{ marginBottom: '2vh' }}>
                Pay 500 KAS
            </Button>
            <Box sx={{ marginBottom: '1.3vh' }}>
                <Typography variant="body2">Ticker:</Typography>
                <Input value={ticker} onChange={(e) => setTicker(e.target.value)} fullWidth />
            </Box>
            <Box sx={{ marginBottom: '1.3vh' }}>
                <Typography variant="body2">Amount per Address:</Typography>
                <Input value={amount} onChange={(e) => handleAmountChange(e.target.value)} fullWidth />
            </Box>
            <Box sx={{ marginBottom: '1.3vh' }}>
                <Typography variant="body2">Recipient Addresses (comma-separated):</Typography>
                <Input
                    value={recipientAddresses}
                    onChange={(e) => setRecipientAddresses(e.target.value)}
                    fullWidth
                    multiline
                    placeholder="Enter recipient addresses"
                />
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
                        Choose File or Drag
                    </Button>
                </UploadButton>
                <Typography variant="caption" sx={{ marginTop: '5px', display: 'block' }}>
                    CSV format: One column header named "address" with wallet addresses in each row.
                </Typography>
            </Box>
            <Button
                variant="contained"
                disabled={!paymentMade}
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
