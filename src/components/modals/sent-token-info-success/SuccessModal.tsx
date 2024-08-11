import { FC } from 'react';
import { Modal, Typography, Button, IconButton, useTheme } from '@mui/material';
import CloseIconRounded from '@mui/icons-material/CloseRounded';
import { SuccessModalActions, SuccessModalContainer, SuccessModalContent } from './SuccessModal.s';

interface SuccessModalProps {
    open: boolean;
    onClose: () => void;
}

const SuccessModal: FC<SuccessModalProps> = (props) => {
    const theme = useTheme();
    const { open, onClose } = props;
    return (
        <Modal
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            open={open}
            onClose={onClose}
        >
            <SuccessModalContainer
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    width: '50vw',
                    height: '60vh',
                    borderRadius: '8px',
                    border: `1px solid ${theme.palette.primary.main}`,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: '20%',
                        right: '25%',
                    }}
                    onClick={onClose}
                >
                    <CloseIconRounded />
                </IconButton>
                <SuccessModalContent>
                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Request Sent Successfully!
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Your request has been sent and will be reviewed. This process may take up to 48 hours.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        For more insight, information, or collaborations, please contact us at:
                        <br />
                        <strong>info@mockemail.com</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Thank you for your patience!
                    </Typography>
                </SuccessModalContent>
                <SuccessModalActions>
                    <Button sx={{ marginBottom: '2vw' }} variant="contained" color="primary" onClick={onClose}>
                        Close
                    </Button>
                </SuccessModalActions>
            </SuccessModalContainer>
        </Modal>
    );
};

export default SuccessModal;
