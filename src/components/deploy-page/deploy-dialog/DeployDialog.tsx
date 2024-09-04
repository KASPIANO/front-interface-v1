import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { TokenKRC20Deploy } from '../../../types/Types';
import { styled, keyframes } from '@mui/material/styles';

interface DeployDialogProps {
    open: boolean;
    onClose: () => void;
    onDeploy: () => void;
    tokenData: TokenKRC20Deploy;
    isDeploying?: boolean;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled('div')(({ theme }) => ({
    margin: '20px auto',
    width: '40px',
    height: '40px',
    border: `4px solid ${theme.palette.grey[500]}`, // Info color
    borderTop: `4px solid ${theme.palette.primary.main}`, // Primary color
    borderRadius: '50%',
    animation: `${spin} 1s linear infinite`,
}));

const DeployDialog: React.FC<DeployDialogProps> = (props) => {
    const { open, onClose, onDeploy, tokenData, isDeploying } = props;
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Review Token Deployment</DialogTitle>
            <DialogContent>
                {isDeploying ? (
                    <Spinner />
                ) : (
                    <>
                        {Object.entries(tokenData).map(([key, value]) => (
                            <Typography key={key} variant="body1">
                                <span>
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:{' '}
                                </span>
                                <strong>{value as React.ReactNode}</strong>
                            </Typography>
                        ))}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Box sx={{ flexGrow: 1 }}>
                    <Button onClick={onClose}>Cancel</Button>
                </Box>
                <Button onClick={onDeploy} variant="contained">
                    Deploy
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeployDialog;
