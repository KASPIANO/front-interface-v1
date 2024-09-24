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
    } = props;
    const handleClose = () => {
        if (waitingForWalletConfirmation) {
            return; // Prevent closing if waiting
        }
        onClose();
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
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Please confirm that you want to create this sell order.
                        </Typography>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onConfirm} variant="contained" color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmSellDialog;
