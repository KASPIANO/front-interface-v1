// import { GridPaginationModel } from '@mui/x-data-grid';
// import { columns } from './Krc20Grid.config';
// import { FC, useEffect, useState } from 'react';
// import { StyledDataGrid, StyledDataGridContainer } from './Krc20Grid.s';
// import { fetchTokenInfo, fetchTokens, fetchTotalTokensDeployed } from '../../../DAL/Krc20DAL';
// import { TokenResponse } from '../../../types/Types';

// interface TokenDataGridProps {
//     tokens: TokenResponse[];
//     setNextPage: (value: number) => void;
//     nextPageParams: string;
//     totalTokensDeployed: number;
// }

// const TokenDataGrid: FC<TokenDataGridProps> = (props) => {
//     const { tokens, setNextPage, totalTokensDeployed } = props;
//     const [tokensRows, setTokensRows] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [paginationModel, setPaginationModel] = useState({
//         pageSize: 50,
//         page: 0,
//     });

//     useEffect(() => {
//         const loadTokens = async () => {
//             try {
//                 setLoading(true);

//                 const detailedTokens = await Promise.all(
//                     tokens.map(async (token) => {
//                         const tokenDetails = await fetchTokenInfo(token.tick);
//                         return {
//                             ...token,
//                             ...tokenDetails[0],
//                         };
//                     }),
//                 );
//                 setTokensRows(detailedTokens);
//             } catch (error) {
//                 console.error('Error loading tokens:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadTokens();
//     }, [tokens]);

//     const handlePaginationChange = (newPaginationModel: GridPaginationModel) => {
//         setPaginationModel((prev) => ({
//             ...prev,
//             pageSize: 50,
//             page: newPaginationModel.page,
//         }));
//         setNextPage(newPaginationModel.page);
//     };

//     return (
//         <StyledDataGridContainer>
//             <StyledDataGrid
//                 getRowId={(row) => row.tick}
//                 rows={tokensRows}
//                 columns={columns}
//                 loading={loading}
//                 pagination
//                 pageSizeOptions={[50, 100, 200]}
//                 paginationModel={paginationModel}
//                 rowCount={totalTokensDeployed}
//                 onPaginationModelChange={handlePaginationChange}
//             />
//         </StyledDataGridContainer>
//     );
// };

// export default TokenDataGrid;

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
    Checkbox,
    Box,
    ListItemText,
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment';
import { fetchTokenInfo, fetchTokens } from '../../../DAL/Krc20DAL';
import { TokenResponse } from '../../../types/Types';
import { NoDataContainer, StyledDataGridContainer, TableHeader } from './Krc20Grid.s';
import GridTitle from '../grid-title-sort/GridTitle';

interface TokenDataGridProps {
    tokens: TokenResponse[];
    setNextPage: (value: number) => void;
    nextPageParams: string;
    totalTokensDeployed: number;
}

const formatDate = (timestamp: string): string => moment(Number(timestamp)).format('DD/MM/YYYY');
const capitalizeFirstLetter = (string: string): string => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const TokenDataGrid: FC<TokenDataGridProps> = (props) => {
    const { tokens, setNextPage, totalTokensDeployed } = props;
    const [tokensRows, setTokensRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTokens = async () => {
            try {
                setLoading(true);

                const detailedTokens = await Promise.all(
                    tokens.map(async (token) => {
                        const tokenDetails = await fetchTokenInfo(token.tick);
                        return {
                            ...token,
                            ...tokenDetails[0],
                        };
                    }),
                );
                setTokensRows(detailedTokens);
            } catch (error) {
                console.error('Error loading tokens:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTokens();
    }, [tokens]);

    if (tokensRows.length === 0) {
        return (
            <NoDataContainer>
                <Typography variant="subtitle1">No Tokens found</Typography>
            </NoDataContainer>
        );
    }

    const tableHeader = (
        <Box sx={{ padding: '5px 0' }}>
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <TableHeader sx={{ width: '20%' }}>Ticker</TableHeader>
                        <TableHeader sx={{ width: '10%' }}>Age</TableHeader>
                        <TableHeader sx={{ width: '10%' }}>% Minted</TableHeader>
                        <TableHeader sx={{ width: '10%' }}>Supply</TableHeader>
                        <TableHeader sx={{ width: '20%' }}>Trades</TableHeader>
                        <TableHeader sx={{ width: '20%' }}>Holders</TableHeader>
                        <TableHeader sx={{ width: '20%' }}>Fair Mint</TableHeader>
                    </tr>
                </thead>
            </table>
        </Box>
    );

    return (
        <StyledDataGridContainer>
            {tableHeader}
            <List
                id="scrollableList"
                dense
                sx={{
                    width: '100%',
                    overflow: 'scroll',
                    height: '70vh',
                }}
            >
                <InfiniteScroll
                    dataLength={tokensRows.length}
                    next={() => setNextPage((prev) => prev + 1)}
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
                    {tokensRows.map((token, index) => (
                        <div key={index + token.tick}>
                            <ListItem disablePadding sx={{ height: '9vh' }}>
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
                                            width: 0,
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
                                        primary={
                                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                                {`${moment().diff(Number(token.mtsAdd), 'days')} days`}
                                            </Typography>
                                        }
                                    />

                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body2"
                                                style={{ fontSize: '0.9vw', textAlign: 'left' }}
                                            >
                                                {((token.minted / token.max) * 100).toFixed(2)}%
                                            </Typography>
                                        }
                                    />

                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body2"
                                                style={{ fontSize: '0.9vw', textAlign: 'left' }}
                                            >
                                                {token.max}
                                            </Typography>
                                        }
                                    />

                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body2"
                                                style={{ fontSize: '0.9vw', textAlign: 'left' }}
                                            >
                                                66
                                            </Typography>
                                        }
                                    />

                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body2"
                                                style={{ fontSize: '0.9vw', textAlign: 'left' }}
                                            >
                                                {token.holders}
                                            </Typography>
                                        }
                                    />

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginRight: '1vw', minWidth: '2vw', width: '3vw' }}
                                        disabled={token.minted >= token.max}
                                    >
                                        Mint
                                    </Button>
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
