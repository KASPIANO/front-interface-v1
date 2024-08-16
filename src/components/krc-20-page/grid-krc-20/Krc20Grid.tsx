/* eslint-disable @typescript-eslint/no-empty-function */
import { Box, List } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { FilterState, TokenListItem } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { GridHeader } from '../grid-header/GridHeader';
import { TokenRow } from '../token-row-grid/TokenRow';
import { StyledDataGridContainer } from './Krc20Grid.s';

interface TokenDataGridProps {
    tokensList: TokenListItem[];
    setNextPage: (value: number) => void;
    totalTokensDeployed: number;
    nextPage: number;
    walletBalance: number;
    walletConnected: boolean;
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
    [GridHeaders.TICKER]: 'tick',
    [GridHeaders.AGE]: 'mtsAdd',
    [GridHeaders.MINTED]: 'maxMintedPercent',
    [GridHeaders.HOLDERS]: 'totalHolders',
};

const TokenDataGrid: FC<TokenDataGridProps> = (props) => {
    const { tokensList, setNextPage, totalTokensDeployed, nextPage, walletBalance, walletConnected } = props;
    const [activeHeader, setActiveHeader] = useState<string>('');
    const navigate = useNavigate();

    const handleItemClick = (token) => {
        navigate(`/token/${token.tick}`);
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
            <table style={{ width: '90%' }}>
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

    const preMintedIcons = (preMinted: string, totalSupply: string) => {
        const preMintedNumber = parseFloat(preMinted);
        const totalSupplyNumber = parseFloat(totalSupply);
        const preMintPercentage = ((preMintedNumber / totalSupplyNumber) * 100).toFixed(2);

        return (
            <ListItemText
                sx={{ marginLeft: '1vw' }}
                primary={
                    <Tooltip title={`${preMintPercentage}% Pre Minted`}>
                        {preMintedNumber === 0 ? (
                            <CheckCircleOutlineRoundedIcon style={{ color: 'green', opacity: 0.5 }} />
                        ) : (
                            <ErrorOutlineRoundedIcon style={{ color: 'red', opacity: 0.5 }} />
                        )}
                    </Tooltip>
                }
            />
        );
    };

    return (
        <StyledDataGridContainer>
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
                    next={() => setNextPage(nextPage + 1)}
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
                        const tokenKey = `${token.tick}-${uuidv4()}`;
                        return (
                            <TokenRow
                                walletConnected={walletConnected}
                                key={tokenKey}
                                walletBalance={walletBalance}
                                tokenKey={tokenKey}
                                handleItemClick={handleItemClick}
                                token={token}
                            />
                        );
                    })}
                </InfiniteScroll>
            </List>
        </StyledDataGridContainer>
    );
};

export default TokenDataGrid;
