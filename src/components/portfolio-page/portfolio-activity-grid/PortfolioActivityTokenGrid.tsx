import { Box, List, Table, TableCell, TableHead, TableRow } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC } from 'react';
import { TokenRowActivityItem } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { StyledPortfolioGridContainer } from './PortfolioActivityTokenGrid.s';
import TokenRowActivity from '../token-row-activity/TokenRowActivity';

interface PortfolioActivityTokenGridProps {
    tokensActivityList: TokenRowActivityItem[];
    kasPrice: number;
    walletConnected: boolean;
    isLoading: boolean;
    walletBalance: number;
    tickers: string[];
    handleActivityPagination: (direction: 'next' | 'prev') => void;
}

enum GridHeaders {
    TICKER = 'TICKER',
    AMOUNT = 'AMOUNT',
    TYPE = 'TYPE',
    TIME = 'TIME',
}

const PortfolioActivityTokenGrid: FC<PortfolioActivityTokenGridProps> = (props) => {
    const { kasPrice, walletConnected, walletBalance, tokensActivityList, handleActivityPagination } = props;

    const tableHeader = (
        <Box
            sx={{
                height: '8vh',
                alignContent: 'center',
                borderBottom: '0.1px solid rgba(111, 199, 186, 0.3)',
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
