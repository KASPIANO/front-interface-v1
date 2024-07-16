import { styled } from '@mui/material';

export const Heading = styled('h1')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '3vw',
    height: '3vh',
});

export const BlurOverlay = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(5px)',
    zIndex: 999,
});

export const CurrencyImage = styled('img')({
    width: '24px',
    height: '24px',
    marginRight: '8px',

    '@media (max-width: 550px)': {
        width: '20px',
        height: '20px',
    },
});

export const CurrencyText = styled('span')({
    color: '#fff',
    fontSize: '14px',

    '@media (max-width: 550px)': {
        fontSize: '12px',
    },
});

export const AmountInput = styled('input')({
    flexGrow: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '18px',
    padding: '8px',
    textAlign: 'right',

    '@media (max-width: 550px)': {
        fontSize: '14px',
        padding: '4px',
        width: '70px',
    },
});

export const SwapButton = styled('button')({
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#6ec7ba',
    fontWeight: 600,
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',

    '&:hover': {
        backgroundColor: '#39ddbe',
    },

    '@media (max-width: 550px)': {
        padding: '12px',
        fontSize: '14px',
    },
});

export const SwitchButton = styled('button')({
    backgroundColor: '#6ec7ba',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    margin: '0 auto 20px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',

    '&:hover': {
        backgroundColor: '#39ddbe',
    },

    '@media (max-width: 550px)': {
        width: '36px',
        height: '36px',
        margin: '10px auto',
    },
});

export const IconButton = styled('button')({
    backgroundColor: '#2b2b3b',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',

    '&:hover': {
        backgroundColor: '#353545',
    },

    '& > svg': {
        fontSize: '18px',

        '@media (max-width: 550px)': {
            fontSize: '16px',
        },
    },

    '@media (max-width: 550px)': {
        width: '36px',
        height: '36px',
    },
});

export const MainContent = styled('div')({
    transition: 'filter 0.3s ease',
});

export const BalanceInfo = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    color: '#fff',
    fontSize: '14px',
    paddingLeft: '5px',

    '@media (max-width: 550px)': {
        fontSize: '12px',
    },
});

export const BalanceText = styled('span')({
    display: 'flex',
    alignItems: 'center',
});

export const BalanceButtons = styled('div')({
    display: 'flex',
    alignItems: 'center',

    button: {
        backgroundColor: '#2b2b3b',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        padding: '5px 10px',
        marginLeft: '10px',
        cursor: 'pointer',

        '&:hover': {
            backgroundColor: '#353545',
        },

        '@media (max-width: 550px)': {
            padding: '4px 8px',
            fontSize: '12px',
        },
    },
});
