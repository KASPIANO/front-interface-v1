import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import TokenDataGrid from '../../components/krc-20-page/grid-krc-20/Krc20Grid';
import { StyledDataGridContainer } from '../../components/krc-20-page/grid-krc-20/Krc20Grid.s';
import GridTitle from '../../components/krc-20-page/grid-title-sort/GridTitle';
import { countTokens } from '../../DAL/BackendDAL';
import { useFetchTokens } from '../../DAL/UseQueriesBackend';
import { GridLayout } from './GridPageLayout';

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
    const [sortParams, setSortParams] = useState({ field: '', asc: false });
    const [page, setPage] = useState(0);
    const [activeHeader, setActiveHeader] = useState<string>('');
    const [changeTotalMintsDisabled, setChangeTotalMintsActive] = useState(true);
    const {
        data: tokenList,
        isLoading,
        error,
    } = useFetchTokens(
        PAGE_TOKENS_COUNT,
        sortParams.field,
        sortParams.field ? (sortParams.asc ? 'asc' : 'desc') : null,
        timeInterval,
        page,
    );
    const { data: totalTokensDeployed, isLoading: isTotalTokenIsLoading } = useQuery({
        queryKey: ['countTokens'], // Query key to uniquely identify this query
        queryFn: countTokens, // Function to fetch data
        staleTime: Infinity, // Data won't be refetched until explicitly invalidated
        gcTime: Infinity, // Data remains cached indefinitely
    });

    const onSortBy = (field: string, asc: boolean) => {
        setPage(0); // Reset to first page when sorting
        setSortParams({ field, asc });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleTimeIntervalChange = (newInterval: string) => {
        setPage(0); // Reset to first page when time interval changes
        setTimeInterval(newInterval);
    };
    const totalPages = Math.ceil(totalTokensDeployed / PAGE_TOKENS_COUNT);
    return (
        <GridLayout backgroundBlur={backgroundBlur}>
            <GridTitle
                changeTotalMintsDisabled={changeTotalMintsDisabled}
                setChangeTotalMintsActive={setChangeTotalMintsActive}
                timeInterval={timeInterval}
                setTimeInterval={handleTimeIntervalChange}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onSortBy={onSortBy}
                isLoading={isLoading && isTotalTokenIsLoading}
                setActiveHeader={setActiveHeader}
            />
            <StyledDataGridContainer>
                <TokenDataGrid
                    setChangeTotalMintsActive={setChangeTotalMintsActive}
                    setActiveHeader={setActiveHeader}
                    activeHeader={activeHeader}
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
        </GridLayout>
    );
};

export default GridPage;
