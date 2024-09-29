import { Box, List, Table, TableCell, TableHead, TableRow } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useEffect, useState } from 'react';
import { TokenRowActivityItem } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { StyledPortfolioGridContainer } from './PortfolioActivityTokenGrid.s';
import TokenRowActivity from '../token-row-activity/TokenRowActivity';
import { PrevPageButton, NextPageButton } from '../../krc-20-page/grid-title-sort/GridTitle.s';
import { fetchWalletActivity } from '../../../DAL/Krc20DAL';
import { useFetchPortfolioActivity } from '../../../DAL/KasplexQueries';
import { set } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';

interface PortfolioActivityTokenGridProps {
    kasPrice: number;
    walletConnected: boolean;
    walletBalance: number;
    tickers: string[];
    walletAddress: string | null;
    operationFinished: boolean;
}

enum GridHeaders {
    TICKER = 'TICKER',
    AMOUNT = 'AMOUNT',
    TYPE = 'TYPE',
    TIME = 'TIME',
}

// const [paginationActivityKey, setPaginationActivityKey] = useState<string | null>(null);
// const [paginationActivityDirection, setPaginationActivityDirection] = useState<'next' | 'prev' | null>(null);
// const [activityNext, setActivityNext] = useState<string | null>(null);
// const [activityPrev, setActivityPrev] = useState<string | null>(null);
// const [portfolioAssetsActivity, setPortfolioAssetsActivity] = useState<TokenRowActivityItem[]>([]);
// const [isLoadingActivity, setIsLoadingActivity] = useState<boolean>(false);
// const [lastActivityPage, setLastActivityPage] = useState<boolean>(false);

// const handleActivityPagination = (direction: 'next' | 'prev') => {
//     setPortfolioAssetsActivity([]);
//     setPaginationActivityDirection(direction);
//     setPaginationActivityKey(direction === 'next' ? activityNext : activityPrev);
// };

// useEffect(() => {
//     const fetchActivity = async () => {
//         setIsLoadingActivity(true);
//         setPortfolioAssetsActivity([]);
//         try {
//             const activityData = await fetchWalletActivity(
//                 walletAddress,
//                 paginationActivityKey,
//                 paginationActivityDirection,
//             );
//             setPortfolioAssetsActivity(activityData.activityItems);
//             setActivityNext(activityData.next); // Save the 'next' key for further requests
//             setActivityPrev(activityData.prev); // Save the 'prev' key for further requests
//             const checkNext = await fetchWalletActivity(walletAddress, activityData.next, 'next');
//             if (checkNext.activityItems.length === 0) {
//                 setLastActivityPage(true);
//             } else {
//                 setLastActivityPage(false);
//             }
//         } catch (error) {
//             console.error('Error fetching activity data:', error);
//         } finally {
//             setIsLoadingActivity(false);
//         }
//     };

//     if (walletConnected) {
//         fetchActivity();
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [walletAddress, walletConnected, paginationActivityKey, operationFinished]);

const PortfolioActivityTokenGrid: FC<PortfolioActivityTokenGridProps> = (props) => {
    const { kasPrice, walletConnected, walletBalance, walletAddress, operationFinished } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isNextPageEmpty, setIsNextPageEmpty] = useState<boolean>(false); // Tracks if the next page is empty

    const [paginationKey, setPaginationKey] = useState<string | null>(null);
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
    const { data, isFetching, isLoading } = useFetchPortfolioActivity(
        walletAddress,
        paginationKey,
        direction,
        walletConnected,
    );
    const queryClient = useQueryClient();

    const handleNextPage = async () => {
        if (data?.next) {
            // Pre-check the next page to see if it has data
            queryClient.invalidateQueries({
                queryKey: ['walletActivity', walletAddress], // Ensure you are passing the queryKey inside an object
            });

            const nextPageResult = await fetchWalletActivity(walletAddress, data.next, 'next');

            // If the next page has no data, prevent the user from navigating further
            if (nextPageResult.activityItems.length === 0) {
                setIsNextPageEmpty(true); // No data in the next page
            } else {
                // Update pagination key and direction if data is found
                setPaginationKey(data.next);
                setDirection('next');
                setIsNextPageEmpty(false); // Reset if data is present
                setCurrentPage((prev) => prev + 1);
            }
        }
    };

    // Custom function to fetch the previous page and check if it has data
    const handlePrevPage = async () => {
        if (data?.prev && currentPage > 1) {
            queryClient.invalidateQueries({
                queryKey: ['walletActivity', walletAddress], // Ensure you are passing the queryKey inside an object
            });

            setPaginationKey(data.prev);
            setDirection('prev');
            setCurrentPage((prev) => prev - 1);
        }
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
                <PrevPageButton onClick={handlePrevPage} disabled={!data?.prev || isFetching || currentPage === 1}>
                    {'Prev'}
                </PrevPageButton>
                <NextPageButton onClick={handleNextPage} disabled={!data?.next || isFetching || isNextPageEmpty}>
                    {'Next'}
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
                    <b>Please connect your wallet to view the portfolio.</b>
                </p>
            ) : (
                <List dense sx={{ width: '100%', overflowX: 'hidden' }}>
                    {isLoading &&
                        [...Array(5)].map((_, index) => <Skeleton key={index} width={'100%'} height={'12vh'} />)}
                    {data?.activityItems.map((token) => (
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
            {data?.activityItems.length === 0 && walletConnected && !isFetching && (
                <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                    <b>End of list</b>
                </p>
            )}
        </StyledPortfolioGridContainer>
    );
};

export default PortfolioActivityTokenGrid;
