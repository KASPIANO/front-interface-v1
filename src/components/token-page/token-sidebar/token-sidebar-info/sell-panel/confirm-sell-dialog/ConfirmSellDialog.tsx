// ConfirmSellDialog.tsx
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
} from '@mui/material';
import LoadingSpinner from '../../../../../common/spinner/LoadingSpinner';
import { HighGasWarning } from '../../../../../common/HighGasWarning';
import { highGasWarning } from '../../../../../../DAL/KaspaApiDal';

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
const MINIMUM_FEE_AMOUNT = 1;
const MARKETLACE_FEE_PERCENTAGE = 0.025;
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
    const [showHighGasWarning, setShowHighGasWarning] = useState(false);
    useEffect(() => {
        const checkGasLimits = async () => {
            const isHighGasWarning = await highGasWarning('TRANSFER');

            setShowHighGasWarning(isHighGasWarning);
        };

        checkGasLimits();
    }, []);

    const handleClose = () => {
        if (waitingForWalletConfirmation || creatingSellOrder) {
            return; // Prevent closing if waiting
        }
        onClose();
    };
    const marketplaceFeeString = `${MARKETLACE_FEE_PERCENTAGE * 100}%`;
    const calculateAmountReceived = () => {
        const total = parseFloat(totalPrice);
        if (total * MARKETLACE_FEE_PERCENTAGE < MINIMUM_FEE_AMOUNT) {
            return total - MINIMUM_FEE_AMOUNT;
        } else {
            return (total - total * MARKETLACE_FEE_PERCENTAGE).toFixed(2);
        }
    };
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {waitingForWalletConfirmation
                        ? 'Step 1/2' // Show Step 1/2 when waiting for wallet confirmation
                        : creatingSellOrder
                          ? 'Step 2/2' // Show Step 2/2 when creating a sell order
                          : 'Confirm Sell Order'}
                    {showHighGasWarning && <HighGasWarning />}
                </Box>
            </DialogTitle>
            <DialogContent>
                {waitingForWalletConfirmation ? (
                    <LoadingSpinner
                        title="Waiting for wallet confirmation..."
                        size={60}
                        boxStyle={{ marginBottom: '1rem' }}
                    />
                ) : creatingSellOrder ? (
                    <LoadingSpinner title="Creating sell order..." size={60} boxStyle={{ marginBottom: '1rem' }} />
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
                                • Kaspiano will apply a {marketplaceFeeString} marketplace fee or a minimum fee of{' '}
                                {MINIMUM_FEE_AMOUNT} KAS.{' '}
                            </Typography>
                        </Box>
                    </>
                )}
            </DialogContent>
            {waitingForWalletConfirmation || creatingSellOrder ? null : (
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
            )}
        </Dialog>
    );
};

export default ConfirmSellDialog;
