import { styled } from '@mui/material';

export const ModalOverlay = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
});

export const ModalContent = styled('div')({
    backgroundColor: '#151521',
    padding: '20px',
    borderRadius: '12px',
    width: '400px',
    height: '500px',
    maxWidth: '96vw',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

export const ModalHeader = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
});

export const ModalTitle = styled('h2')({
    color: '#fff',
    margin: 0,
});

export const CloseButton = styled('button')({
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
});

export const SearchContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2b2b3b',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
});

export const SearchInput = styled('input')({
    width: '100%',
    padding: '10px',
    border: 'none',
    outline: 'none',
    background: 'none',
    color: '#fff',
});

export const TokenList = styled('div')({
    maxHeight: '400px',
    overflowY: 'auto',
});

export const TokenItem = styled('div')({
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    cursor: 'pointer',

    '&:hover': {
        backgroundColor: '#353545',
    },
});

export const TokenTextContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
});

export const TokenText = styled('span')({
    color: '#fff',
    fontSize: '14px',
});

export const TokenSymbol = styled('span')({
    color: '#6a7179',
    fontSize: '12px',
});
