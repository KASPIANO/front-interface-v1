import { Box, List, Table, TableCell, TableHead, TableRow } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useState } from 'react';
import { TokenRowActivityItem } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { StyledPortfolioGridContainer } from './PortfolioActivityTokenGrid.s';
import TokenRowActivity from '../token-row-activity/TokenRowActivity';
import { PrevPageButton, NextPageButton } from '../../krc-20-page/grid-title-sort/GridTitle.s';

interface PortfolioActivityTokenGridProps {
    tokensActivityList: TokenRowActivityItem[];
    kasPrice: number;
    walletConnected: boolean;
    isLoading: boolean;
    walletBalance: number;
    tickers: string[];
    handleActivityPagination: (direction: 'next' | 'prev') => void;
    lastActivityPage: boolean;
}

enum GridHeaders {
    TICKER = 'TICKER',
    AMOUNT = 'AMOUNT',
    TYPE = 'TYPE',
    TIME = 'TIME',
}

const PortfolioActivityTokenGrid: FC<PortfolioActivityTokenGridProps> = (props) => {
    const {
        kasPrice,
        walletConnected,
        walletBalance,
        tokensActivityList,
        handleActivityPagination,
        lastActivityPage,
    } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
        handleActivityPagination('prev');
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
        handleActivityPagination('next');
    };
    const tableHeader = (
        <Box
            sx={{
                height: '8vh',
                alignContent: 'center',
                borderBottom: '0.1px solid rgba(111, 199, 186, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <Table style={{ width: '60%' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '33%', borderBottom: 0 }}>{GridHeaders.TICKER}</TableCell>
                        <TableCell sx={{ width: '33%', borderBottom: 0 }}>{GridHeaders.AMOUNT}</TableCell>
                        <TableCell sx={{ width: '33%', borderBottom: 0 }}>{GridHeaders.TYPE}</TableCell>
                        <TableCell sx={{ width: '33%', borderBottom: 0 }}>{GridHeaders.TIME}</TableCell>
                    </TableRow>
                </TableHead>
            </Table>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: '2vw' }}>
                <PrevPageButton onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </PrevPageButton>
                <NextPageButton onClick={handleNextPage} disabled={lastActivityPage}>
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
                <p style={{ textAlign: 'center', fontSize: '1vw', marginTop: '10vh' }}>
                    <b>Please connect your wallet to view the portfolio.</b>
                </p>
            ) : (
                <List
                    dense
                    sx={{
                        width: '100%',
                        overflowX: 'hidden',
                    }}
                >
                    {tokensActivityList.length > 0
                        ? tokensActivityList.map((token) => (
                              <TokenRowActivity
                                  token={token}
                                  key={token.ticker}
                                  walletConnected={walletConnected}
                                  walletBalance={walletBalance}
                                  kasPrice={kasPrice}
                              />
                          ))
                        : // Replace single Skeleton with multiple Skeletons
                          [...Array(5)].map((_, index) => <Skeleton key={index} width={'100%'} height={'12vh'} />)}
                </List>
            )}
            {tokensActivityList.length === 0 && walletConnected && (
                <p style={{ textAlign: 'center', fontSize: '1vw' }}>
                    <b>End of list</b>
                </p>
            )}
        </StyledPortfolioGridContainer>
    );
};

export default PortfolioActivityTokenGrid;
