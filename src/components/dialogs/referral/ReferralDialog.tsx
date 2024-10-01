import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import {
    AccountCircle as AccountIcon,
    Redeem as RedeemIcon,
    ContentCopyRounded as ContentCopyRoundedIcon,
} from '@mui/icons-material';
import { addReferredBy } from '../../../DAL/BackendDAL';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';

interface ReferralDialogProps {
    open: boolean;
    onClose: () => void;
    walletAddress: string;
    referralCode?: string | null; // Used to display referral code if it exists
    mode: 'get' | 'add'; // To control the mode of the dialog (get vs. add referral)
}

const ReferralDialog: React.FC<ReferralDialogProps> = ({ open, onClose, walletAddress, referralCode, mode }) => {
    const [referredByCode, setReferredByCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [, setCopied] = useState(false);

    // Copy referral code to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopied(true);
                showGlobalSnackbar({
                    message: 'Copied to clipboard',
                    severity: 'success',
                });
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    // Add referred by code
    const handleAddReferredBy = async () => {
        setLoading(true);
        const result = await addReferredBy(walletAddress, referredByCode);
        if (result) {
            alert('Referred by code added successfully!');
            setReferredByCode('');
        } else {
            alert('Failed to add referred by code.');
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <RedeemIcon fontSize="large" style={{ marginRight: 10 }} />
                    {mode === 'get' ? (
                        <Typography variant="h6">Your Referral Code</Typography>
                    ) : (
                        <Typography variant="h6">Referral System</Typography>
                    )}
                </Box>
            </DialogTitle>
            <DialogContent>
                {mode === 'get' && referralCode ? (
                    <DialogContentText>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <AccountIcon fontSize="large" style={{ marginRight: 10 }} />
                            <Typography>
                                Your Referral Code: <strong>{referralCode}</strong>
                            </Typography>
                            <IconButton
                                onClick={() => copyToClipboard(referralCode)}
                                aria-label="Copy Referral Code"
                                sx={{ marginLeft: 1 }}
                            >
                                <ContentCopyRoundedIcon />
                            </IconButton>
                        </Box>
                    </DialogContentText>
                ) : (
                    <>
                        <DialogContentText>
                            <Box display="flex" alignItems="center">
                                <AccountIcon fontSize="large" style={{ marginRight: 10 }} />
                                <Typography>
                                    Welcome to our referral program! Share your referral code with others, and when
                                    they sign up, both of you will earn points. The more you share, the more you
                                    earn!
                                </Typography>
                            </Box>
                        </DialogContentText>
                        <Box marginTop={2} display="flex" flexDirection="column" alignItems="center">
                            {/* Input field to add a referral code */}
                            <TextField
                                label="Referral Code"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={referredByCode}
                                onChange={(e) => setReferredByCode(e.target.value)}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleAddReferredBy}
                                disabled={loading || referredByCode.length === 0}
                            >
                                Submit Referral Code
                            </Button>
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReferralDialog;
