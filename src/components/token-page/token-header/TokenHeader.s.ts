import { styled, Typography, Box } from '@mui/material';

export const HeaderContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1vw 0',
    borderBottom: '1px solid rgba(111, 199, 186, 0.3)',
    height: '7vh',
});

export const Title = styled(Typography)({
    fontSize: '2vw',
    fontWeight: 600,
});

export const Subtitle = styled(Typography)({
    fontSize: '1vw',
    color: 'rgba(255, 255, 255, 0.7)',
});
