import { Box, List, Table, TableCell, TableHead, TableRow } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC } from 'react';
import { TokenRowPortfolioItem } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { StyledPortfolioGridContainer } from './PortfolioTokenGrid.s';
import TokenRowPortfolio from '../token-row-portfolio/TokenRowPortfolio';

interface PortfolioTokenGridProps {
    tokensList: TokenRowPortfolioItem[];
    kasPrice: number;
    walletConnected: boolean;
    isLoading: boolean;
    walletBalance: number;
}

enum GridHeaders {
    TICKER = 'TICKER',
    BALANCE = 'BALANCE',
    ACTIONS = 'ACTIONS',
}

const PortfolioTokenGrid: FC<PortfolioTokenGridProps> = (props) => {
    const { tokensList, kasPrice, walletConnected, walletBalance } = props;

    const tableHeader = (
        <Box
            sx={{
                height: '8vh',
                alignContent: 'center',
                borderBottom: '0.1px solid rgba(111, 199, 186, 0.3)',
            }}
        >
            <Table style={{ width: '90%', marginLeft: '0.9vw' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '33%', borderBottom: 0 }}>{GridHeaders.TICKER}</TableCell>
                        <TableCell sx={{ width: '33%', borderBottom: 0 }}>{GridHeaders.BALANCE}</TableCell>
                        <TableCell sx={{ width: '33%', borderBottom: 0 }}>{GridHeaders.ACTIONS}</TableCell>
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
                    {tokensList.length > 0
                        ? tokensList.map((token) => (
                              <TokenRowPortfolio
                                  walletBalance={walletBalance}
                                  key={token.ticker}
                                  token={token}
                                  walletConnected={walletConnected}
                                  kasPrice={kasPrice}
                              />
                          ))
                        : // Replace single Skeleton with multiple Skeletons
                          [...Array(5)].map((_, index) => <Skeleton key={index} width={'100%'} height={'12vh'} />)}
                </List>
            )}
            {tokensList.length === 0 && walletConnected && (
                <p style={{ textAlign: 'center', fontSize: '1vw' }}>
                    <b>End of list</b>
                </p>
            )}
        </StyledPortfolioGridContainer>
    );
};

export default PortfolioTokenGrid;
