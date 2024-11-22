import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Typography, Tooltip } from '@mui/material';

interface HighPriceWarningProps {
    floorPrice: number;
    currentPrice: number;
}

export const HighPriceWarning: React.FC<HighPriceWarningProps> = (props) => {
    const { floorPrice, currentPrice } = props;

    const priceDifference = currentPrice - floorPrice;
    const percentageDifference = ((priceDifference / floorPrice) * 100).toFixed(2);

    return (
        <Box
            sx={{
                padding: '4px 6px',
                borderRadius: '4px',
                border: '1px solid orange',
                backgroundColor: 'rgba(255, 165, 0, 0.1)', // Subtle warning background
            }}
        >
            <Tooltip
                title={`The current price (${currentPrice.toFixed(2)}) is ${percentageDifference}% higher than the floor price (${floorPrice.toFixed(2)}). Consider if this aligns with your budget before proceeding.`}
            >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <WarningIcon sx={{ color: 'orange', marginRight: '6px', fontSize: '0.5rem' }} />
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'orange',
                            fontWeight: 'bold',
                            fontSize: '0.5rem',
                        }}
                    >
                        Price Above Floor
                    </Typography>
                </span>
            </Tooltip>
        </Box>
    );
};
