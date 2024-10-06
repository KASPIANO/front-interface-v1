import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
    title?: string;
    size?: number; // Spinner size, optional with default value
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ title, size = 40 }) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '15vh', // Take the full height of the parent
            textAlign: 'center',
        }}
    >
        <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, fontSize: '1.3rem' }}>
            {title}
        </Typography>
        <CircularProgress size={size} />
    </Box>
);

export default LoadingSpinner;
