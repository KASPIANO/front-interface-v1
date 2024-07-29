import { Button, MenuItem, Select, styled, TextField } from '@mui/material';
import { NavButtonProps } from '../../types/Types';

export const NavbarContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '0.5px solid #2b2b3b',
    width: '100%',
    height: '8.5vh',
    padding: '8px 8px',
});

export const NavButton = styled(Button)<NavButtonProps>(({ isActive }) => ({
    color: 'white',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '1vw',
    position: 'relative',
    maxWidth: '7vw',

    '&:hover': {
        color: '#39ddbe',
    },
    ...(isActive && {
        '&:after': {
            height: '0.3vh',
            content: '""',
            width: '70%',
            background: '#2b2b3b',
            position: 'absolute',
            bottom: '1.2vh',
        },
    }),
}));

export const Logo = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

export const NavCenter = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    width: 'auto',
});

export const SearchContainer = styled(TextField)({
    backgroundColor: '#2b2b3b',
    marginRight: '2vw',
    borderRadius: '6px',
    '& .MuiInputBase-root': {
        color: 'white',
    },
});

export const WalletBalance = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

export const ConnectButton = styled(Button)({
    backgroundColor: '#70C7BA',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.7vw',
    padding: '0.5vh 0.5vw',
    marginRight: '0.7vw',
    borderRadius: '14px',
    '&:hover': {
        backgroundColor: '#49EACB',
    },
});

export const NetworkSelect = styled(Select)({
    backgroundColor: '#2b2b3b',
    fontSize: '0.6vw',
    color: '#fff',
    marginRight: '3vw',
    alignItems: 'center',

    '& .MuiSelect-icon': {
        color: '#fff',
        display: 'none',
    },

    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#888',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#70C7BA',
    },
});

export const NetworkSelectItem = styled(MenuItem)({
    backgroundColor: '#2b2b3b',
    fontSize: '0.6vw',
    padding: '0.5vh 0.5vw',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#70C7BA',
    },
});
