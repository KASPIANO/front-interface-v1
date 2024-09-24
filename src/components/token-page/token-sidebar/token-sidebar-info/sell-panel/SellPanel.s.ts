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

export const StyledTextField = styled(TextField)({
    marginBottom: '0.6rem',
});
