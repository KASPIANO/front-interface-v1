import { Box, List, Table, TableCell, TableHead, TableRow } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useState } from 'react';
import { TokenRowPortfolioItem } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { StyledPortfolioGridContainer } from './PortfolioTokenGrid.s';
import TokenRowPortfolio from '../token-row-portfolio/TokenRowPortfolio';
import { PrevPageButton, NextPageButton } from '../../krc-20-page/grid-title-sort/GridTitle.s';
import { isEmptyString } from '../../../utils/Utils';

interface PortfolioTokenGridProps {
    tokensList: TokenRowPortfolioItem[];
    kasPrice: number;
    walletConnected: boolean;
    walletBalance: number;
    handleChange: () => void;
    lastPortfolioPage: boolean;
    handlePortfolioPagination: (direction: 'next' | 'prev') => void;
    isLoading: boolean;
    currentWalletToCheck: string;
}

enum GridHeaders {
    TICKER = 'TICKER',
    BALANCE = 'BALANCE',
    ACTIONS = 'ACTIONS',
    PRICE = 'PRICE',
    TOTAL = 'TOTAL AMOUNT',
}

const PortfolioTokenGrid: FC<PortfolioTokenGridProps> = (props) => {
    const {
        tokensList,
        kasPrice,
        walletConnected,
        walletBalance,
        handleChange,
        lastPortfolioPage,
        handlePortfolioPagination,
        isLoading,
        currentWalletToCheck,
    } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
        handlePortfolioPagination('prev');
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
        handlePortfolioPagination('next');
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
                        <TableCell sx={{ width: '17%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.TICKER}
                        </TableCell>
                        <TableCell sx={{ width: '14.5%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.PRICE}
                        </TableCell>
                        <TableCell sx={{ width: '14%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.BALANCE}
                        </TableCell>
                        <TableCell sx={{ width: '20%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.TOTAL}
                        </TableCell>
                        <TableCell sx={{ width: '15%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.ACTIONS}
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: '2vw' }}>
                <PrevPageButton onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </PrevPageButton>
                <NextPageButton onClick={handleNextPage} disabled={lastPortfolioPage}>
                    Next
                </NextPageButton>
            </Box>
        </Box>
    );

    return (
        <StyledPortfolioGridContainer>
            <GlobalStyle />
            {tableHeader}
            {!walletConnected && isEmptyString(currentWalletToCheck) ? (
                <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '10vh' }}>
                    <b>Please connect your wallet or enter a Kaspa wallet address to view the portfolio.</b>
                </p>
            ) : (
                <List
                    dense
                    sx={{
                        width: '100%',
                        overflowX: 'hidden',
                    }}
                >
                    {tokensList.length > 0 && !isLoading
                        ? tokensList.map((token) => (
                              <TokenRowPortfolio
                                  handleChange={handleChange}
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
                <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                    <b>End of list</b>
                </p>
            )}
        </StyledPortfolioGridContainer>
    );
};

export default PortfolioTokenGrid;
