import { styled } from '@mui/material';

export const ModalOverlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
});

export const ModalContent = styled('div')({
  background: '#1e1e2f',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  color: '#fff',
  textAlign: 'center',

  '@media (max-width: 550px)': {
    width: '90%',
  },
});

export const Logo = styled('img')({
  width: '80px',
  height: '80px',
  marginTop: '20px',
});

export const ModalTitle = styled('h2')({
  fontSize: '24px',
  marginBottom: '10px',
  fontWeight: 600,

  '@media (max-width: 550px)': {
    fontSize: '20px',
  },
});

export const ModalText = styled('p')({
  fontSize: '16px',
  marginBottom: '20px',
  fontWeight: 400,

  '@media (max-width: 550px)': {
    fontSize: '14px',
  },
});

export const SubText = styled('p')({
  fontSize: '14px',
  marginBottom: '10px',
  fontWeight: 300,

  '@media (max-width: 550px)': {
    fontSize: '12px',
  },
});

export const ModalButton = styled('button')({
  backgroundColor: '#6ec7ba',
  border: 'none',
  borderRadius: '4px',
  padding: '10px 10px',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',

  '&:hover': {
    backgroundColor: '#39ddbe',
  },

  '@media (max-width: 550px)': {
    fontSize: '14px',
    padding: '8px 16px',
  },
});

export const LinkButton = styled('a')({
  backgroundColor: '#6ec7ba',
  border: 'none',
  borderRadius: '4px',
  padding: '10px 20px',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',
  display: 'inline-block',
  textDecoration: 'none',
  marginRight: '20px',

  '&:hover': {
    backgroundColor: '#39ddbe',
  },

  '@media (max-width: 550px)': {
    fontSize: '14px',
    padding: '8px 16px',
  },
});

export const InstallLink = styled('a')({
  display: 'block',
  color: '#39ddbe',
  textDecoration: 'none',
  fontSize: '16px',
  marginBottom: '10px',

  '&:hover': {
    textDecoration: 'underline',
  },

  '@media (max-width: 550px)': {
    fontSize: '14px',
  },
});

export const HorizontalLine = styled('hr')({
  border: 0,
  height: '1px',
  background: '#444',
  margin: '20px 0',
});
