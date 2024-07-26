import { Button, styled, TextField } from '@mui/material';
import { NavButtonProps } from '../../types/Types';

export const NavbarContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '0.5px solid #2b2b3b',
    width: '100%',
    height: '6.6vh',
});

export const NavButtons = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    columnGap: '2vh',
    justifyContent: 'center',
}));

export const NavButton = styled(Button)<NavButtonProps>(({ isActive }) => ({
    color: 'white',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '1.4vw',
    position: 'relative',

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

export const ConnectButton = styled(Button)({
    backgroundColor: '#2b2b3b',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '15px',
    fontSize: '1.1vw',
    height: '3.5vh',
    '&:hover': {
        color: 'black',
    },
});

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
});

export const SearchContainer = styled(TextField)({
    backgroundColor: '#2b2b3b',
    borderRadius: '15px',
    marginRight: '3vw',
    '& .MuiInputBase-root': {
        color: 'white',
    },
});
