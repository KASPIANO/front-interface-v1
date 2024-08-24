import { Button, ButtonGroup, styled, Typography } from '@mui/material';
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

export const AddText = styled(Typography)(({ theme }) => ({
    backgroundColor: 'transparent',
    color: theme.palette.primary.contrastText,
    fontSize: '1vw',
    fontWeight: 'bold',
}));

export const AddBox = styled(Button)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '5px',
    height: '19vh',
    width: '100%',
    padding: '1vh',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
        border: `none`,
    },
}));

export const AddBanner = styled(Button)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '0',
    height: '12vh',
    width: '100%',
    padding: '1vh',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
        border: `none`,
    },
}));
