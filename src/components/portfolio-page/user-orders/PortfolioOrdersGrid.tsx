import { Box, List, Table, TableCell, TableHead, TableRow } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useState } from 'react';
import { Order } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { PrevPageButton, NextPageButton } from '../../krc-20-page/grid-title-sort/GridTitle.s';
import { StyledPortfolioGridContainer } from './PortfolioOrdersGrid.s';
import UserOrdersRow from './user-orders-row/UserOrdersRow';

interface PortfolioOrdersGridProps {
    kasPrice: number;
    walletConnected: boolean;
    walletAddress: string | null;
}

enum GridHeaders {
    TICKER = 'TICKER',
    QUANTITY = 'QUANTITY',
    PRICE_PER_TOKEN = 'PRICE PER TOKEN',
    TOTAL_PRICE = 'TOTAL PRICE',
    ACTION = 'ACTION',
}

const PortfolioOrdersGrid: FC<PortfolioOrdersGridProps> = (props) => {
    const { kasPrice, walletConnected, walletAddress } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [orders, setOrders] = useState<Order[]>([]);

    // useEffect(() => {
    //     const fetchUserOrders = async () => {
    //         getUSerListings(currentWallet).then((data) => {
    //             setListings(data);
    //         });
    //     };
    //     if (isUserConnected) {
    //         fetchUserOrders();
    //     }
    // }, [walletAddress, currentWallet]);

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
        // handlePortfolioPagination('prev');
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
        // handlePortfolioPagination('next');
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
            <Box sx={{ display: 'flex', alignItems: 'center', mr: '2vw' }}>
                <PrevPageButton onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </PrevPageButton>
                <NextPageButton onClick={handleNextPage} disabled={false}>
                    Next
                </NextPageButton>
            </Box>
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
                    {orders.length > 0
                        ? orders.map((order) => (
                              <UserOrdersRow
                                  key={order.orderId}
                                  order={order}
                                  walletConnected={walletConnected}
                                  kasPrice={kasPrice}
                              />
                          ))
                        : // Replace single Skeleton with multiple Skeletons
                          [...Array(5)].map((_, index) => <Skeleton key={index} width={'100%'} height={'12vh'} />)}
                </List>
            )}
            {orders.length === 0 && walletConnected && (
                <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                    <b>End of list</b>
                </p>
            )}
        </StyledPortfolioGridContainer>
    );
};

export default PortfolioOrdersGrid;
