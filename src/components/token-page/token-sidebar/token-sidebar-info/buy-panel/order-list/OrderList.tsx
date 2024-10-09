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
    isProccesing: boolean;
    setIsProcessing: (value: boolean) => void;
    setSelectedOrder: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({
    orders,
    onOrderSelect,
    floorPrice,
    kasPrice,
    selectedOrder,
    isProccesing,
    setIsProcessing,
    setSelectedOrder,
}) => (
    <div style={{ width: '100%' }}>
        {/* Header Row */}

        {/* Order Items */}
        {orders.map((order) => (
            <OrderItem
                setSelectedOrder={setSelectedOrder}
                isProccesing={isProccesing}
                setIsProcessing={setIsProcessing}
                selectedOrder={selectedOrder}
                onSelect={onOrderSelect}
                key={order.orderId}
                order={order}
                floorPrice={floorPrice}
                kasPrice={kasPrice}
            />
        ))}
    </div>
);

export default OrderList;
