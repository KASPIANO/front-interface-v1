import { Box, styled } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';

export const FooterContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
});

export const FooterContent = styled(BottomNavigation)({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '4vh',
});

export const SocialMediaContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
        color: '#6ec7ba',
    },
});
