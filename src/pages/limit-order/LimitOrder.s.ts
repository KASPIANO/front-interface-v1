import { styled } from '@mui/material';

export const Container = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '20px',

  '@media (max-width: 768px)': {
    flexDirection: 'column',
  },
});
