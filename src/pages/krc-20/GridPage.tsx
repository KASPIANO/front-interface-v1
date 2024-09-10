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

    const onSortBy = (field: string, asc: boolean) => {
        setPage(0); // Reset to first page when sorting
        setSortParams({ field, asc });
    };

    useEffect(() => {
        countTokens().then((result) => {
            setTotalTokensDeployed(result);
        });
    }, []);

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
                isLoading={isLoading}
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
