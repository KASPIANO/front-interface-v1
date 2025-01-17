import React from 'react';
import { Box, Tooltip, Typography, CircularProgress, IconButton } from '@mui/material';
import { StyledButton } from './BuyHeader.s';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQueryClient } from '@tanstack/react-query';

interface BuyHeaderProps {
    sortBy: string;
    onSortChange: (sortBy: string) => void;
    ticker: string;
    isLoading: boolean;
}

const BuyHeader: React.FC<BuyHeaderProps> = ({ sortBy, onSortChange, ticker, isLoading }) => {
    const queryClient = useQueryClient();
    const handleSortChange = (sortOption: string) => {
        onSortChange(sortOption);
    };
    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['orders', ticker] });
    };

    return (
        <Box
            sx={{
                paddingBottom: 0,
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor: 'background.paper',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    padding: '0.5rem',
                    alignItems: 'center',
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                    Sort By:
                </Typography>
                <StyledButton
                    size="small"
                    variant={sortBy === 'pricePerToken' ? 'outlined' : 'contained'}
                    onClick={() => handleSortChange('pricePerToken')}
                >
                    Unit Price
                </StyledButton>
                <StyledButton
                    size="small"
                    variant={sortBy === 'totalPrice' ? 'outlined' : 'contained'}
                    onClick={() => handleSortChange('totalPrice')}
                >
                    Total
                </StyledButton>
                <Box sx={{ marginLeft: 'auto' }}>
                    {isLoading ? (
                        <CircularProgress size={20} />
                    ) : (
                        <Tooltip title="Refresh the list of tokens">
                            <IconButton onClick={handleRefresh}>
                                <RefreshIcon sx={{ cursor: 'pointer', fontSize: '1.2rem' }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    paddingTop: '0',
                    paddingBottom: '0.1rem',
                    borderBottom: '0.5px solid  rgba(111, 199, 186, 0.5)',
                }}
            >
                <Tooltip title={`Total Amount of ${ticker} Tokens for Sale`}>
                    <Typography variant="subtitle2" sx={{ width: '20%', fontWeight: 'bold' }}>
                        Amount
                    </Typography>
                </Tooltip>
                <Tooltip title="Price per token">
                    <Typography variant="subtitle2" sx={{ width: '23%', fontWeight: 'bold' }}>
                        Unit Price
                    </Typography>
                </Tooltip>
                <Tooltip title="Total KAS requested for the tokens">
                    <Typography variant="subtitle2" sx={{ width: '22%', fontWeight: 'bold' }}>
                        Total
                    </Typography>
                </Tooltip>
                <Typography variant="subtitle2" sx={{ width: '5%' }} /> {/* Empty space for the button */}
            </Box>
        </Box>
    );
};

export default BuyHeader;
