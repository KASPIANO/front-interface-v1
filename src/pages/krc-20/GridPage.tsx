import { FC, useEffect, useState } from 'react';
import TokenDataGrid from '../../components/krc-20-page/grid-krc-20/Krc20Grid';
import { TokenListItemResponse } from '../../types/Types';
import { GridLayout } from './GridPageLayout';

import { Skeleton } from '@mui/material';
import { StyledDataGridContainer } from '../../components/krc-20-page/grid-krc-20/Krc20Grid.s';
import GridTitle from '../../components/krc-20-page/grid-title-sort/GridTitle';
import { countTokens } from '../../DAL/BackendDAL';
import { useFetchAllTokens } from '../../DAL/UseQueriesBackend';

interface GridPageProps {
    walletAddress: string | null;
    walletBalance: number;
    walletConnected: boolean;
    backgroundBlur: boolean;
}

const PAGE_TOKENS_COUNT = 50;

const GridPage: FC<GridPageProps> = (props) => {
    const { walletBalance, walletConnected, backgroundBlur } = props;

    const [tokensList, setTokensList] = useState<TokenListItemResponse[]>([]);
    const [nextPage, setNextPage] = useState<number>(1);
    const [totalTokensDeployed, setTotalTokensDeployed] = useState(0);
    const [sortParams, setSortParams] = useState({ field: '', asc: false });
    const { isPending, data, isLoading } = useFetchAllTokens(
        PAGE_TOKENS_COUNT,
        tokensList.length,
        sortParams.field,
        sortParams.field ? (sortParams.asc ? 'asc' : 'desc') : null,
    );

    const onSortBy = (field: string, asc: boolean) => {
        setTokensList([]);
        setSortParams({ field, asc });
        setNextPage(1);
    };

    useEffect(() => {
        countTokens().then((result) => {
            setTotalTokensDeployed(result);
        });
    }, []);

    return (
        <GridLayout backgroundBlur={backgroundBlur}>
            <GridTitle />
            <StyledDataGridContainer>
                {isLoading || isPending ? (
                    <Skeleton width={'inherit'} height={'inherit'} />
                ) : (
                    <TokenDataGrid
                        walletConnected={walletConnected}
                        walletBalance={walletBalance}
                        nextPage={nextPage}
                        totalTokensDeployed={totalTokensDeployed}
                        tokensList={data}
                        setNextPage={setNextPage}
                        sortBy={onSortBy}
                    />
                )}
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
