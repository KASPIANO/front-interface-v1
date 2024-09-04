import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { TokenKRC20DeployMetadata } from '../../../../types/Types';

interface ReviewListTokenDialogProps {
    open: boolean;
    onClose: () => void;
    onList: () => void;
    tokenMetadata: TokenKRC20DeployMetadata;
}

const ReviewListTokenDialog: React.FC<ReviewListTokenDialogProps> = (props) => {
    const { open, onClose, onList, tokenMetadata } = props;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Review Token Listing</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '1vh' }}>
                    Listing costs 1250 amount of KAS. This is to sustain our website, the tools we build for you,
                    the rug score algorithm we provide to users for transparency, analytics, and also prevents
                    spam.
                </Typography>
                {Object.entries(tokenMetadata).map(([key, value]) => (
                    <Typography key={key} variant="body1">
                        <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: </span>
                        <strong>{typeof value === 'string' ? value : (value as File).name}</strong>
                    </Typography>
                ))}
            </DialogContent>
            <DialogActions>
                <Box sx={{ flexGrow: 1 }}>
                    <Button onClick={onClose}>Cancel</Button>
                </Box>
                <Button onClick={onList} variant="contained" color="primary">
                    List Token & Pay
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewListTokenDialog;
