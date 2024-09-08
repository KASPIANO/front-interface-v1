import { FC, useEffect, useState } from 'react';
import TokenDataGrid from '../../components/krc-20-page/grid-krc-20/Krc20Grid';
import { GridLayout } from './GridPageLayout';
import { StyledDataGridContainer } from '../../components/krc-20-page/grid-krc-20/Krc20Grid.s';
import GridTitle from '../../components/krc-20-page/grid-title-sort/GridTitle';
import { countTokens } from '../../DAL/BackendDAL';
import { useFetchTokens } from '../../DAL/UseQueriesBackend';

interface GridPageProps {
    walletAddress: string | null;
    walletBalance: number;
    walletConnected: boolean;
    backgroundBlur: boolean;
}

const PAGE_TOKENS_COUNT = 50;

const GridPage: FC<GridPageProps> = (props) => {
    const { walletBalance, walletConnected, backgroundBlur, walletAddress } = props;
    const [timeInterval, setTimeInterval] = useState<string>('10m');
    const [totalTokensDeployed, setTotalTokensDeployed] = useState(0);
    const [sortParams, setSortParams] = useState({ field: '', asc: false });
    const [page, setPage] = useState(1);
    const {
        data: tokenList,
        isLoading,
        error,
        refetch,
    } = useFetchTokens(
        PAGE_TOKENS_COUNT,
        sortParams.field,
        sortParams.field ? (sortParams.asc ? 'asc' : 'desc') : null,
        timeInterval,
        page,
    );

    const onSortBy = (field: string, asc: boolean) => {
        setSortParams({ field, asc });
        setPage(1); // Reset to first page when sorting
        refetch(); // Explicitly refetch data when sorting changes
    };

    useEffect(() => {
        countTokens().then((result) => {
            setTotalTokensDeployed(result);
        });
    }, []);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        refetch(); // Explicitly refetch data when page changes
    };

    const handleTimeIntervalChange = (newInterval: string) => {
        setTimeInterval(newInterval);
        setPage(1); // Reset to first page when time interval changes
        refetch(); // Explicitly refetch data when time interval changes
    };
    const totalPages = Math.ceil(totalTokensDeployed / PAGE_TOKENS_COUNT);
    return (
        <GridLayout backgroundBlur={backgroundBlur}>
            <GridTitle
                timeInterval={timeInterval}
                setTimeInterval={handleTimeIntervalChange}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <StyledDataGridContainer>
                <TokenDataGrid
                    walletConnected={walletConnected}
                    walletBalance={walletBalance}
                    tokensList={tokenList || []}
                    sortBy={onSortBy}
                    walletAddress={walletAddress}
                    timeInterval={timeInterval}
                    isLoading={isLoading}
                    error={error}
                />
            </StyledDataGridContainer>
            {/* {showNotification && walletAddress && (
                <NotificationComponent
                    message={`Connected to wallet ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`}
                    onClose={() => setShowNotification(false)}
                />
            )} */}
        </GridLayout>
    );
};

export default GridPage;
