import { Box, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const DeployForm = styled(Box)({
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
});

export const Info = styled(Typography)({
    marginTop: '20px',
    fontSize: '14px',
    color: 'red',
    textAlign: 'center',
});

export const TextInfo = styled(TextField)({
    width: '100%',
    marginBottom: '2vh',
});

export const Status = styled('div')({
    fontSize: '0.9rem',
    '&.error': {
        color: 'red',
    },
    '&.success': {
        color: 'green',
    },
});
