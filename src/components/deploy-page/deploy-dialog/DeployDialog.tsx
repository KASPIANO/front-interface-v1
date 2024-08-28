import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
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
                    <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: </span>
                    <strong>{value}</strong>
                </Typography>
            ))}
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

export default DeployDialog;
