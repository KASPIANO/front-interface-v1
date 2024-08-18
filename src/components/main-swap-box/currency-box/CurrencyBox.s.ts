import { Autocomplete, Box, InputBase, Select, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { InputContainerProps } from '../../../types/Types';

export const StyledInputContainer = styled(Box)<InputContainerProps>(({ active }) => ({
    display: 'flex',
    alignItems: 'center',
    borderColor: active ? 'white' : '#39ddbe',
    borderStyle: 'solid',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '20px',
    height: '12vh',
}));

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
    fontSize: '14px',
});

export const StyledAmountInput = styled(InputBase)({
    flexGrow: 1,
    background: 'none',
    border: 'none',
    outline: 'none',

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
