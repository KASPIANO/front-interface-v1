import { FC, useEffect, useState } from 'react';
import {
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    Avatar,
    Typography,
    Divider,
    Box,
    ListItemText,
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment';
import { fetchTokenInfo } from '../../../DAL/Krc20DAL';
import { TokenResponse } from '../../../types/Types';
import { NoDataContainer, StyledDataGridContainer, TableHeader } from './Krc20Grid.s';
import { createGlobalStyle } from 'styled-components';
import { formatNumberWithCommas, simplifyNumber } from '../../../utils/Utils';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import { useNavigate } from 'react-router-dom';

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
}

const formatDate = (timestamp: string): string => moment(Number(timestamp)).format('DD/MM/YYYY');
const capitalizeFirstLetter = (string: string): string => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const TokenDataGrid: FC<TokenDataGridProps> = (props) => {
    const { tokensList, setNextPage, totalTokensDeployed, nextPage } = props;
    const [tokensRows, setTokensRows] = useState([]);
    const [loading, setLoading] = useState(true);
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
                <Typography variant="subtitle1">No Tokens found</Typography>
            </NoDataContainer>
        );
    }

    const tableHeader = (
        <Box
            sx={{
                padding: '5px 0',
                height: '8vh',
                alignContent: 'center',
                borderBottom: '0.1px solid  rgba(111, 199, 186, 0.3)',
            }}
        >
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <TableHeader sx={{ minWidth: '12vw', textAlign: 'left', paddingLeft: '1.4vw' }}>
                            Ticker
                        </TableHeader>
                        <TableHeader sx={{ minWidth: '9vw', display: 'inline-flex' }}>
                            Age {<UnfoldMoreRoundedIcon fontSize="small" />}
                        </TableHeader>
                        <TableHeader sx={{ minWidth: '11vw', display: 'inline-flex' }}>
                            Minted {<UnfoldMoreRoundedIcon fontSize="small" />}
                        </TableHeader>
                        <TableHeader sx={{ minWidth: '10.5vw', display: 'inline-flex' }}>
                            Supply {<UnfoldMoreRoundedIcon fontSize="small" />}
                        </TableHeader>
                        <TableHeader sx={{ display: 'inline-flex', minWidth: '9.5vw' }}>
                            Holders {<UnfoldMoreRoundedIcon fontSize="small" />}
                        </TableHeader>
                        <TableHeader sx={{ display: 'inline-flex', minWidth: '11vw' }}>
                            Total Txns {<UnfoldMoreRoundedIcon fontSize="small" />}
                        </TableHeader>
                        <TableHeader sx={{ textAlign: 'left', display: 'inline-flex' }}>Fair Mint</TableHeader>
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
                    {tokensRows.map((token) => (
                        <div key={token.tick}>
                            <ListItem
                                onClick={() => handleItemClick(token)}
                                disablePadding
                                sx={{ height: '12vh' }}
                            >
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar
                                            style={{
                                                marginLeft: '0.1vw',
                                                borderRadius: 5,
                                            }}
                                            imgProps={{
                                                sx: {
                                                    width: 'auto',
                                                    height: 'auto',
                                                    maxWidth: '2vw',
                                                    maxHeight: '2vw',
                                                },
                                            }}
                                            variant="square"
                                            alt={token.tick}
                                            src="/path/to/logo" // Update with actual logo source
                                        />
                                    </ListItemAvatar>

                                    <ListItemText
                                        sx={{
                                            maxWidth: '10vw',
                                        }}
                                        primary={
                                            <Tooltip title={token.tick}>
                                                <Typography variant="body1" style={{ fontSize: '1.2vw' }}>
                                                    {capitalizeFirstLetter(token.tick)}
                                                </Typography>
                                            </Tooltip>
                                        }
                                        secondary={
                                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                                {formatDate(token.mtsAdd)}
                                            </Typography>
                                        }
                                    />

                                    <ListItemText
                                        sx={{ maxWidth: '10vw' }}
                                        primary={
                                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                                {`${moment().diff(Number(token.mtsAdd), 'days')} days`}
                                            </Typography>
                                        }
                                    />

                                    <ListItemText
                                        sx={{ maxWidth: '11vw' }}
                                        primary={
                                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                                {((token.minted / token.max) * 100).toFixed(2)}%
                                            </Typography>
                                        }
                                    />

                                    <ListItemText
                                        sx={{ maxWidth: '11.5vw' }}
                                        primary={
                                            <Tooltip title={formatNumberWithCommas(token.max)}>
                                                <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                                    {simplifyNumber(token.max)}
                                                </Typography>
                                            </Tooltip>
                                        }
                                    />

                                    <ListItemText
                                        sx={{ maxWidth: '9.5vw' }}
                                        primary={
                                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                                {token.holder ? token.holder.length : 0}
                                            </Typography>
                                        }
                                    />

                                    <ListItemText
                                        sx={{ maxWidth: '9.5vw' }}
                                        primary={
                                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                                {token.transferTotal ? token.transferTotal : 0}
                                            </Typography>
                                        }
                                    />

                                    <ListItemText
                                        sx={{ maxWidth: '12vw' }}
                                        primary={
                                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                                {preMintedIcons(token.pre, token.max)}
                                            </Typography>
                                        }
                                    />
                                    {token.minted < token.max && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{
                                                marginRight: '1vw',
                                                minWidth: '2vw',
                                                width: '3vw',
                                                fontSize: '0.8vw',
                                            }}
                                            disabled={token.minted >= token.max}
                                        >
                                            Mint
                                        </Button>
                                    )}
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </InfiniteScroll>
            </List>
        </StyledDataGridContainer>
    );
};

export default TokenDataGrid;
