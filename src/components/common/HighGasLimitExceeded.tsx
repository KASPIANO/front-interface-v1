import React from 'react';
import { Box, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export const HighGasLimitExceeded: React.FC = () => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffe6e6', // Light red background
            padding: '10px',
            borderRadius: '8px',
        }}
    >
        <ErrorIcon sx={{ color: 'red', marginRight: '10px' }} />
        <Typography variant="body1" sx={{ color: 'red' }}>
            The gas fees are currently too high, and we do not support trade operations at this level of fees. The
            trade will restart once the gas fees decrease. Please check back later or monitor the fees for a better
            time to proceed.
        </Typography>
    </Box>
);
