import React from 'react';
import { Box, Table, TableCell, TableHead, TableRow, Skeleton, Tooltip, List } from '@mui/material';
import { Order } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { StyledPortfolioGridContainer } from '../portfolio-token-grid/PortfolioTokenGrid.s';

interface UserOrdersGridProps {
    orders: Order[];
    kasPrice: number;
    walletConnected: boolean;
    isLoading: boolean;
}

enum GridHeaders {
    TICKER = 'TICKER',
    QUANTITY = 'QUANTITY',
    PRICE_PER_TOKEN = 'PRICE PER TOKEN',
    TOTAL_PRICE = 'TOTAL PRICE',
    ACTION = 'ACTION',
}

const UserOrdersGrid: React.FC<UserOrdersGridProps> = (props) => {
    const { orders, kasPrice, walletConnected, isLoading } = props;

    const formatPrice = (price: number) => {
        if (price >= 1) return price.toFixed(2);
        if (price >= 0.01) return price.toFixed(3);
        return price.toFixed(6);
    };

    const tableHeader = (
        <Box
            sx={{
                height: '8vh',
                alignContent: 'center',
                display: 'flex',
                borderBottom: '0.1px solid rgba(111, 199, 186, 0.3)',
            }}
        >
            <Table style={{ width: '100%', marginLeft: '0.9vw' }}>
                <TableHead>
                    <TableRow>
                        <TableCell>{GridHeaders.TICKER}</TableCell>
                        <TableCell>{GridHeaders.QUANTITY}</TableCell>
                        <TableCell>{GridHeaders.PRICE_PER_TOKEN}</TableCell>
                        <TableCell>{GridHeaders.TOTAL_PRICE}</TableCell>
                        <TableCell>{GridHeaders.ACTION}</TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </Box>
    );

    return (
        <StyledPortfolioGridContainer>
            <GlobalStyle />
            {tableHeader}
            {!walletConnected ? (
                <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '10vh' }}>
                    <b>Please connect your wallet to view your orders.</b>
                </p>
            ) : (
                <List
                    dense
                    sx={{
                        width: '100%',
                        overflowX: 'hidden',
                    }}
                >
                    {isLoading ? (
                        // Loading Skeletons
                        [...Array(5)].map((_, index) => <Skeleton key={index} width={'100%'} height={'12vh'} />)
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <TableRow key={order.orderId}>
                                {/* Order ID */}

                                {/* Quantity */}
                                <TableCell>{order.quantity}</TableCell>

                                {/* Price per Token */}
                                <TableCell>
                                    <Tooltip title={`${order.pricePerToken} KAS`}>
                                        <span>{formatPrice(order.pricePerToken)}</span>
                                    </Tooltip>
                                </TableCell>

                                {/* Total Price */}
                                <TableCell>
                                    {order.totalPrice.toFixed(2)} (${(order.totalPrice * kasPrice).toFixed(2)})
                                </TableCell>

                                {/* Action - Buy Button */}
                            </TableRow>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                            <b>No orders to display</b>
                        </p>
                    )}
                </List>
            )}
        </StyledPortfolioGridContainer>
    );
};

export default UserOrdersGrid;
