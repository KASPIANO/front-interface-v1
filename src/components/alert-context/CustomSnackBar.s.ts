import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Typography, keyframes, styled } from '@mui/material';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const SnackBarText = styled(Typography)({
    color: 'white',
});

export const SpinningIcon = styled(AutorenewIcon)({
    animation: `${spin} 2s linear infinite`,
});
