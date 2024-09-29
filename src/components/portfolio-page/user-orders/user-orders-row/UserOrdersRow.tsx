import React from 'react';
import { ListItem, Typography, Avatar, Box, ListItemAvatar, ListItemText, Tooltip } from '@mui/material';
import { Order } from '../../../../types/Types';

interface UserOrdersRowProps {
    order: Order;
    kasPrice: number;
    walletConnected: boolean;
}

const UserOrdersRow: React.FC<UserOrdersRowProps> = (props) => {
    const { order, kasPrice, walletConnected } = props;

    const formatPrice = (price: number) => {
        if (price >= 1) return price.toFixed(2);
        if (price >= 0.01) return price.toFixed(3);
        return price.toFixed(6);
    };

    return (
        <div key={order.orderId}>
            <ListItem disablePadding sx={{ height: '12vh' }}>
                {/* Order ID Avatar (if needed) */}
                <ListItemAvatar>
                    <Avatar
                        sx={{
                            width: '7vh',
                            height: '7vh',
                        }}
                        style={{
                            marginLeft: '0.1vw',
                            borderRadius: 8,
                        }}
                        variant="square"
                        alt={order.orderId}
                        src="/path/to/icon" // Placeholder for any relevant icon/image for order
                    />
                </ListItemAvatar>

                {/* Order Quantity */}
                <ListItemText
                    sx={{ width: '5vw' }}
                    primary={
                        <Typography variant="body1" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {order.quantity}
                        </Typography>
                    }
                />

                {/* Price Per Token */}
                <ListItemText
                    sx={{ width: '13vw' }}
                    primary={
                        <Tooltip title={`${order.pricePerToken} KAS`}>
                            <Typography
                                variant="body1"
                                style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                {formatPrice(order.pricePerToken)}
                            </Typography>
                        </Tooltip>
                    }
                />

                {/* Total Price */}
                <ListItemText
                    sx={{ width: '13vw' }}
                    primary={
                        <Typography
                            variant="body1"
                            style={{
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            {order.totalPrice.toFixed(2)} (${(order.totalPrice * kasPrice).toFixed(2)})
                        </Typography>
                    }
                />

                {/* Action - Buy Button */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        width: '26vw',
                        justifyContent: 'center',
                        paddingRight: '6rem',
                    }}
                >
                    {/* <Button
                        onClick={() => handleBuyClick(order.orderId)}
                        variant="contained"
                        color="primary"
                        sx={{
                            minWidth: '2vw',
                            width: '4vw',
                            fontSize: '0.6rem',
                        }}
                    >
                        Buy
                    </Button> */}
                </Box>
            </ListItem>
        </div>
    );
};

export default UserOrdersRow;
