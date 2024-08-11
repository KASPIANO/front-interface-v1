import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SuccessModalContent = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
});

export const SuccessModalActions = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
});

export const SuccessModalContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    width: '50vw',
    height: '50vh',
});
