import React from 'react';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Order } from '../../../../../../types/Types';
import { showGlobalSnackbar } from '../../../../../alert-context/AlertContext';
import { OrderDetailsItem, OrderItemPrimary } from './OrderDetails.s';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface OrderDetailsProps {
    order: Order;
    walletConnected: boolean;
    walletBalance: number;
    kasPrice: number;
    onClose: () => void;
    timeLeft: number;
}

const OrderDetails: React.FC<OrderDetailsProps> = (props) => {
    const { order, walletConnected, walletBalance, kasPrice, onClose, timeLeft } = props;

    // Fee Calculations
    const marketplaceFeePercentage = 0.01; // 2%
    const marketplaceFee = order.totalPrice * marketplaceFeePercentage;
    const networkFee = 5; // Fixed network fee
    const finalTotal = order.totalPrice + marketplaceFee + networkFee;

    const handlePurchase = () => {
        // Proceed with the purchase
        // Implement the logic to handle the purchase here
        showGlobalSnackbar({
            message: 'Purchase successful!',
            severity: 'success',
        });
    };

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
                <OrderDetailsItem variant="body1">
                    Marketplace Fee:
                    <OrderItemPrimary>
                        {marketplaceFee.toFixed(2)} KAS
                        <Typography sx={{ ml: '0.3rem' }} variant="body2" color="textSecondary" component="span">
                            (${(marketplaceFee * kasPrice).toFixed(2)})
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
                onClick={handlePurchase}
                disabled={!walletConnected || walletBalance < finalTotal}
                sx={{ width: '100%' }}
            >
                Confirm Purchase
            </Button>
        </Box>
    );
};

export default OrderDetails;
