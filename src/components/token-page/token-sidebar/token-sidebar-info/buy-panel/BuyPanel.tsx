// BuyPanel.tsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { BackendTokenResponse, Order } from '../../../../../types/Types';
import OrderList from './order-list/OrderList';
import BuyHeader from './buy-header/BuyHeader';
import OrderDetails from './order-details/OrderDetails';
import { showGlobalSnackbar } from '../../../../alert-context/AlertContext';

// mockOrders.ts

const mockOrders: Order[] = [
    {
        orderId: 'order1',
        tokenAmount: 1000000,
        pricePerToken: 0.0001,
        totalPrice: 120.5,
    },
    {
        orderId: 'order2',
        tokenAmount: 50000,
        pricePerToken: 0.002,
        totalPrice: 95.3,
    },
    {
        orderId: 'order3',
        tokenAmount: 1851852,
        pricePerToken: 0.000054,
        totalPrice: 102.75,
    },
    {
        orderId: 'order4',
        tokenAmount: 25000,
        pricePerToken: 0.004,
        totalPrice: 87.65,
    },
    {
        orderId: 'order5',
        tokenAmount: 200000,
        pricePerToken: 0.0005,
        totalPrice: 110.2,
    },
    {
        orderId: 'order6',
        tokenAmount: 100000,
        pricePerToken: 0.001,
        totalPrice: 99.99,
    },
    {
        orderId: 'order7',
        tokenAmount: 60000,
        pricePerToken: 0.00075,
        totalPrice: 80.0,
    },
    {
        orderId: 'order8',
        tokenAmount: 900000,
        pricePerToken: 0.000055,
        totalPrice: 70.45,
    },
    {
        orderId: 'order9',
        tokenAmount: 133333,
        pricePerToken: 0.00075,
        totalPrice: 115.6,
    },
    {
        orderId: 'order10',
        tokenAmount: 50000000,
        pricePerToken: 0.000002,
        totalPrice: 130.0,
    },
];

interface BuyPanelProps {
    tokenInfo: BackendTokenResponse;
    kasPrice: number;
    walletBalance: number;
    walletConnected: boolean;
}

const BuyPanel: React.FC<BuyPanelProps> = (props) => {
    const { tokenInfo, walletBalance, walletConnected, kasPrice } = props;
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [sortBy, setSortBy] = useState('pricePerToken');
    const [sortOrder] = useState<'asc' | 'desc'>('asc');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [timeLeft, setTimeLeft] = useState(235); // 235 seconds = 3 minutes and 55 seconds

    useEffect(() => {
        const handleTimeout = () => {
            showGlobalSnackbar({
                message: 'Purchase canceled due to timeout.',
                severity: 'info',
            });
            handleDrawerClose(); // Close the OrderDetails panel
        };

        // Reset the timer when selectedOrder changes
        setTimeLeft(235);

        const endTime = Date.now() + 235 * 1000; // Calculate the end time

        const timer = setInterval(() => {
            const newTimeLeft = Math.round((endTime - Date.now()) / 1000);

            if (newTimeLeft >= 0) {
                setTimeLeft(newTimeLeft);
            } else {
                // Time is up
                clearInterval(timer);
                handleTimeout();
            }
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, [selectedOrder]);

    useEffect(() => {
        const fetchOrders = async () => {
            // await new Promise((resolve) => setTimeout(resolve, 500));

            const sortedOrders = [...orders];
            sortedOrders.sort((a, b) => {
                if (sortBy === 'totalPrice') {
                    return sortOrder === 'asc' ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
                } else {
                    return sortOrder === 'asc'
                        ? a.pricePerToken - b.pricePerToken
                        : b.pricePerToken - a.pricePerToken;
                }
            });

            setOrders(sortedOrders);
        };
        fetchOrders();
    }, [tokenInfo, sortBy, sortOrder, orders]);

    const handleSortChange = (sortBy: string) => {
        setSortBy(sortBy);
    };
    const handleOrderSelect = (order: Order) => {
        setSelectedOrder(order);
        setIsPanelOpen(true);
    };

    // Handler to close the drawer
    const handleDrawerClose = () => {
        setIsPanelOpen(false);
        setSelectedOrder(null);
    };
    return (
        <Box sx={{ width: '100%' }}>
            <BuyHeader sortBy={sortBy} onSortChange={handleSortChange} />
            <OrderList
                walletConnected={walletConnected}
                walletBalance={walletBalance}
                kasPrice={kasPrice}
                orders={orders}
                onOrderSelect={handleOrderSelect}
                floorPrice={tokenInfo.price}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: isPanelOpen ? 0 : '-100%',
                    height: '45%',
                    width: '100%',
                    backgroundColor: 'background.paper',
                    transition: 'bottom 0.5s ease-in-out',
                    boxShadow: '0px -2px 10px rgba(0,0,0,0.3)',
                    borderRadius: '6px 6px 0 0',
                }}
            >
                {selectedOrder && (
                    <OrderDetails
                        order={selectedOrder}
                        kasPrice={kasPrice}
                        walletConnected={walletConnected}
                        walletBalance={walletBalance}
                        onClose={handleDrawerClose}
                        timeLeft={timeLeft}
                    />
                )}
            </Box>
        </Box>
    );
};

export default BuyPanel;
