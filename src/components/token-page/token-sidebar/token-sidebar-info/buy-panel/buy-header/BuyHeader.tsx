import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { StyledButton } from './BuyHeader.s';

interface BuyHeaderProps {
    sortBy: string;
    onSortChange: (sortBy: string) => void;
}

const BuyHeader: React.FC<BuyHeaderProps> = ({ sortBy, onSortChange }) => {
    const handleSortChange = (sortOption: string) => {
        onSortChange(sortOption);
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
                    Price
                </StyledButton>
                <StyledButton
                    size="small"
                    variant={sortBy === 'totalPrice' ? 'outlined' : 'contained'}
                    onClick={() => handleSortChange('totalPrice')}
                >
                    Total Price
                </StyledButton>
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
                <Typography variant="subtitle2" sx={{ width: '22%', fontWeight: 'bold' }}>
                    Amount
                </Typography>
                <Tooltip title="Price per token">
                    <Typography variant="subtitle2" sx={{ width: '22%', fontWeight: 'bold' }}>
                        Price
                    </Typography>
                </Tooltip>
                <Tooltip title="Total KAS requested for the tokens">
                    <Typography variant="subtitle2" sx={{ width: '20%', fontWeight: 'bold' }}>
                        Total
                    </Typography>
                </Tooltip>
                <Typography variant="subtitle2" sx={{ width: '10%' }} /> {/* Empty space for the button */}
            </Box>
        </Box>
    );
};

export default BuyHeader;
