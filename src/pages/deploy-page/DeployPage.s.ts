import { Box, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { keyframes } from '@mui/material/styles';

export const DeployForm = styled(Box)({
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
});

export const Info = styled(Typography)({
    marginTop: '20px',
    fontSize: '0.8rem',
    color: 'red',
    textAlign: 'center',
});

export const TextInfo = styled(TextField)(({ theme }) => ({
    width: '100%',
    marginBottom: '2vh',

    '& .MuiFormHelperText-root': {
        color: theme.palette.success.secondary,
    },
    '& .MuiOutlinedInput-root': {
        '& input::placeholder': {
            color: theme.palette.text.secondary, // Default placeholder color
        },
        '&:hover input::placeholder': {
            color: theme.palette.text.secondary, // Placeholder color on hover
        },
        '&.Mui-focused input::placeholder': {
            color: theme.palette.primary.secondary, // Placeholder color when focused
        },
    },
}));

export const TextInfoTicker = styled(TextField)(({ theme }) => ({
    width: '100%',
    marginBottom: '2vh',

    '& .MuiFormHelperText-root': {
        color: theme.palette.success.main,
    },
    '& .MuiOutlinedInput-root': {
        '& input::placeholder': {
            color: theme.palette.text.secondary, // Default placeholder color
        },
        '&:hover input::placeholder': {
            color: theme.palette.text.secondary, // Placeholder color on hover
        },
        '&.Mui-focused input::placeholder': {
            color: theme.palette.primary.secondary, // Placeholder color when focused
        },
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
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const DeployPageSpinner = styled('div')(({ theme }) => ({
    margin: '20px auto',
    width: '40px',
    height: '40px',
    border: `4px solid ${theme.palette.grey[500]}`, // Info color
    borderTop: `4px solid ${theme.palette.primary.main}`, // Primary color
    borderRadius: '50%',
    animation: `${spin} 1s linear infinite`,
}));
