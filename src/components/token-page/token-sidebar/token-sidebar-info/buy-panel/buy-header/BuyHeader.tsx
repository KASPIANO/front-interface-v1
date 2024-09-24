// BuyHeader.tsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { StyledButton } from '../../sell-panel/SellPanel.s';

interface BuyHeaderProps {
    sortBy: string;
    onSortChange: (sortBy: string) => void;
}

const BuyHeader: React.FC<BuyHeaderProps> = ({ sortBy, onSortChange }) => {
    const handleSortChange = (sortOption: string) => {
        onSortChange(sortOption);
    };

    return (
        <Box sx={{ display: 'flex', marginBottom: '1rem', gap: 1, padding: '1rem' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                Sort By:
            </Typography>
            <StyledButton
                size="small"
                variant={sortBy === 'totalPrice' ? 'contained' : 'outlined'}
                onClick={() => handleSortChange('totalPrice')}
            >
                Total Price
            </StyledButton>
            <StyledButton
                variant={sortBy === 'pricePerToken' ? 'contained' : 'outlined'}
                onClick={() => handleSortChange('pricePerToken')}
            >
                Price
            </StyledButton>
        </Box>
    );
};

export default BuyHeader;
