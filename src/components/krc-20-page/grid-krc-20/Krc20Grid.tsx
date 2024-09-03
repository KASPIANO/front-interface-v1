/* eslint-disable @typescript-eslint/no-empty-function */
import { Box, List } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FilterState, TokenListItemResponse } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { GridHeader } from '../grid-header/GridHeader';
import { TokenRow } from '../token-row-grid/TokenRow';

interface TokenDataGridProps {
    tokensList: TokenListItemResponse[];
    fetchNextPage: () => void;
    totalTokensDeployed: number;
    walletBalance: number;
    walletConnected: boolean;
    walletAddress: string | null;
    sortBy: (field: string, asc: boolean) => void;
}

enum GridHeaders {
    TICKER = 'TICKER',
    AGE = 'AGE',
    SUPPLY = 'SUPPLY',
    MINTED = 'MINTED',
    HOLDERS = 'HOLDERS',
    FAIR_MINT = 'FAIR_MINT',
}

const headersMapper: Record<GridHeaders, { name: string; headerFunction?: boolean }> = {
    [GridHeaders.TICKER]: { name: 'Ticker', headerFunction: true },
    [GridHeaders.AGE]: { name: 'Age', headerFunction: true },
    [GridHeaders.SUPPLY]: { name: 'Supply' },
    [GridHeaders.HOLDERS]: { name: 'Holders', headerFunction: true },
    [GridHeaders.MINTED]: { name: 'Minted', headerFunction: true },
    // [GridHeaders.TOTAL_TXNS]: { name: 'Market Cap', headerFunction: () => {} },
    [GridHeaders.FAIR_MINT]: { name: 'Fair Mint' },
};

const fieldToSortProp = {
    [GridHeaders.TICKER]: 'ticker',
    [GridHeaders.AGE]: 'creationDate',
    [GridHeaders.MINTED]: 'totalMintedPercent',
    [GridHeaders.HOLDERS]: 'totalHolders',
};

const TokenDataGrid: FC<TokenDataGridProps> = (props) => {
    const { tokensList, fetchNextPage, totalTokensDeployed, walletBalance, walletConnected } = props;
    const [activeHeader, setActiveHeader] = useState<string>('');
    const navigate = useNavigate();

    const handleItemClick = (token) => {
        navigate(`/token/${token.ticker}`);
    };

    const headerFunction = (field: string, filterState: FilterState) => {
        if (filterState === FilterState.NONE) {
            props.sortBy(null, null);
        } else {
            props.sortBy(field, filterState === FilterState.UP);
        }
    };

    const tableHeader = (
        <Box
            sx={{
                height: '8vh',
                alignContent: 'center',
                borderBottom: '0.1px solid  rgba(111, 199, 186, 0.3)',
            }}
        >
            <table style={{ width: '100%' }}>
                <thead>
                    <tr style={{ display: 'flex' }}>
                        {Object.keys(GridHeaders).map((header: GridHeaders) => (
                            <GridHeader
                                key={header}
                                name={headersMapper[header].name}
                                headerFunction={
                                    headersMapper[header].headerFunction
                                        ? (filterState) => headerFunction(fieldToSortProp[header], filterState)
                                        : null
                                }
                                activeHeader={activeHeader}
                                setActiveHeader={setActiveHeader}
                            />
                        ))}
                    </tr>
                </thead>
            </table>
        </Box>
    );

    return (
        <>
            <GlobalStyle />
            {tableHeader}
            <List
                id="scrollableList"
                dense
                sx={{
                    width: '100%',
                    overflowX: 'hidden',
                    height: '70vh',
                }}
            >
                <InfiniteScroll
                    dataLength={tokensList.length}
                    next={() => fetchNextPage()}
                    hasMore={tokensList.length < totalTokensDeployed}
                    loader={[...Array(10)].map((_, index) => (
                        <Skeleton key={index} width={'100%'} height={'12vh'} />
                    ))}
                    style={{ overflow: 'initial' }}
                    scrollableTarget="scrollableList"
                    endMessage={
                        <p style={{ textAlign: 'center', fontSize: '1vw' }}>
                            <b>End of list</b>
                        </p>
                    }
                >
                    {tokensList.map((token) => {
                        const tokenKey = `${token.ticker}-${uuidv4()}`;
                        return (
                            <TokenRow
                                walletConnected={walletConnected}
                                key={tokenKey}
                                walletBalance={walletBalance}
                                tokenKey={tokenKey}
                                handleItemClick={handleItemClick}
                                token={token}
                                walletAddress={props.walletAddress}
                            />
                        );
                    })}
                </InfiniteScroll>
            </List>
        </>
    );
};

export default TokenDataGrid;
