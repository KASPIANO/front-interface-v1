import { Box, styled, Typography } from '@mui/material';

export const NavbarContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    width: '20vw',
    height: '4vh',
    columnGap: '4vh',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '40vw',
});

export const NavItem = styled(Typography)(() => ({
    fontSize: '1.2vw',

    cursor: 'pointer',
    fontWeight: 700,
    '&:hover': {
        color: 'black',
    },
}));
