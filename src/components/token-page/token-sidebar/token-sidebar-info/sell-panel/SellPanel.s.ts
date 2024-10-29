import { alpha, styled } from '@mui/material/styles';
import { Box, Button, TextField } from '@mui/material';

export const StyledSellPanel = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '1vh',
    width: '100%',
    height: '100%',
    padding: '1rem',
});

export const StyledButton = styled(Button)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '0.7rem',
    backgroundColor: alpha(theme.palette.primary.main, 0.4),
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
    },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: '0.6rem',
    '& .MuiInputBase-root': {
        color: theme.palette.text.primary, // text color
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: alpha(theme.palette.primary.main, 0.2), // border color
        },
        '&:hover fieldset': {
            borderColor: alpha(theme.palette.primary.main, 0.2), // border color on hover
        },
        '&.Mui-disabled fieldset': {
            borderColor: alpha(theme.palette.primary.main, 0.1), // border color when disabled
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main, // focused border color
        },
    },
}));
