import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { TokenKRC20Deploy } from '../../../types/Types';
import { DeployPageSpinner } from '../../../pages/deploy-page/DeployPage.s';

interface DeployDialogProps {
    open: boolean;
    onClose: () => void;
    onDeploy: () => void;
    tokenData: TokenKRC20Deploy;
    isDeploying?: boolean;
    waitingForTokenConfirmation: boolean;
}

const DeployDialog: React.FC<DeployDialogProps> = (props) => {
    const { open, onClose, onDeploy, tokenData, isDeploying, waitingForTokenConfirmation } = props;
    const [disableDeploy, setDisableDeploy] = React.useState(false);
    const handleDeploy = () => {
        onDeploy();
        setDisableDeploy(true);
    };

    const handleClose = () => {
        if (isDeploying || waitingForTokenConfirmation) {
            return; // Prevent closing if deploying or waiting for confirmation
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableEscapeKeyDown={isDeploying || waitingForTokenConfirmation}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Review Token Deployment</DialogTitle>
            <DialogContent>
                {isDeploying ? (
                    <>
                        <DeployPageSpinner />
                        <Typography variant="body1">Waiting for wallet transaction approval...</Typography>
                    </>
                ) : waitingForTokenConfirmation ? (
                    <>
                        <DeployPageSpinner />
                        <Typography variant="body1">Verifying Token Deployment...</Typography>
                    </>
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
                    <Button onClick={onClose} disabled={isDeploying || waitingForTokenConfirmation}>
                        Cancel
                    </Button>
                </Box>
                <Button onClick={handleDeploy} variant="contained" disabled={disableDeploy}>
                    Deploy
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeployDialog;
