// BuyPanel.tsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { BackendTokenResponse, Order } from '../../../../../types/Types';
import OrderList from './order-list/OrderList';
import PaginationControls from './pagiantion-controls/PaginationControls';
import BuyHeader from './buy-header/BuyHeader';

// mockOrders.ts

export const mockOrders: Order[] = [
    {
        orderId: 'order1',
        tokenAmount: 100,
        totalPrice: 500,
        pricePerToken: 5.0,
    },
    {
        orderId: 'order2',
        tokenAmount: 50,
        totalPrice: 275,
        pricePerToken: 5.5,
    },
    {
        orderId: 'order3',
        tokenAmount: 200,
        totalPrice: 900,
        pricePerToken: 4.5,
    },
    {
        orderId: 'order4',
        tokenAmount: 75,
        totalPrice: 412.5,
        pricePerToken: 5.5,
    },
    {
        orderId: 'order5',
        tokenAmount: 150,
        totalPrice: 825,
        pricePerToken: 5.5,
    },
    {
        orderId: 'order6',
        tokenAmount: 80,
        totalPrice: 400,
        pricePerToken: 5.0,
    },
    {
        orderId: 'order7',
        tokenAmount: 60,
        totalPrice: 330,
        pricePerToken: 5.5,
    },
    {
        orderId: 'order8',
        tokenAmount: 90,
        totalPrice: 427.5,
        pricePerToken: 4.75,
    },
    {
        orderId: 'order9',
        tokenAmount: 110,
        totalPrice: 605,
        pricePerToken: 5.5,
    },
    {
        orderId: 'order10',
        tokenAmount: 130,
        totalPrice: 650,
        pricePerToken: 5.0,
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('pricePerToken');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

            const pageSize = 10;
            const startIndex = (currentPage - 1) * pageSize;
            const paginatedOrders = sortedOrders.slice(startIndex, startIndex + pageSize);
            const totalPages = Math.ceil(sortedOrders.length / pageSize);

            setOrders(paginatedOrders);
            setTotalPages(totalPages);
        };
        fetchOrders();
    }, [tokenInfo, currentPage, sortBy, sortOrder, orders]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSortChange = (sortBy: string) => {
        setSortBy(sortBy);
        setCurrentPage(1); // Reset to first page when sorting changes
    };
    const handleOrderExpand = (orderId: string) => {
        setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
    };

    return (
        <Box>
            <BuyHeader sortBy={sortBy} onSortChange={handleSortChange} />
            <OrderList
                walletConnected={walletConnected}
                walletBalance={walletBalance}
                kasPrice={kasPrice}
                orders={orders}
                onOrderExpand={handleOrderExpand}
                expandedOrderId={expandedOrderId}
                floorPrice={tokenInfo.price}
            />
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </Box>
    );
};

export default BuyPanel;
