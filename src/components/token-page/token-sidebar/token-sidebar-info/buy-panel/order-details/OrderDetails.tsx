import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Order } from '../../../../../../types/Types';
import { OrderDetailsItem, OrderItemPrimary } from './OrderDetails.s';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LoadingSpinner from '../../../../../common/spinner/LoadingSpinner';

interface OrderDetailsProps {
    order: Order;
    walletConnected: boolean;
    walletBalance: number;
    kasPrice: number;
    onClose: (orderId: string) => void;
    timeLeft: number;
    handlePurchase: (order: Order, finalTotal: number) => void;
    waitingForWalletConfirmation: boolean;
    isProcessingBuyOrder: boolean;
}

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
    } = props;
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    // Fee Calculations
    const networkFee = 5; // Fixed network fee
    const finalTotal = order.totalPrice + networkFee;

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAgreedToTerms(event.target.checked);
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
                <LoadingSpinner title="Waiting for wallet confirmation..." size={45} />
            ) : isProcessingBuyOrder ? (
                <LoadingSpinner title="Processing your order..." size={45} />
            ) : (
                <>
                    {/* Close Button */}
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: '700' }}>Order Details</Typography>
                            <IconButton onClick={() => onClose(order.orderId)}>
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
                            Network Fee:
                            <OrderItemPrimary
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Tooltip
                                    placement="left"
                                    title="Network fee for processing the transaction, the fee unused will be refunded, usually you receive a refund of 4.9 KAS"
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

                        {/* Final Total */}
                        <OrderDetailsItem variant="body1" sx={{ fontWeight: 'bold' }}>
                            Final Total:
                            <OrderItemPrimary>
                                {finalTotal.toFixed(2)} KAS
                                <Typography
                                    sx={{ ml: '0.3rem' }}
                                    variant="body2"
                                    color="textSecondary"
                                    component="span"
                                >
                                    (${(finalTotal * kasPrice).toFixed(2)})
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
                        label={'I agree with the terms and conditions of this trade'}
                        sx={{
                            '& .MuiFormControlLabel-label': { fontSize: '0.7rem', fontWeight: '600' }, // Adjusts the label font size
                        }}
                    />

                    {/* Time left */}
                    <Typography variant="body2" color="error" sx={{ mb: '0.2rem', fontSize: '0.8rem' }}>
                        Time left to confirm purchase: {formatTime(timeLeft)}
                    </Typography>

                    {/* Confirm Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePurchase(order, finalTotal)}
                        disabled={!walletConnected || walletBalance < finalTotal || !agreedToTerms}
                        sx={{ width: '100%' }}
                    >
                        Confirm Purchase
                    </Button>
                </>
            )}
        </Box>
    );
};

export default OrderDetails;
