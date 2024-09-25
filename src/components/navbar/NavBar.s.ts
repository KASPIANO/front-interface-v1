import { Button, MenuItem, Select, styled } from '@mui/material';

// Navbar container styling with responsive adjustments
export const NavbarContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '0.5px solid #2b2b3b',
    width: '100%',
    padding: '8px 8px',
    [theme.breakpoints.down('sm')]: {
        padding: '8px 4px',
    },
}));

// Responsive NavButton with active state
export const NavButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ isActive }) => ({
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '0.8rem',
    position: 'relative',
    maxWidth: '7vw',
    '&:hover': {
        color: '#39ddbe',
    },
    ...(isActive && {
        '&:after': {
            content: '""',
            height: '0.3vh',
            width: '70%',
            background: '#2b2b3b',
            position: 'absolute',
            bottom: '1.2vh',
        },
    }),
}));

// Logo styling
export const Logo = styled(Button)({
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1.3rem',
    position: 'relative',
    '&:hover': {
        backgroundColor: 'transparent',
    },
});

// Center navigation container
export const NavCenter = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: 'auto',
});

// Wallet balance display
export const WalletBalance = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

// Connect button styling
export const ConnectButton = styled(Button)({
    backgroundColor: '#70C7BA',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.6rem',
    padding: '0.5vh 0.5vw',
    marginRight: '0.7vw',
    borderRadius: '14px',
    '&:hover': {
        backgroundColor: '#49EACB',
    },
});

// Network select styling
export const NetworkSelect = styled(Select)({
    backgroundColor: '#2b2b3b',
    fontSize: '0.6vw',
    marginRight: '3vw',
    '& .MuiSelect-icon': {
        display: 'none',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#888',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#70C7BA',
    },
});

// Network select item styling
export const NetworkSelectItem = styled(MenuItem)({
    backgroundColor: '#2b2b3b',
    fontSize: '0.6vw',
    padding: '0.5vh 0.5vw',
    '&:hover': {
        backgroundColor: '#70C7BA',
    },
});
