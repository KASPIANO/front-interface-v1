import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Order } from '../../../../../../types/Types';
import OrderDetails from '../order-details/OrderDetails';

interface OrderItemProps {
    order: Order;
    isExpanded: boolean;
    onExpand: () => void;
    floorPrice: number;
    kasPrice: number;
    walletBalance: number;
    walletConnected: boolean;
}

const OrderItem: React.FC<OrderItemProps> = (props) => {
    const { order, isExpanded, onExpand, floorPrice, kasPrice, walletBalance, walletConnected } = props;
    const floorPriceDifference = ((order.pricePerToken - floorPrice) / floorPrice) * 100;

    return (
        <Box sx={{ borderBottom: '1px solid #ccc', padding: '1rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Token Amount: {order.tokenAmount}</Typography>
                <Typography variant="body1">Total Price: ${order.totalPrice.toFixed(2)}</Typography>
                <Typography variant="body1">Price per Token: ${order.pricePerToken.toFixed(2)}</Typography>
                <Typography variant="body1" sx={{ color: floorPriceDifference >= 0 ? 'green' : 'red' }}>
                    Floor Diff: {floorPriceDifference.toFixed(2)}%
                </Typography>
                <Button variant="contained" onClick={onExpand}>
                    {isExpanded ? 'Close' : 'Buy'}
                </Button>
            </Box>
            {isExpanded && (
                <OrderDetails
                    order={order}
                    kasPrice={kasPrice}
                    walletConnected={walletConnected}
                    walletBalance={walletBalance}
                />
            )}
        </Box>
    );
};

export default OrderItem;
