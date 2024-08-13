import { FC, useEffect, useState } from 'react';
import TokenDataGrid from '../../components/krc-20-page/grid-krc-20/Krc20Grid';
import { TokenListItem } from '../../types/Types';
import { GridLayout } from './GridPageLayout';

import GridTitle from '../../components/krc-20-page/grid-title-sort/GridTitle';
import { countTokens, fetchAllTokens } from '../../DAL/BackendDAL';

interface GridPageProps {
    walletAddress: string | null;
    walletBalance: number;
    walletConnected: boolean;
    backgroundBlur: boolean;
}

const PAGE_TOKENS_COUNT = 50;

const GridPage: FC<GridPageProps> = (props) => {
    const { walletBalance, walletConnected, backgroundBlur } = props;

    const [tokensList, setTokensList] = useState<TokenListItem[]>([]);
    const [nextPage, setNextPage] = useState<number>(1);
    const [totalTokensDeployed, setTotalTokensDeployed] = useState(0);
    const [sortParams, setSortParams] = useState({ field: '', asc: false });

    const fetchTokensList = async () => {
        const sortBy = sortParams.field;
        const sortDirection = sortParams.field ? (sortParams.asc ? 'asc' : 'desc') : null;
        const currentTokens = await fetchAllTokens(PAGE_TOKENS_COUNT, tokensList.length, sortBy, sortDirection);
        setTokensList((prevTokensList) => [...prevTokensList, ...currentTokens]);
    };

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

    useEffect(() => {
        fetchTokensList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextPage, sortParams]);

    return (
        <GridLayout backgroundBlur={backgroundBlur}>
            <GridTitle />
            <TokenDataGrid
                walletConnected={walletConnected}
                walletBalance={walletBalance}
                nextPage={nextPage}
                totalTokensDeployed={totalTokensDeployed}
                tokensList={tokensList}
                setNextPage={setNextPage}
                sortBy={onSortBy}
            />

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
