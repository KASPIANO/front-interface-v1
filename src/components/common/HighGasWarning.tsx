import WarningIcon from '@mui/icons-material/Warning';
import React from 'react';
import { Box, Typography } from '@mui/material';

export const HighGasWarning: React.FC = () => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fff4e5', // Light yellow background
            padding: '10px',
            borderRadius: '8px',
        }}
    >
        <WarningIcon sx={{ color: 'orange', marginRight: '10px' }} />
        <Typography variant="body1" sx={{ color: 'orange' }}>
            Gas fees are currently high. We recommend waiting for the fees to decrease. However, you may still
            continue with the process if you wish to proceed at the current fee rates.
        </Typography>
    </Box>
);
