import React from 'react';
import { Order } from '../../../../../../types/Types';
import OrderItem from '../order-item/OrderItem';

interface OrderListProps {
    orders: Order[];
    onOrderExpand: (orderId: string) => void;
    expandedOrderId: string | null;
    floorPrice: number;
    kasPrice: number;
    walletBalance: number;
    walletConnected: boolean;
}

const OrderList: React.FC<OrderListProps> = ({
    orders,
    onOrderExpand,
    expandedOrderId,
    floorPrice,
    kasPrice,
    walletBalance,
    walletConnected,
}) => (
    <div>
        {orders.map((order) => (
            <OrderItem
                kasPrice={kasPrice}
                key={order.orderId}
                order={order}
                isExpanded={expandedOrderId === order.orderId}
                onExpand={() => onOrderExpand(order.orderId)}
                floorPrice={floorPrice}
                walletBalance={walletBalance}
                walletConnected={walletConnected}
            />
        ))}
    </div>
);

export default OrderList;
