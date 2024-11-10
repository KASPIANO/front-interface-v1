import React from 'react';
import { Order } from '../../../../../../types/Types';
import OrderItem from '../order-item/OrderItem';

interface OrderListProps {
    orders: Order[];
    floorPrice: number;
    kasPrice: number;
    walletBalance: number;
    walletConnected: boolean;
    onOrderSelect: (order: Order) => void;
    selectedOrder: Order | null;
    setSelectedOrder: (order: Order) => void;
    ticker: string;
}

const OrderList: React.FC<OrderListProps> = ({
    orders,
    onOrderSelect,
    floorPrice,
    kasPrice,
    selectedOrder,
    walletConnected,
    setSelectedOrder,
    ticker,
}) => (
    <div style={{ width: '100%' }}>
        {/* Header Row */}

        {/* Order Items */}
        {orders.map((order) => (
            <OrderItem
                ticker={ticker}
                setSelectedOrder={setSelectedOrder}
                selectedOrder={selectedOrder}
                onSelect={onOrderSelect}
                key={order.orderId}
                order={order}
                floorPrice={floorPrice}
                kasPrice={kasPrice}
                walletConnected={walletConnected}
            />
        ))}
    </div>
);

export default OrderList;
