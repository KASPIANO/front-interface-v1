import { alpha, styled } from '@mui/material/styles';
import { Button } from '@mui/material';

export const StyledButton = styled(Button)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '0.7rem',
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
    },
    '&.MuiButton-outlined': {
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
    },
}));
