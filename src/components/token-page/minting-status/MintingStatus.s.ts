import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material';

export const StyledMintButton = styled(Button)(({ theme }) => ({
    fontSize: '0.7rem',
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
    },
    '&:disabled': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
        color: alpha(theme.palette.primary.contrastText, 0.5),
    },
    marginTop: theme.spacing(0.5),
}));
