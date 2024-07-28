import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { TokenDeploy } from '../../../types/Types';

interface DeployDialogProps {
    open: boolean;
    onClose: () => void;
    onDeploy: () => void;
    tokenData: TokenDeploy;
}

const DeployDialog: React.FC<DeployDialogProps> = ({ open, onClose, onDeploy, tokenData }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Review Token Deployment</DialogTitle>
        <DialogContent>
            {Object.entries(tokenData).map(([key, value]) => (
                <Typography key={key} variant="body1">
                    <strong>{key.replace(/([A-Z])/g, ' $1')}: </strong>
                    {value}
                </Typography>
            ))}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary">
                Cancel
            </Button>
            <Button onClick={onDeploy} color="primary">
                Deploy
            </Button>
        </DialogActions>
    </Dialog>
);

export default DeployDialog;
