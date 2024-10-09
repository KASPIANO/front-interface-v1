import React, { useState } from 'react';
import { ListItem, Typography, ListItemText, Tooltip, Divider, ListItemButton } from '@mui/material';
import { Order } from '../../../../types/Types';
import { mapSellOrderStatusToDisplayText } from '../../../../utils/Utils';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { showGlobalSnackbar } from '../../../alert-context/AlertContext';

interface OrdersHIstoryRowProps {
    order: Order;
    kasPrice: number;
    walletConnected: boolean;
}

const OrdersHIstoryRow: React.FC<OrdersHIstoryRowProps> = (props) => {
    const { order, kasPrice } = props;
    const [, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopied(true);
                showGlobalSnackbar({
                    message: 'Copied to clipboard',
                    severity: 'success',
                });
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    const formatPrice = (price: number) => {
        if (price >= 1) return price.toFixed(2);
        if (price >= 0.01) return price.toFixed(3);
        return price.toFixed(5);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // Customize as per your requirement
    };

    return (
        <div key={order.orderId}>
            <ListItem disablePadding sx={{ height: '12vh' }}>
                {/* Order Ticker */}
                <ListItemText
                    sx={{ width: '5.5vw', marginLeft: '1rem' }}
                    primary={
                        <Typography variant="body1" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {order.ticker}
                        </Typography>
                    }
                />

                {/* Created At */}
                <ListItemText
                    sx={{ width: '10vw' }}
                    primary={
                        <Typography
                            variant="body1"
                            sx={{ fontSize: '0.75rem', fontWeight: 'bold', justifyContent: 'center' }}
                        >
                            {formatDate(order.createdAt)}
                        </Typography>
                    }
                />
                <ListItemText
                    sx={{ width: '8vw' }}
                    primary={
                        <Typography variant="body1" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {mapSellOrderStatusToDisplayText(order.status)}
                        </Typography>
                    }
                />

                {/* Quantity */}
                <ListItemText
                    sx={{ width: '7vw' }}
                    primary={
                        <Typography variant="body1" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {order.quantity}
                        </Typography>
                    }
                />

                {/* Price Per Token */}
                <ListItemText
                    sx={{ width: '7vw' }}
                    primary={
                        <Tooltip title={`${order.pricePerToken} KAS`}>
                            <Typography
                                variant="body1"
                                style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                }}
                            >
                                {formatPrice(order.pricePerToken)}
                            </Typography>
                        </Tooltip>
                    }
                />

                {/* Total Price */}
                <ListItemText
                    sx={{ width: '6vw' }}
                    primary={
                        <Typography
                            variant="body1"
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                display: 'flex',
                            }}
                        >
                            {order.totalPrice.toFixed(2)} KAS
                        </Typography>
                    }
                    secondary={
                        <Typography
                            variant="body2"
                            style={{
                                fontSize: '0.7rem',
                                display: 'flex',
                                color: 'gray', // Optional: to differentiate the secondary text
                            }}
                        >
                            (${(order.totalPrice * kasPrice).toFixed(2)})
                        </Typography>
                    }
                />
                <ListItemButton onClick={() => copyToClipboard(order.orderId)} sx={{ width: '2vw' }}>
                    <Tooltip title="Copy Order ID">
                        <ContentCopyRoundedIcon fontSize="small" />
                    </Tooltip>
                </ListItemButton>
            </ListItem>
            <Divider />
        </div>
    );
};

export default OrdersHIstoryRow;
