import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { styled } from '@mui/material';

export const NotificationContainer = styled('div')({
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#1e1e2f',
    color: 'white',
    padding: '15px 20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '350px',
});

export const NotificationText = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
});

export const Checkmark = styled(CheckCircleRoundedIcon)({
    color: '#39ddbe',
    marginRight: '10px',
});

export const CloseButton = styled('button')({
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
});
