import React from 'react';
import { DecentralizedOrder, Order } from '../../../../../../types/Types';
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
    onOrderSelectV2: (order: DecentralizedOrder) => void;
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
    onOrderSelectV2,
}) => (
    <div style={{ width: '100%' }}>
        {/* Header Row */}

        {/* Order Items */}
        {orders.map((order) => (
            <OrderItem
                onSelectV2={onOrderSelectV2}
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
