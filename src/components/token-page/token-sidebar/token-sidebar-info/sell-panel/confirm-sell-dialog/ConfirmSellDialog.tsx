// ConfirmSellDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Divider,
} from '@mui/material';

interface ConfirmSellDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    ticker: string;
    tokenAmount: string;
    totalPrice: string;
    pricePerToken: string;
    priceCurrency: 'KAS' | 'USD';
    waitingForWalletConfirmation: boolean;
    creatingSellOrder: boolean;
}

const ConfirmSellDialog: React.FC<ConfirmSellDialogProps> = (props) => {
    const {
        waitingForWalletConfirmation,
        open,
        onClose,
        onConfirm,
        ticker,
        tokenAmount,
        totalPrice,
        pricePerToken,
        priceCurrency,
        creatingSellOrder,
    } = props;
    const handleClose = () => {
        if (waitingForWalletConfirmation || creatingSellOrder) {
            return; // Prevent closing if waiting
        }
        onClose();
    };
    const calculateAmountReceived = () => {
        const total = parseFloat(totalPrice);
        if (total <= 10) {
            return (total - 0.2).toFixed(2); // 20 cents off total price, rounded to 2 decimal places
        } else {
            return (total * 0.98).toFixed(2); // 98% of total price, rounded to 2 decimal places
        }
    };
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Sell Order</DialogTitle>
            <DialogContent>
                {waitingForWalletConfirmation ? (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <CircularProgress size={24} sx={{ mr: 2 }} />
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                Processing transaction...
                            </Typography>
                        </Box>
                    </>
                ) : creatingSellOrder ? (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <CircularProgress size={24} sx={{ mr: 2 }} />
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                Creating sell order...
                            </Typography>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body1">
                                <strong>Ticker:</strong> {ticker}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Token Amount:</strong> {tokenAmount}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Total Price ({priceCurrency}):</strong> {totalPrice}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Price per Token ({priceCurrency}):</strong> {pricePerToken}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1 }}>
                            <Typography variant="body1" gutterBottom>
                                By confirming this sell order:
                            </Typography>
                            <Typography variant="body2" paragraph>
                                • You will receive{' '}
                                <strong>
                                    {calculateAmountReceived()} {priceCurrency}
                                </strong>{' '}
                                when the token is sold.
                            </Typography>
                            <Typography variant="body2">
                                • Kaspiano will apply a 2% marketplace fee or 0.2 Depending on order.{' '}
                            </Typography>
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="primary"
                    disabled={waitingForWalletConfirmation || creatingSellOrder}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmSellDialog;
