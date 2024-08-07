/* eslint-disable @typescript-eslint/no-empty-function */
import { Box, List, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { fetchTokenInfo } from '../../../DAL/Krc20DAL';
import { TokenResponse } from '../../../types/Types';
import { GridHeader } from '../grid-header/GridHeader';
import { TokenRow } from '../token-row/TokenRow';
import { NoDataContainer, StyledDataGridContainer } from './Krc20Grid.s';

const GlobalStyle = createGlobalStyle`
  #scrollableList {
    scrollbar-width: thin;
    scrollbar-color: #888 #111;

    &::-webkit-scrollbar {
      width: 12px;
    }

    &::-webkit-scrollbar-track {
      background: #111;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 10px;
      border: 2px solid #111;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
`;

interface TokenDataGridProps {
    tokensList: TokenResponse[];
    setNextPage: (value: number) => void;
    nextPageParams: string;
    totalTokensDeployed: number;
    nextPage: number;
    walletBalance: number;
    walletConnected: boolean;
}

enum GridHeaders {
    TICKER = 'TICKER',
    AGE = 'AGE',
    SUPPLY = 'SUPPLY',
    MINTED = 'MINTED',
    HOLDERS = 'HOLDERS',
    FAIR_MINT = 'FAIR_MINT',
}

const headersMapper: Record<GridHeaders, { name: string; headerFunction?: () => void }> = {
    [GridHeaders.TICKER]: { name: 'Ticker', headerFunction: () => {} },
    [GridHeaders.AGE]: { name: 'Age', headerFunction: () => {} },
    [GridHeaders.SUPPLY]: { name: 'Supply' },
    [GridHeaders.HOLDERS]: { name: 'Holders', headerFunction: () => {} },
    [GridHeaders.MINTED]: { name: 'Minted', headerFunction: () => {} },
    // [GridHeaders.TOTAL_TXNS]: { name: 'Market Cap', headerFunction: () => {} },
    [GridHeaders.FAIR_MINT]: { name: 'Fair Mint' },
};

const TokenDataGrid: FC<TokenDataGridProps> = (props) => {
    const { tokensList, setNextPage, totalTokensDeployed, nextPage, walletBalance, walletConnected } = props;
    const [tokensRows, setTokensRows] = useState([]);
    const [, setLoading] = useState(true);
    const [activeHeader, setActiveHeader] = useState<string>('');
    const navigate = useNavigate();

    const handleItemClick = (token) => {
        navigate(`/token/${token.tick}`);
    };

    useEffect(() => {
        const loadTokens = async () => {
            try {
                setLoading(true);
                const offset = nextPage * 50;
                const slicedTokensList = tokensList.slice(0, offset);
                const detailedTokens = await Promise.all(
                    slicedTokensList.map(async (token) => {
                        const tokenDetails = await fetchTokenInfo(token.tick);
                        return {
                            ...token,
                            ...tokenDetails[0],
                        };
                    }),
                );
                setTokensRows((prevTokenRows) => [...prevTokenRows, ...detailedTokens]);
            } catch (error) {
                console.error('Error loading tokens:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTokens();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokensList]);

    if (tokensRows.length === 0) {
        return (
            <NoDataContainer>
                <Typography variant="subtitle1">LOADING TOKENS KASPANIO</Typography>
            </NoDataContainer>
        );
    }

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
                                headerFunction={headersMapper[header].headerFunction}
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
                    dataLength={tokensRows.length}
                    next={() => setNextPage(nextPage + 1)}
                    hasMore={tokensRows.length < totalTokensDeployed}
                    loader={<Skeleton width={'100%'} height={'10vh'} />}
                    style={{ overflow: 'initial' }}
                    scrollableTarget="scrollableList"
                    endMessage={
                        <p style={{ textAlign: 'center', fontSize: '1vw' }}>
                            <b>End of list</b>
                        </p>
                    }
                >
                    {tokensRows.map((token) => {
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
