import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton, Tooltip, FormControlLabel, Checkbox, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DecentralizedOrder, MixedOrder, Order } from '../../../../../../types/Types';
import { OrderDetailsItem, OrderItemPrimary } from './OrderDetails.s';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LoadingSpinner from '../../../../../common/spinner/LoadingSpinner';
import { highGasLimitExceeded, highGasWarning } from '../../../../../../DAL/KaspaApiDal';
import { GasLimitExceeded } from '../../../../../common/HighGasLimitExceeded';
import { HighGasWarning } from '../../../../../common/HighGasWarning';

interface OrderDetailsProps {
    order: MixedOrder;
    walletConnected: boolean;
    walletBalance: number;
    kasPrice: number;
    onClose: (orderId: string, isDecentralized: boolean) => void;
    timeLeft: number;
    handlePurchase: (order: Order, finalTotal: number) => void;
    waitingForWalletConfirmation: boolean;
    isProcessingBuyOrder: boolean;
    handlePurchaseV2: (order: DecentralizedOrder, finalTotal: number) => void;
}

const KASPIANO_TRADE_COMMISSION = import.meta.env.VITE_TRADE_COMMISSION;
const OrderDetails: React.FC<OrderDetailsProps> = (props) => {
    const {
        order,
        walletConnected,
        walletBalance,
        kasPrice,
        onClose,
        timeLeft,
        handlePurchase,
        waitingForWalletConfirmation,
        isProcessingBuyOrder,
        handlePurchaseV2,
    } = props;
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showHighGasWarning, setShowHighGasWarning] = useState(false);
    const [showGasLimitExceeded, setShowGasLimitExceeded] = useState(false);
    // Fee Calculations
    const kaspianoCommissionInt = parseFloat(KASPIANO_TRADE_COMMISSION);
    const networkFee = order.isDecentralized ? 2 : 5;
    const finalTotal = order.totalPrice + networkFee;
    const platformFee = kaspianoCommissionInt > 0 ? Math.max(order.totalPrice * kaspianoCommissionInt, 0.5) : 0;
    const finalTotalWithCommission = finalTotal + platformFee;
    const feeText = order.isDecentralized ? 'PKST Fee' : 'Network Fee';

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    useEffect(() => {
        const checkGasLimits = async () => {
            const isHighGasWarning = await highGasWarning();
            const isGasLimitExceeded = await highGasLimitExceeded();

            setShowHighGasWarning(isHighGasWarning);
            setShowGasLimitExceeded(isGasLimitExceeded);
        };

        checkGasLimits();
    }, []);

    const handleOrderPurchase = async (order: Order | DecentralizedOrder, finalTotal: number) => {
        if (order.isDecentralized) {
            await handlePurchaseV2(order as DecentralizedOrder, finalTotalWithCommission);
        } else {
            await handlePurchase(order as Order, finalTotal);
        }
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAgreedToTerms(event.target.checked);
    };

    const navigateToTradeTerms = () => {
        window.open('/trade-terms', '_blank'); // Opens the "trade-terms" route in a new window
    };

    const getTooltipMessage = () => {
        if (!walletConnected) {
            return 'Please connect your wallet';
        }
        if (walletBalance < finalTotal) {
            return 'Not enough balance';
        }
        if (!agreedToTerms) {
            return 'You must agree to the terms and conditions';
        }
        return 'Confirm Purchase'; // Default message when everything is valid
    };

    return (
        <Box
            sx={{
                padding: '0.7rem',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                height: '100%', //
            }}
        >
            {waitingForWalletConfirmation ? (
                <LoadingSpinner
                    title="Waiting for wallet confirmation..."
                    size={70}
                    boxStyle={{ marginTop: '2rem' }}
                    titleStyle={{ marginBottom: '2rem' }}
                />
            ) : isProcessingBuyOrder ? (
                <LoadingSpinner
                    title="Processing your order..."
                    size={70}
                    boxStyle={{ marginTop: '2rem' }}
                    titleStyle={{ marginBottom: '2rem' }}
                />
            ) : (
                <>
                    {/* Close Button */}
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: '700' }}>Order Details</Typography>
                            <Box sx={{ marginLeft: 'auto' }}>
                                {showGasLimitExceeded && <GasLimitExceeded />}
                                {showHighGasWarning && !showGasLimitExceeded && <HighGasWarning />}
                            </Box>
                            <IconButton onClick={() => onClose(order.orderId, order.isDecentralized)}>
                                <CloseIcon
                                    sx={{
                                        fontSize: '1rem',
                                        mb: '0.2rem',
                                    }}
                                />
                            </IconButton>
                        </Box>

                        <OrderDetailsItem variant="body1">
                            Total Token Price:
                            <OrderItemPrimary>
                                {order.totalPrice.toFixed(2)} KAS
                                <Typography
                                    sx={{ ml: '0.3rem' }}
                                    variant="body2"
                                    color="textSecondary"
                                    component="span"
                                >
                                    (${(order.totalPrice * kasPrice).toFixed(2)})
                                </Typography>
                            </OrderItemPrimary>
                        </OrderDetailsItem>

                        {/* Network Fee */}
                        <OrderDetailsItem variant="body1">
                            {feeText}:
                            <OrderItemPrimary
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Tooltip
                                    placement="left"
                                    title={`${feeText} for processing the transaction, the fee unused will be refunded, usually you receive most of it back`}
                                >
                                    <IconButton size="small">
                                        <InfoOutlinedIcon
                                            sx={{
                                                fontSize: '0.7rem',
                                            }}
                                            fontSize="small"
                                        />
                                    </IconButton>
                                </Tooltip>
                                {networkFee.toFixed(2)} KAS
                                <Typography
                                    sx={{ ml: '0.3rem' }}
                                    variant="body2"
                                    color="textSecondary"
                                    component="span"
                                >
                                    (${(networkFee * kasPrice).toFixed(2)})
                                </Typography>
                            </OrderItemPrimary>
                        </OrderDetailsItem>
                        {order.isDecentralized && kaspianoCommissionInt > 0 && (
                            <OrderDetailsItem variant="body1">
                                Platform Fee:
                                <OrderItemPrimary
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    {platformFee.toFixed(2)} KAS
                                    <Typography
                                        sx={{ ml: '0.3rem' }}
                                        variant="body2"
                                        color="textSecondary"
                                        component="span"
                                    >
                                        (${(platformFee * kasPrice).toFixed(2)})
                                    </Typography>
                                </OrderItemPrimary>
                            </OrderDetailsItem>
                        )}

                        {/* Final Total */}
                        <OrderDetailsItem variant="body1" sx={{ fontWeight: 'bold' }}>
                            Final Total:
                            <OrderItemPrimary>
                                {finalTotalWithCommission.toFixed(2)} KAS
                                <Typography
                                    sx={{ ml: '0.3rem' }}
                                    variant="body2"
                                    color="textSecondary"
                                    component="span"
                                >
                                    (${(finalTotalWithCommission * kasPrice).toFixed(2)})
                                </Typography>
                            </OrderItemPrimary>
                        </OrderDetailsItem>
                    </Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={agreedToTerms}
                                onChange={handleCheckboxChange}
                                sx={{
                                    '& .MuiSvgIcon-root': { fontSize: '1rem' }, // Scales down the checkbox icon
                                }} // Scales down the checkbox
                            />
                        }
                        label={
                            <>
                                {'I agree with the '}
                                <Link onClick={navigateToTradeTerms} sx={{ cursor: 'pointer' }}>
                                    terms and conditions
                                </Link>
                                {' of this trade'}
                            </>
                        }
                        sx={{
                            '& .MuiFormControlLabel-label': { fontSize: '0.7rem', fontWeight: '600' }, // Adjusts the label font size
                        }}
                    />

                    {/* Time left */}
                    <Typography variant="body2" color="error" sx={{ mb: '0.2rem', fontSize: '0.8rem' }}>
                        Time left to confirm purchase: {formatTime(timeLeft)}
                    </Typography>

                    {/* Confirm Button */}
                    <Tooltip title={getTooltipMessage()}>
                        <span>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleOrderPurchase(order, finalTotal)}
                                disabled={!walletConnected || walletBalance < finalTotal || !agreedToTerms}
                                sx={{ width: '100%' }}
                            >
                                Confirm Purchase
                            </Button>
                        </span>
                    </Tooltip>
                </>
            )}
        </Box>
    );
};

export default OrderDetails;
