import { styled } from '@mui/material/styles';
import { InputContainerProps } from '../../../types/Types';

export const SwapContainer = styled('div')({
    backgroundColor: '#1e1e2f',
    padding: '20px',
    borderRadius: '12px',
    width: '48vw',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

export const InputContainer = styled('div')<InputContainerProps>(({ active }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2b2b3b',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '20px',
    border: active ? '2px solid #39ddbe' : 'none',
    boxShadow: active ? '0 0 10px #39ddbe' : 'none',
}));

export const CurrencySelector = styled('div')({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#353545',
    padding: '10px',
    borderRadius: '8px',
    marginRight: '12px',
    position: 'relative',
    cursor: 'pointer',

    '@media (max-width: 550px)': {
        padding: '6px',
        marginRight: '8px',
    },
});

export const Label = styled('label')({
    color: '#fff',
    fontSize: '1.2vw',
    marginBottom: '1.5vh',
    marginLeft: '0.7vw',
});

export const CurrencyImage = styled('img')({
    width: '24px',
    height: '24px',
    marginRight: '8px',
});

export const CurrencyText = styled('span')({
    color: '#fff',
    fontSize: '14px',
});

export const AmountInput = styled('input')({
    flexGrow: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '14px',
    textAlign: 'right',

    '@media (max-width: 550px)': {
        fontSize: '12px',
    },
});

export const SwitchButton = styled('button')({
    backgroundColor: '#6ec7ba',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
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

export const BalanceInfo = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    color: '#fff',
    fontSize: '14px',
});

export const ErrorMessage = styled('div')({
    color: '#ff4d4f',
    fontSize: '14px',
    marginTop: '10px',
});

export const ButtonGroup = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '500px',
    position: 'relative',
    marginBottom: '0.5rem',

    '@media (max-width: 550px)': {
        width: '100%',
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
});
