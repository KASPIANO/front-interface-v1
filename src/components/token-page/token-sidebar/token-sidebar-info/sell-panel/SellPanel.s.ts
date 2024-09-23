import { styled } from '@mui/material/styles';
import { Box, Button, TextField } from '@mui/material';

export const StyledSellPanel = styled(Box)({
    padding: '20px',
    backgroundColor: '#1E1E2F',
    borderRadius: '10px',
});

export const StyledButton = styled(Button)({
    color: '#FFFFFF',
    backgroundColor: '#F50057',
    '&:hover': {
        backgroundColor: '#D50057',
    },
});

export const StyledTextField = styled(TextField)({
    marginBottom: '15px',
});
