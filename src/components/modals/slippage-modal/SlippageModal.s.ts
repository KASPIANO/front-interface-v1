import { styled } from '@mui/material';

export const ModalOverlay = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
});

export const ModalContent = styled('div')({
    backgroundColor: '#1e1e2f',
    padding: '20px',
    borderRadius: '12px',
    width: '400px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '96vw',
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

export const ModalBody = styled('div')({
    color: '#fff',
});

export const SaveButton = styled('button')({
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#6ec7ba',
    fontWeight: 600,
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
    '&:hover': {
        backgroundColor: '#39ddbe',
    },
});

export const ModeButton = styled('button')<{ active: boolean }>(({ active }) => ({
    flex: 1,
    marginRight: '10px',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: active ? '#6ec7ba' : '#353545',
    color: '#fff',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#39ddbe',
        color: '#000',
    },
    '&:last-child': {
        marginRight: 0,
    },
}));

export const SlippageButton = styled('button')<{ active: boolean }>(({ active }) => ({
    flex: 1,
    marginRight: '10px',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: active ? '#6ec7ba' : '#353545',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&:hover': {
        backgroundColor: '#39ddbe',
        color: '#000',
    },
    '&:last-child': {
        marginRight: 0,
    },
}));

export const CustomInputContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

export const PercentInput = styled('input')({
    maxHeight: '16px',
    maxWidth: '45px',
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '13px',
    textAlign: 'right',
});

export const PercentSign = styled('span')({
    color: '#fff',
    fontSize: '13px',
    marginLeft: '2px',
});
