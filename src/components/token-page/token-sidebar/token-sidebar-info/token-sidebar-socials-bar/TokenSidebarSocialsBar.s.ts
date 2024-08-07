import { Button, ButtonGroup, styled } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const TokenSidebarSocialsBarGroup = styled(ButtonGroup)(({ theme }) => ({
    height: '3.5vh',
    borderRadius: '2px',
    marginRight: '1vw',
    '& .MuiButton-root': {
        border: 'none',
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },
}));

export const TokenSidebarSocialsBarButton = styled(Button)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '0.8vw',

    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
        border: `none`,
    },
}));
