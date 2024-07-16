import { styled } from '@mui/material/styles';
import { InputContainerProps } from '../../../types/Types';
import { Box, InputBase, Typography, Select, Autocomplete } from '@mui/material';

export const StyledInputContainer = styled(Box)<InputContainerProps>({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2b2b3b',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '20px',
    height: '12vh',
});

export const StyledCurrencySelector = styled(Select)({
    backgroundColor: '#353545',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    height: '8vh',
});

export const StyledCurrencyImage = styled('img')({
    width: '24px',
    height: '24px',
    marginRight: '8px',
});

export const StyledCurrencyText = styled(Typography)({
    color: '#fff',
    fontSize: '14px',
});

export const StyledAmountInput = styled(InputBase)({
    flexGrow: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '14px',
    textAlign: 'right',
});

export const TokensAutocomplete = styled(Autocomplete)({
    border: 8,
    borderRadius: 8,
    width: '9vw',
    '& input': {
        fontSize: '0.8vw',
    },
});
