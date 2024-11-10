import { styled, Card, Tab } from '@mui/material';
import { alpha } from '@mui/material/styles';

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

export const TabStyled = styled(Tab)(({ theme }) => ({
    paddingBottom: 0,
    paddingTop: 0,
    height: '2rem',
    minHeight: '5px',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: alpha(theme.palette.primary.main, 0.5),
}));
