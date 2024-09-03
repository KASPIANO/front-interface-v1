import { FC, useEffect, useState } from 'react';
import TokenDataGrid from '../../components/krc-20-page/grid-krc-20/Krc20Grid';
import { GridLayout } from './GridPageLayout';
import { StyledDataGridContainer } from '../../components/krc-20-page/grid-krc-20/Krc20Grid.s';
import GridTitle from '../../components/krc-20-page/grid-title-sort/GridTitle';
import { countTokens } from '../../DAL/BackendDAL';
import { useFetchAllTokens } from '../../DAL/UseQueriesBackend';
import { flatten } from 'lodash';

interface GridPageProps {
    walletAddress: string | null;
    walletBalance: number;
    walletConnected: boolean;
    backgroundBlur: boolean;
}

const PAGE_TOKENS_COUNT = 50;

const GridPage: FC<GridPageProps> = (props) => {
    const { walletBalance, walletConnected, backgroundBlur } = props;

    const [totalTokensDeployed, setTotalTokensDeployed] = useState(0);
    const [sortParams, setSortParams] = useState({ field: '', asc: false });
    const { data: tokenListPages, fetchNextPage } = useFetchAllTokens(
        PAGE_TOKENS_COUNT,
        sortParams.field,
        sortParams.field ? (sortParams.asc ? 'asc' : 'desc') : null,
    );

    const onSortBy = (field: string, asc: boolean) => {
        setSortParams({ field, asc });
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
                <TokenDataGrid
                    walletConnected={walletConnected}
                    walletBalance={walletBalance}
                    totalTokensDeployed={totalTokensDeployed}
                    tokensList={flatten(tokenListPages?.pages || [])}
                    fetchNextPage={fetchNextPage}
                    sortBy={onSortBy}
                    walletAddress={props.walletAddress}
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
