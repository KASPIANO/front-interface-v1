// ConfirmSellDialog.tsx
import React, { useRef, useState } from 'react';
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
import { kaspaFeeEstimate } from '../../../../../../DAL/KaspaApiDal';
import { formatNumberWithCommas } from '../../../../../../utils/Utils';
import GasFeeSelector from '../../../../../common/GasFeeSelector';

interface ConfirmSellDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (priorityFee?: number) => void;
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
    const [onClickConfirm, setOnClickConfirm] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClose = () => {
        if (waitingForWalletConfirmation || onClickConfirm) {
            return; // Prevent closing if waiting
        }
        onClose();
    };

    const handleConfirm = async (priorityFee?: number) => {
        setOnClickConfirm(true);
        await onConfirm(priorityFee);
        setOnClickConfirm(false);
    };

    const purchaseButtonRef = useRef<HTMLButtonElement | null>(null);

    const gasHandlerPurchase = async () => {
        const fee = await kaspaFeeEstimate();
        if (fee === 1) {
            handleConfirm();
        } else {
            setAnchorEl(purchaseButtonRef.current);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Confirm Sell Order
                </Box>
            </DialogTitle>
            <DialogContent>
                {waitingForWalletConfirmation ? (
                    <LoadingSpinner
                        title="Waiting for wallet confirmation..."
                        size={60}
                        boxStyle={{ marginBottom: '1rem' }}
                    />
                ) : (
                    <>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body1">
                                <strong>Ticker:</strong> {ticker}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Token Amount:</strong> {formatNumberWithCommas(tokenAmount)}
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
                                • You will receive {totalPrice} KAS <strong /> when the token is sold.
                            </Typography>
                        </Box>
                        <GasFeeSelector
                            gasType="KRC20"
                            onSelectFee={(selectedFee) => {
                                handleConfirm(selectedFee);
                                setAnchorEl(null);
                            }}
                            anchorEl={anchorEl}
                            onClose={() => setAnchorEl(null)}
                        />
                    </>
                )}
            </DialogContent>
            {waitingForWalletConfirmation ? null : (
                <DialogActions>
                    <Button onClick={onClose} disabled={onClickConfirm}>
                        Cancel
                    </Button>
                    <Button
                        ref={purchaseButtonRef}
                        onClick={() => gasHandlerPurchase()}
                        variant="contained"
                        color="primary"
                        disabled={waitingForWalletConfirmation || onClickConfirm}
                    >
                        {onClickConfirm ? 'Creating...' : 'Confirm'}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default ConfirmSellDialog;
