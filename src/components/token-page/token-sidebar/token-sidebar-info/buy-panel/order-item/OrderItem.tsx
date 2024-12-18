import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { DecentralizedOrder, MixedOrder, Order } from '../../../../../../types/Types';
import { OrderItemPrimary, OrderItemSecondary } from './OrderItem.s';
import { StyledButton } from '../../sell-panel/SellPanel.s';
import LoadingSpinner from '../../../../../common/spinner/LoadingSpinner';
import { formatNumberWithCommas } from '../../../../../../utils/Utils';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

interface OrderItemProps {
    order: MixedOrder;
    floorPrice: number;
    kasPrice: number;
    onSelect: (order: MixedOrder) => void;
    selectedOrder: MixedOrder | null;
    setSelectedOrder;
    walletConnected: boolean;
    ticker: string;
    onSelectV2;
}

const OrderItem: React.FC<OrderItemProps> = (props) => {
    const { order, onSelect, kasPrice, selectedOrder, setSelectedOrder, walletConnected, ticker, onSelectV2 } =
        props;

    // const floorPriceDifference = ((order.pricePerToken - floorPrice) / floorPrice) * 100;

    const handleSelect = async (order: Order | DecentralizedOrder) => {
        setSelectedOrder(order);
        if (order.isDecentralized) {
            await onSelectV2(order);
        } else {
            await onSelect(order);
        }
    };

    const formatPrice = (price: number) => {
        if (price >= 1) {
            return price.toFixed(3);
        } else if (price >= 0.01) {
            return price.toFixed(4);
        } else if (price >= 0.0001) {
            return price.toFixed(5);
        } else {
            return price.toFixed(6); // Adjust precision as needed
        }
    };

    return (
        <Box sx={{ borderBottom: '0.5px solid  rgba(111, 199, 186, 0.5)', width: '100%', padding: '10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Amount with Floor Difference */}
                <Box sx={{ width: '17%', display: 'flex', alignItems: 'center' }}>
                    <OrderItemPrimary variant="body2">
                        {formatNumberWithCommas(order.quantity)}{' '}
                        <Box component="span" sx={{ fontSize: '0.5rem', display: 'inline' }}>
                            {ticker}
                        </Box>
                    </OrderItemPrimary>

                    {/* Add Info Icon if order.isOwner is true */}
                    {order.isOwner && (
                        <Tooltip title="This order is yours">
                            <InfoRoundedIcon
                                sx={{
                                    fontSize: '0.7rem', // Adjust icon size
                                    color: 'rgba(111, 199, 186, 0.8)', // Adjust color if needed
                                }}
                            />
                        </Tooltip>
                    )}
                </Box>
                {/* Price per Token */}
                <Box sx={{ width: '20%' }}>
                    <Tooltip title={`${order.pricePerToken} KAS`}>
                        <OrderItemPrimary variant="body2">
                            {formatPrice(order.pricePerToken)}{' '}
                            <Box component="span" sx={{ fontSize: '0.5rem', display: 'inline' }}>
                                {/* Adjust fontSize as needed */}
                                KAS
                            </Box>
                        </OrderItemPrimary>
                    </Tooltip>
                    <OrderItemSecondary variant="caption" color="textSecondary">
                        (${(order.pricePerToken * kasPrice).toFixed(5)})
                    </OrderItemSecondary>
                </Box>
                <Box sx={{ width: '15%' }}>
                    <OrderItemPrimary variant="body2">
                        {formatNumberWithCommas(order.totalPrice.toFixed(2))}{' '}
                        <Box component="span" sx={{ fontSize: '0.5rem', display: 'inline' }}>
                            {/* Adjust fontSize as needed */}
                            KAS
                        </Box>
                    </OrderItemPrimary>
                    <OrderItemSecondary variant="caption" color="textSecondary">
                        (${formatNumberWithCommas((order.totalPrice * kasPrice).toFixed(2))})
                    </OrderItemSecondary>
                </Box>
                {/* Total Price */}
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
