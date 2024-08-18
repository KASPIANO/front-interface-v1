import { styled } from '@mui/material';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-30px);
    }
  }
`;

export const BackgroundContainer = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#121212',
    zIndex: -1,
});

export const Token = styled('div')({
    width: '13vh',
    height: '13vh',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    borderRadius: '50%',
    position: 'absolute',
    filter: 'blur(5px)',
    animation: 'bounce var(--duration) ease-in-out infinite alternate',
    animationDelay: 'var(--delay)',
    pointerEvents: 'none',
    transform: 'translate3d(0, 0, 0)',
});
