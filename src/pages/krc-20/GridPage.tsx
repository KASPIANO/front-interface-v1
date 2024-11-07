import { FC, useState } from 'react';
import TokenDataGrid from '../../components/krc-20-page/grid-krc-20/Krc20Grid';
import { StyledDataGridContainer } from '../../components/krc-20-page/grid-krc-20/Krc20Grid.s';
import GridTitle from '../../components/krc-20-page/grid-title-sort/GridTitle';
import { useFetchCountTokensQuery, useFetchTokens } from '../../DAL/UseQueriesBackend';
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
    const [changeTotalHoldersDisabled, setChangeTotalHoldersActive] = useState(true);
    const [changeMCDisabled, setChangeMCActive] = useState(true);
    const {
        data: tokenList,
        isLoading: isTokenListLoading,
        error,
    } = useFetchTokens(
        PAGE_TOKENS_COUNT,
        sortParams.field,
        sortParams.field ? (sortParams.asc ? 'asc' : 'desc') : null,
        timeInterval,
        page,
    );
    const { data: totalTokensDeployed, isLoading: isTotalTokenLoading } = useFetchCountTokensQuery();
    const totalPages = Math.ceil(totalTokensDeployed / PAGE_TOKENS_COUNT);

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
                isLoading={isTokenListLoading && isTotalTokenLoading}
                setActiveHeader={setActiveHeader}
                setChangeMCActive={setChangeMCActive}
                changeMCDisabled={changeMCDisabled}
                setChangeTotalHoldersActive={setChangeTotalHoldersActive}
                changeTotalHoldersDisabled={changeTotalHoldersDisabled}
            />
            <StyledDataGridContainer>
                <TokenDataGrid
                    setChangeTotalMintsActive={setChangeTotalMintsActive}
                    setChangeMCActive={setChangeMCActive}
                    setChangeTotalHoldersActive={setChangeTotalHoldersActive}
                    setActiveHeader={setActiveHeader}
                    activeHeader={activeHeader}
                    walletConnected={walletConnected}
                    walletBalance={walletBalance}
                    tokensList={tokenList || []}
                    sortBy={onSortBy}
                    walletAddress={walletAddress}
                    timeInterval={timeInterval}
                    isLoading={isTokenListLoading}
                    error={error}
                />
            </StyledDataGridContainer>
        </GridLayout>
    );
};

export default GridPage;
