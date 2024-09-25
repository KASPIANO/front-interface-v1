import React from 'react';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Order } from '../../../../../../types/Types';
import { OrderDetailsItem, OrderItemPrimary } from './OrderDetails.s';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface OrderDetailsProps {
    order: Order;
    walletConnected: boolean;
    walletBalance: number;
    kasPrice: number;
    onClose: () => void;
    timeLeft: number;
    handlePurchase: (order: Order, finalTotal: number) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = (props) => {
    const { order, walletConnected, walletBalance, kasPrice, onClose, timeLeft, handlePurchase } = props;

    // Fee Calculations
    const networkFee = 5; // Fixed network fee
    const finalTotal = order.totalPrice + networkFee;

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    };

    return (
        <Box
            sx={{
                padding: '0.7rem',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Close Button */}
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: '700' }}>Order Details</Typography>
                    <IconButton onClick={onClose}>
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
                        <Typography sx={{ ml: '0.3rem' }} variant="body2" color="textSecondary" component="span">
                            (${(order.totalPrice * kasPrice).toFixed(2)})
                        </Typography>
                    </OrderItemPrimary>
                </OrderDetailsItem>

                {/* Marketplace Fee */}

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
                            title="Network fee for processing the transaction, the fee unused will be refunded"
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
                        <Typography sx={{ ml: '0.3rem' }} variant="body2" color="textSecondary" component="span">
                            (${(networkFee * kasPrice).toFixed(2)})
                        </Typography>
                    </OrderItemPrimary>
                </OrderDetailsItem>

                {/* Final Total */}
                <OrderDetailsItem variant="body1" sx={{ fontWeight: 'bold' }}>
                    Final Total:
                    <OrderItemPrimary>
                        {finalTotal.toFixed(2)} KAS
                        <Typography sx={{ ml: '0.3rem' }} variant="body2" color="textSecondary" component="span">
                            (${(finalTotal * kasPrice).toFixed(2)})
                        </Typography>
                    </OrderItemPrimary>
                </OrderDetailsItem>
            </Box>
            <Typography variant="body2" color="error" sx={{ mb: '0.2rem', fontSize: '0.8rem' }}>
                Time left to confirm purchase: {formatTime(timeLeft)}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handlePurchase(order, finalTotal)}
                disabled={!walletConnected || walletBalance < finalTotal}
                sx={{ width: '100%' }}
            >
                Confirm Purchase
            </Button>
        </Box>
    );
};

export default OrderDetails;