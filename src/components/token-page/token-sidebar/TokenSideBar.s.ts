import { styled, Box, Card } from '@mui/material';

const SIDE_BAR_HEIGHT = '91vh';

export const SideBarContainer = styled(Box)({
    width: '100%',
    margin: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    height: SIDE_BAR_HEIGHT,
    position: 'sticky',
    top: '1vh',
});

export const SideBarCard = styled(Card)({
    height: SIDE_BAR_HEIGHT,
});
