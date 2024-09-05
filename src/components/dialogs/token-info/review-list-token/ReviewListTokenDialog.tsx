import React, { useState } from 'react';
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
    const [disableList, setDisableList] = useState(false);

    const handleList = () => {
        onList();
        setDisableList(true);
    };

    const renderValue = (value: any) => {
        if (Array.isArray(value)) {
            // Render array values (e.g., contacts, founders)
            return value.join(', ');
        } else if (value instanceof File) {
            // Render file names (e.g., logo, banner)
            return value.name;
        } else {
            // Render other string values
            return value;
        }
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Review Token Listing</DialogTitle>
            <DialogContent>
                <Typography sx={{ marginBottom: '2vh', fontWeight: 500 }}>
                    Listing requires a payment of 1250 KAS. These funds are used to maintain and enhance our
                    platform, support the development of tools and services provided for your benefit, sustain the
                    Rug Score algorithm for increased transparency and analytics, and help prevent spam and
                    fraudulent activity.
                </Typography>
                {Object.entries(tokenMetadata).map(([key, value]) => (
                    <Typography key={key} variant="body1">
                        <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: </span>
                        <strong>{renderValue(value)}</strong>
                    </Typography>
                ))}
            </DialogContent>
            <DialogActions>
                <Box sx={{ flexGrow: 1 }}>
                    <Button onClick={onClose}>Cancel</Button>
                </Box>
                <Button disabled={disableList} onClick={handleList} variant="contained" color="primary">
                    List Token & Pay
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewListTokenDialog;