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

export const TextInfo = styled(TextField)(({ theme }) => ({
    width: '100%',
    marginBottom: '2vh',

    '& .MuiFormHelperText-root': {
        color: theme.palette.success.main,
    },
}));

export const Status = styled('div')({
    fontSize: '0.9rem',
    '&.error': {
        color: 'red',
    },
    '&.success': {
        color: 'green',
    },
});

export const UploadContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
});

export const Input = styled('input')({
    display: 'none',
});

export const ImagePreview = styled('img')({
    width: '100px',
    height: '100px',
    objectFit: 'cover',
});

export const UploadButton = styled('label')({
    cursor: 'pointer',
});
