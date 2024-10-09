import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Typography, Tooltip } from '@mui/material';

export const HighGasWarning: React.FC = () => (
    <Box
        sx={{
            padding: '4px 6px',
            borderRadius: '4px',
            border: '1px solid orange',
        }}
    >
        <Tooltip title="Gas fees are currently high. It's recommended to wait for them to decrease. However, you can proceed if you accept the current fees.">
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ color: 'orange', marginRight: '6px', fontSize: '0.8rem' }} />
                <Typography variant="body2" sx={{ color: 'orange', fontWeight: 'bold', fontSize: '0.6rem' }}>
                    High Gas Warning
                </Typography>
            </span>
        </Tooltip>
    </Box>
);
