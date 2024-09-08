/* eslint-disable @typescript-eslint/no-empty-function */
import { Box, List } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterState, TokenListItemResponse } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { GridHeader } from '../grid-header/GridHeader';
import { TokenRow } from '../token-row-grid/TokenRow';

interface TokenDataGridProps {
    tokensList: TokenListItemResponse[];
    walletBalance: number;
    walletConnected: boolean;
    walletAddress: string | null;
    sortBy: (field: string, asc: boolean) => void;
    timeInterval?: string;
    isLoading: boolean;
    error: any;
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
    const { tokensList, walletBalance, walletConnected, sortBy, walletAddress, isLoading, error } = props;
    const [activeHeader, setActiveHeader] = useState<string>('');
    const [filterStates, setFilterStates] = useState<Record<string, FilterState>>({});
    const navigate = useNavigate();

    const handleItemClick = (token) => {
        navigate(`/token/${token.ticker}`);
    };

    const headerFunction = useCallback(
        (field: string, filterState: FilterState) => {
            setFilterStates((prev) => ({ ...prev, [field]: filterState }));
            setActiveHeader(filterState === FilterState.NONE ? '' : field);

            if (filterState === FilterState.NONE) {
                sortBy(null, null);
            } else {
                sortBy(field, filterState === FilterState.UP);
            }
        },
        [sortBy],
    );

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
                                currentFilterState={filterStates[fieldToSortProp[header]] || FilterState.NONE}
                            />
                        ))}
                    </tr>
                </thead>
            </table>
        </Box>
    );

    const renderContent = () => {
        if (isLoading) {
            return [...Array(10)].map((_, index) => <Skeleton key={index} width={'100%'} height={'12vh'} />);
        }

        if (error) {
            return (
                <Box sx={{ textAlign: 'center', color: 'error.main' }}>Error loading data. Please try again.</Box>
            );
        }

        if (tokensList.length === 0) {
            return <Box sx={{ textAlign: 'center' }}>No tokens found.</Box>;
        }

        return tokensList.map((token) => (
            <TokenRow
                walletConnected={walletConnected}
                key={token.ticker}
                walletBalance={walletBalance}
                tokenKey={token.ticker}
                handleItemClick={handleItemClick}
                token={token}
                walletAddress={walletAddress}
            />
        ));
    };

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
                {renderContent()}
            </List>
        </>
    );
};

export default TokenDataGrid;
