import { Box, List, Table, TableCell, TableHead, TableRow } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useEffect, useState } from 'react';
import { TokenRowActivityItem } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { StyledPortfolioGridContainer } from './PortfolioActivityTokenGrid.s';
import TokenRowActivity from '../token-row-activity/TokenRowActivity';
import { PrevPageButton, NextPageButton } from '../../krc-20-page/grid-title-sort/GridTitle.s';
import { fetchWalletActivity } from '../../../DAL/Krc20DAL';
import { isEmptyString } from '../../../utils/Utils';

interface PortfolioActivityTokenGridProps {
    kasPrice: number;
    walletConnected: boolean;
    walletBalance: number;
    tickers: string[];
    walletAddress: string | null;
    operationFinished: boolean;
    currentWalletToCheck: string;
}

enum GridHeaders {
    TICKER = 'TICKER',
    AMOUNT = 'AMOUNT',
    TYPE = 'TYPE',
    TIME = 'TIME',
}

const PortfolioActivityTokenGrid: FC<PortfolioActivityTokenGridProps> = (props) => {
    const { kasPrice, walletConnected, walletBalance, walletAddress, operationFinished, currentWalletToCheck } =
        props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [paginationActivityKey, setPaginationActivityKey] = useState<string | null>(null);
    const [paginationActivityDirection, setPaginationActivityDirection] = useState<'next' | 'prev' | null>(null);
    const [activityNext, setActivityNext] = useState<string | null>(null);
    const [activityPrev, setActivityPrev] = useState<string | null>(null);
    const [portfolioAssetsActivity, setPortfolioAssetsActivity] = useState<TokenRowActivityItem[]>([]);
    const [isLoadingActivity, setIsLoadingActivity] = useState<boolean>(false);
    const [lastActivityPage, setLastActivityPage] = useState<boolean>(false);

    const handleActivityPagination = (direction: 'next' | 'prev') => {
        setPortfolioAssetsActivity([]);
        setPaginationActivityDirection(direction);
        setPaginationActivityKey(direction === 'next' ? activityNext : activityPrev);
    };

    useEffect(() => {
        const fetchActivity = async () => {
            setIsLoadingActivity(true);
            setPortfolioAssetsActivity([]);
            const walletToFetchTo = walletConnected ? walletAddress : currentWalletToCheck;
            try {
                const activityData = await fetchWalletActivity(
                    walletToFetchTo,
                    paginationActivityKey,
                    paginationActivityDirection,
                );
                setPortfolioAssetsActivity(activityData.activityItems);
                setActivityNext(activityData.next); // Save the 'next' key for further requests
                setActivityPrev(activityData.prev); // Save the 'prev' key for further requests
                const checkNext = await fetchWalletActivity(walletToFetchTo, activityData.next, 'next');
                if (checkNext.activityItems.length === 0) {
                    setLastActivityPage(true);
                } else {
                    setLastActivityPage(false);
                }
            } catch (error) {
                console.error('Error fetching activity data:', error);
            } finally {
                setIsLoadingActivity(false);
            }
        };

        if ((walletConnected && !isEmptyString(walletAddress)) || !isEmptyString(currentWalletToCheck)) {
            fetchActivity();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress, walletConnected, paginationActivityKey, operationFinished, currentWalletToCheck]);

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
        handleActivityPagination('next');
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => prev - 1);
        handleActivityPagination('prev');
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
                        <TableCell sx={{ width: '33%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.TICKER}
                        </TableCell>
                        <TableCell sx={{ width: '33%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.AMOUNT}
                        </TableCell>
                        <TableCell sx={{ width: '33%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.TYPE}
                        </TableCell>
                        <TableCell sx={{ width: '33%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.TIME}
                        </TableCell>
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
            {!walletConnected && isEmptyString(currentWalletToCheck) ? (
                <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '10vh' }}>
                    <b>Please connect your wallet or enter a Kaspa wallet address to view the portfolio.</b>
                </p>
            ) : (
                <List dense sx={{ width: '100%', overflowX: 'hidden' }}>
                    {isLoadingActivity &&
                        [...Array(5)].map((_, index) => <Skeleton key={index} width={'100%'} height={'12vh'} />)}
                    {portfolioAssetsActivity?.map((token) => (
                        <TokenRowActivity
                            token={token}
                            key={token.ticker}
                            walletConnected={walletConnected}
                            walletBalance={walletBalance}
                            kasPrice={kasPrice}
                        />
                    ))}
                </List>
            )}
            {portfolioAssetsActivity?.length === 0 && walletConnected && (
                <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                    <b>End of list</b>
                </p>
            )}
        </StyledPortfolioGridContainer>
    );
};

export default PortfolioActivityTokenGrid;
