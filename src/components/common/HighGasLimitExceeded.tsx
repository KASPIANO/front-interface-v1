import React from 'react';
import ReportIcon from '@mui/icons-material/Report'; // or use another suitable icon
import { Box, Typography, Tooltip } from '@mui/material';

export const GasLimitExceeded: React.FC = () => (
    <Box
        sx={{
            padding: '4px 6px',
            borderRadius: '4px',
            border: '1px solid red',
        }}
    >
        <Tooltip title="The gas fees have exceeded the allowed limit. Proceeding with the trade may result in delays, and it could get stuck until gas fees decrease. However, your funds or tokens will remain safe throughout the process.">
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <ReportIcon color="error" sx={{ color: 'red', marginRight: '6px', fontSize: '0.8rem' }} />
                <Typography variant="body2" sx={{ color: '#FF0000', fontWeight: 'bold', fontSize: '0.6rem' }}>
                    Gas Limit Exceeded
                </Typography>
            </span>
        </Tooltip>
    </Box>
);
