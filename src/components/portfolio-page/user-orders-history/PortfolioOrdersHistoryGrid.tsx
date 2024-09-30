import {
    Box,
    List,
    Table,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Checkbox,
    ListItemText,
    SelectChangeEvent,
    useTheme,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useState } from 'react';
import { Order } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { PrevPageButton, NextPageButton } from '../../krc-20-page/grid-title-sort/GridTitle.s';
import { StyledPortfolioGridContainer } from './PortfolioOrdersHistoryGrid.s';
import UserOrdersRow from './user-orders-history-row/UserOrdersHistoryRow';
import { useOrdersHistory } from '../../../DAL/UseQueriesBackend';

interface PortfolioOrdersHistoryGridProps {
    kasPrice: number;
    walletConnected: boolean;
    walletAddress: string | null;
}

enum GridHeaders {
    TICKER = 'TICKER',
    QUANTITY = 'QUANTITY',
    DATE = 'CREATED DATE',
    PRICE_PER_TOKEN = 'PRICE PER TOKEN',
    TOTAL_PRICE = 'TOTAL PRICE',
    STATUS = 'STATUS',
}

enum SortFields {
    DATE = 'createdAt',
    PRICE_PER_TOKEN = 'pricePerToken',
    QUANTITY = 'quantity',
    TOTAL_PRICE = 'totalPrice',
}
const PortfolioOrdersHistoryGrid: FC<PortfolioOrdersHistoryGridProps> = ({
    kasPrice,
    walletConnected,
    walletAddress,
}) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedTickers, setSelectedTickers] = useState<string[]>([]); // Multi-select tickers filter
    const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
        field: SortFields.DATE,
        direction: 'desc',
    });
    const [filters] = useState<{ minPrice?: number; maxPrice?: number; statuses?: string[] }>({});
    const [minPrice, setMinPrice] = useState<number | string>('');
    const [maxPrice, setMaxPrice] = useState<number | string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const theme = useTheme();

    const commonTextFieldProps = {
        InputProps: {
            style: { fontSize: '0.75rem' },
        },
        InputLabelProps: {
            style: { fontSize: '0.75rem' },
            shrink: true,
        },
        sx: { flex: 1 },
    };

    // Fetch data using the custom hook
    const { data, isLoading } = useOrdersHistory({
        walletAddress: walletAddress || '',
        currentPage,
        selectedTickers,
        sort,
        filters: {
            ...filters,
            minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
            startDateTimestamp: startDate ? new Date(startDate).getTime() : undefined,
            endDateTimestamp: endDate ? new Date(endDate).getTime() : undefined,
        },
    });
    const orders = data?.orders || [];
    const totalCount = data?.totalCount || 0;
    const allTickers = data?.allTickers || []; // The list of all tickers

    // Handle multi-select change
    const handleTickerChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[];
        setSelectedTickers(value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [field, direction] = e.target.value.split('-');
        setSort({ field: field as SortFields, direction: direction as 'asc' | 'desc' });
    };

    const handlePrevPage = () => setCurrentPage(currentPage - 1);
    const handleNextPage = () => setCurrentPage(currentPage + 1);

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCount / 50); // 20 items per page

    const disableNext = () => currentPage >= totalPages;
    const filtersAndSort = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                padding: '8px',
                paddingTop: '10px',
            }}
        >
            {/* Ticker Multi-Select Dropdown */}
            <FormControl fullWidth sx={{ flex: 1, height: '2.2rem' }}>
                <InputLabel
                    id="tickers-multi-select-label"
                    sx={{
                        fontSize: '0.8rem',
                        top: '-0.5rem',
                        '&.Mui-focused': {
                            top: '0.1rem',
                        },
                    }}
                >
                    Filter by Ticker
                </InputLabel>
                <Select
                    labelId="tickers-multi-select-label"
                    multiple
                    label="Filter by Ticker"
                    value={selectedTickers}
                    onChange={handleTickerChange}
                    renderValue={(selected) => (selected as string[]).join(', ')}
                    sx={{
                        fontSize: '0.75rem',
                        height: '2.2rem',
                    }}
                    MenuProps={{
                        PaperProps: {
                            style: { fontSize: '0.75rem' },
                        },
                    }}
                >
                    {allTickers.map((ticker) => (
                        <MenuItem
                            key={ticker}
                            value={ticker}
                            sx={{ fontSize: '0.75rem', padding: 0, paddingLeft: '7px' }}
                        >
                            <Checkbox
                                sx={{
                                    '& .MuiSvgIcon-root': {
                                        fontSize: '0.9rem',
                                        color: theme.palette.primary.main,
                                    },
                                }}
                                checked={selectedTickers.indexOf(ticker) > -1}
                            />
                            <ListItemText primary={ticker} primaryTypographyProps={{ fontSize: '0.75rem' }} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Date Range Pickers */}
            <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true, style: { fontSize: '0.8rem', top: '0.1rem' } }}
                InputProps={{
                    ...commonTextFieldProps.InputProps,
                }}
                sx={{
                    flex: 1,
                    height: '2.2rem',
                }}
            />
            <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true, style: { fontSize: '0.8rem', top: '0.1rem' } }}
                InputProps={{
                    ...commonTextFieldProps.InputProps,
                }}
                sx={{
                    flex: 1,
                }}
            />

            {/* Price Range Inputs */}
            <TextField
                label="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                InputProps={{ inputProps: { min: 0 }, sx: { fontSize: '0.75rem' } }}
                InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                sx={{ flex: 1 }}
            />
            <TextField
                label="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                InputProps={{ inputProps: { min: 0 }, sx: { fontSize: '0.75rem' } }}
                InputLabelProps={{ style: { fontSize: '0.8rem' } }}
                sx={{ flex: 1 }}
            />

            {/* Sort Dropdown */}
            <TextField
                select
                label="Sort by"
                variant="outlined"
                onChange={handleSortChange}
                value={`${sort.field}-${sort.direction}`}
                sx={{ flex: 1 }}
                InputLabelProps={{ shrink: true, style: { fontSize: '0.8rem', top: '0.1rem' } }}
                InputProps={{
                    style: { fontSize: '0.75rem' }, // Set font size for TextField
                }}
                SelectProps={{
                    MenuProps: {
                        PaperProps: {
                            style: { fontSize: '0.75rem' }, // Set font size for MenuItems
                        },
                    },
                }}
            >
                <MenuItem
                    value={`${SortFields.DATE}-desc`}
                    sx={{ fontSize: '0.75rem', padding: 0, paddingLeft: '10px', paddingTop: '5px' }}
                >
                    Date (Newest)
                </MenuItem>
                <MenuItem
                    value={`${SortFields.DATE}-asc`}
                    sx={{ fontSize: '0.75rem', padding: 0, paddingLeft: '10px', paddingTop: '5px' }}
                >
                    Date (Oldest)
                </MenuItem>
                <MenuItem
                    value={`${SortFields.PRICE_PER_TOKEN}-desc`}
                    sx={{ fontSize: '0.75rem', padding: 0, paddingLeft: '10px', paddingTop: '5px' }}
                >
                    Price per Token (Highest)
                </MenuItem>
                <MenuItem
                    value={`${SortFields.PRICE_PER_TOKEN}-asc`}
                    sx={{ fontSize: '0.75rem', padding: 0, paddingLeft: '10px', paddingTop: '5px' }}
                >
                    Price per Token (Lowest)
                </MenuItem>
                <MenuItem
                    value={`${SortFields.QUANTITY}-desc`}
                    sx={{ fontSize: '0.75rem', padding: 0, paddingLeft: '10px', paddingTop: '5px' }}
                >
                    Quantity (Highest)
                </MenuItem>
                <MenuItem
                    value={`${SortFields.QUANTITY}-asc`}
                    sx={{ fontSize: '0.75rem', padding: 0, paddingLeft: '10px', paddingTop: '5px' }}
                >
                    Quantity (Lowest)
                </MenuItem>
                <MenuItem
                    value={`${SortFields.TOTAL_PRICE}-desc`}
                    sx={{ fontSize: '0.75rem', padding: 0, paddingLeft: '10px', paddingTop: '5px' }}
                >
                    Total Price (Highest)
                </MenuItem>
                <MenuItem
                    value={`${SortFields.TOTAL_PRICE}-asc`}
                    sx={{ fontSize: '0.75rem', padding: 0, paddingLeft: '10px', paddingTop: '5px' }}
                >
                    Total Price (Lowest)
                </MenuItem>
            </TextField>
        </Box>
    );
    return (
        <StyledPortfolioGridContainer>
            <GlobalStyle />

            {/* Filter and Sorting Inputs */}

            {/* Table Header */}
            {filtersAndSort}
            <Box
                sx={{
                    height: '6vh',
                    alignContent: 'center',
                    display: 'flex',
                    borderBottom: '0.1px solid rgba(111, 199, 186, 0.3)',
                }}
            >
                <Table style={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    paddingTop: '2px',
                                    width: '12%',
                                    borderBottom: 0,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                }}
                            >
                                {GridHeaders.TICKER}
                            </TableCell>
                            <TableCell
                                sx={{
                                    paddingTop: '2px',
                                    width: '17%',
                                    borderBottom: 0,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                }}
                            >
                                {GridHeaders.DATE}
                            </TableCell>
                            <TableCell
                                sx={{
                                    paddingTop: '2px',
                                    width: '13%',
                                    borderBottom: 0,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                }}
                            >
                                {GridHeaders.STATUS}
                            </TableCell>
                            <TableCell
                                sx={{
                                    paddingTop: '2px',
                                    width: '12%',
                                    borderBottom: 0,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                }}
                            >
                                <Tooltip title="Quantity of tokens">
                                    <span>{GridHeaders.QUANTITY}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell
                                sx={{
                                    paddingTop: '2px',
                                    width: '15%',
                                    borderBottom: 0,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                }}
                            >
                                {GridHeaders.PRICE_PER_TOKEN}
                            </TableCell>
                            <TableCell
                                sx={{
                                    paddingTop: '2px',
                                    width: '14%',
                                    borderBottom: 0,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                }}
                            >
                                {GridHeaders.TOTAL_PRICE}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: '2vw', paddingBottom: '7px' }}>
                    <PrevPageButton onClick={handlePrevPage} disabled={currentPage === 1}>
                        Prev
                    </PrevPageButton>
                    <NextPageButton onClick={handleNextPage} disabled={disableNext()}>
                        Next
                    </NextPageButton>
                </Box>
            </Box>

            {/* Orders List */}
            {!walletConnected ? (
                <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '10vh' }}>
                    <b>Please connect your wallet to view your orders.</b>
                </p>
            ) : (
                <List
                    dense
                    sx={{
                        width: '100%',
                        overflowX: 'hidden',
                    }}
                >
                    {!isLoading
                        ? orders.map((order: Order) => (
                              <UserOrdersRow
                                  key={order.orderId}
                                  order={order}
                                  walletConnected={walletConnected}
                                  kasPrice={kasPrice}
                              />
                          ))
                        : [...Array(5)].map((_, index) => <Skeleton key={index} width={'100%'} height={'12vh'} />)}
                </List>
            )}

            {/* End of List */}
            {orders.length === 0 && walletConnected && !isLoading && (
                <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                    <b>No orders found.</b>
                </p>
            )}
        </StyledPortfolioGridContainer>
    );
};

export default PortfolioOrdersHistoryGrid;
