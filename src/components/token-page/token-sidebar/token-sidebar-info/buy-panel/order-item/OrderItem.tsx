import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { Order } from '../../../../../../types/Types';
import { OrderItemPrimary, OrderItemSecondary } from './OrderItem.s';
import { StyledButton } from '../../sell-panel/SellPanel.s';
import LoadingSpinner from '../../../../../common/spinner/LoadingSpinner';

interface OrderItemProps {
    order: Order;
    floorPrice: number;
    kasPrice: number;
    onSelect: (order: Order) => void;
    selectedOrder: Order | null;
    setSelectedOrder;
    walletConnected: boolean;
}

const OrderItem: React.FC<OrderItemProps> = (props) => {
    const { order, onSelect, kasPrice, selectedOrder, setSelectedOrder, walletConnected } = props;

    // const floorPriceDifference = ((order.pricePerToken - floorPrice) / floorPrice) * 100;

    const handleSelect = async (order: Order) => {
        setSelectedOrder(order);
        await onSelect(order);
    };

    const formatPrice = (price: number) => {
        if (price >= 1) {
            return price.toFixed(2);
        } else if (price >= 0.01) {
            return price.toFixed(3);
        } else if (price >= 0.0001) {
            return price.toFixed(6);
        } else {
            return price.toFixed(6); // Adjust precision as needed
        }
    };

    return (
        <Box sx={{ borderBottom: '0.5px solid  rgba(111, 199, 186, 0.5)', width: '100%', padding: '10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Amount with Floor Difference */}
                <Box sx={{ width: '17%' }}>
                    <OrderItemPrimary variant="body2">
                        {order.quantity}
                        {/* <Tooltip title="Difference from floor price"> */}
                        {/* <Typography
                                variant="caption"
                                component="span"
                                sx={{ color: floorPriceDifference >= 0 ? 'green' : 'red', marginLeft: '0.5rem' }}
                            >
                                ({floorPriceDifference.toFixed(2)}%)
                            </Typography> */}
                        {/* </Tooltip> */}
                    </OrderItemPrimary>
                </Box>
                {/* Price per Token */}
                <Box sx={{ width: '17%' }}>
                    <Tooltip title={`${order.pricePerToken} KAS`}>
                        <OrderItemPrimary variant="body2">{formatPrice(order.pricePerToken)}</OrderItemPrimary>
                    </Tooltip>
                    <OrderItemSecondary variant="caption" color="textSecondary">
                        (${(order.pricePerToken * kasPrice).toFixed(2)})
                    </OrderItemSecondary>
                </Box>
                {/* Total Price */}
                <Box sx={{ width: '15%' }}>
                    <OrderItemPrimary variant="body2">{order.totalPrice.toFixed(2)}</OrderItemPrimary>
                    <OrderItemSecondary variant="caption" color="textSecondary">
                        (${(order.totalPrice * kasPrice).toFixed(2)})
                    </OrderItemSecondary>
                </Box>
                {/* Buy/Close Button */}
                <Box>
                    {selectedOrder && selectedOrder.orderId === order.orderId ? (
                        <LoadingSpinner size={15} boxStyle={{ height: '5vh' }} />
                    ) : (
                        <Tooltip title={!walletConnected ? 'Connect Wallet to buy order' : ''}>
                            <span>
                                <StyledButton
                                    variant="contained"
                                    onClick={() => handleSelect(order)}
                                    disabled={selectedOrder !== null || !walletConnected}
                                    size="small"
                                    sx={{
                                        fontSize: '0.5rem',

                                        '&.MuiButton-root': {
                                            padding: '0.4rem',
                                            minWidth: '0.5rem',
                                        },
                                    }}
                                >
                                    Buy
                                </StyledButton>
                            </span>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default OrderItem;
