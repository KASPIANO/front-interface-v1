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
    background: '#151521',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxHeight: '80%',
    overflowY: 'auto',

    '@media (max-width: 550px)': {
        maxWidth: '96vw',
    },
});

export const ModalHeader = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
});

export const ModalTitle = styled('h2')({
    margin: 0,
    fontSize: '18px',
});

export const CloseButton = styled('button')({
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
});

export const SearchInput = styled('input')({
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    backgroundColor: '#1e1e2f',
    marginBottom: '20px',
    fontSize: '16px',
});

export const TokenList = styled('ul')({
    listStyle: 'none',
    padding: 0,
    margin: 0,
});

export const TokenItem = styled('li')({
    padding: '10px',
    borderBottom: '1px solid #2b2b3b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',

    '&:hover': {
        backgroundColor: '#2b2b3b',
    },
});

export const TokenImage = styled('img')({
    width: '24px',
    height: '24px',
    marginRight: '10px',
});
