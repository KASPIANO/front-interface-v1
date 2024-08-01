import { styled } from '@mui/material';

export const SwapBoxContainer = styled('div')({
    backgroundColor: '#1e1e2f',
    padding: '20px',
    borderRadius: '12px',
    width: '350px',
    marginLeft: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

export const Heading = styled('h2')({
    fontSize: '20px',
    marginBottom: '20px',
});

export const Section = styled('div')({
    marginBottom: '20px',
});

export const Label = styled('label')({
    display: 'block',

    fontSize: '14px',
    marginBottom: '8px',
});

export const InputContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2b2b3b',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '10px',
});

export const CurrencySelector = styled('div')({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#353545',
    padding: '10px',
    borderRadius: '8px',
    marginRight: '12px',
    cursor: 'pointer',
});

export const CurrencyImage = styled('img')({
    width: '24px',
    height: '24px',
    marginRight: '8px',
});

export const CurrencyText = styled('span')({
    fontSize: '14px',
});

export const AmountInput = styled('input')({
    flexGrow: 1,
    background: 'none',
    border: 'none',
    outline: 'none',

    fontSize: '18px',
    textAlign: 'right',
});

export const SwitchButton = styled('button')({
    backgroundColor: '#6ec7ba',

    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    margin: '20px auto',
    '&:hover': {
        backgroundColor: '#39ddbe',
    },
});

export const BalanceInfo = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',

    fontSize: '14px',
});

export const SwapButton = styled('button')({
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#6ec7ba',
    fontWeight: 600,

    fontSize: '16px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#39ddbe',
    },
});
