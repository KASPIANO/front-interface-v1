import { useState, FC } from 'react';
import { Box, Button, Input, Typography, Card } from '@mui/material';
import { signKRC20BatchTransfer } from '../../utils/KaswareUtils';
import { TransferObj } from '../../types/Types';

// KasWare utility functions
export interface BatchTransferProps {
    walletConnected?: boolean;
}

const BatchTransfer: FC<BatchTransferProps> = () => {
    const [ticker, setTicker] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [recipientAddresses, setRecipientAddresses] = useState('');
    const [txid, setTxid] = useState('');

    const handleBatchTransfer = async () => {
        const addresses = recipientAddresses.split(',').map((addr) => addr.trim());

        if (addresses.length === 0 || !ticker || !amount) {
            alert('Please fill all fields and ensure the addresses are valid');
            return;
        }

        const transferObj: TransferObj = {
            p: 'KRC-20',
            op: 'transfer',
            tick: ticker,
            amt: (amount * 100000000).toString(), // Assuming Kaspa uses 8 decimal places
        };

        const jsonStr = JSON.stringify(transferObj);

        try {
            const txid = await signKRC20BatchTransfer(jsonStr, addresses);
            setTxid(txid);
        } catch (e) {
            console.error('Error in batch transfer:', e);
            setTxid('Error in transaction');
        }
    };

    return (
        <Card sx={{ padding: '20px', margin: '20px', width: '500px' }}>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                Batch Transfer KRC20 Tokens
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                Enter the details below to perform a batch transfer of KRC20 tokens.
            </Typography>
            <Box sx={{ marginBottom: '10px' }}>
                <Typography variant="body2">Ticker:</Typography>
                <Input value={ticker} onChange={(e) => setTicker(e.target.value)} fullWidth />
            </Box>
            <Box sx={{ marginBottom: '10px' }}>
                <Typography variant="body2">Amount per Address:</Typography>
                <Input value={amount} onChange={(e) => setAmount(Number(e.target.value))} fullWidth />
            </Box>
            <Box sx={{ marginBottom: '10px' }}>
                <Typography variant="body2">Recipient Addresses (comma-separated):</Typography>
                <Input
                    value={recipientAddresses}
                    onChange={(e) => setRecipientAddresses(e.target.value)}
                    fullWidth
                    placeholder="Enter recipient addresses"
                />
            </Box>
            <Button variant="contained" onClick={handleBatchTransfer} sx={{ marginTop: '20px' }}>
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
