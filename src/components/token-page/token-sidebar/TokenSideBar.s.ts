import { styled, Card, Tab } from '@mui/material';

export const SideBarContainer = styled(Card)({
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    height: '88.5vh',
    position: 'sticky',
    display: 'flex',
    flexDirection: 'column',
    scroll: 'auto',
    overflow: 'hidden',
    top: '0',
});

export const TabStyled = styled(Tab)({
    paddingBottom: 0,
    paddingTop: 0,
    height: '2rem',
    minHeight: '5px',
});
