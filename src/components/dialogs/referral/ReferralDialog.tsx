import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
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
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { UserReferral } from '../../../types/Types';

interface ReferralDialogProps {
    open: boolean;
    onClose: () => void;
    walletAddress: string;
    mode: 'get' | 'add'; // To control the mode of the dialog (get vs. add referral)
    updateAndGetUserReferral: (referredBy?: string) => Promise<UserReferral> | null;
    userReferral: UserReferral | null;
}

const ReferralDialog: React.FC<ReferralDialogProps> = ({
    open,
    onClose,
    mode,
    updateAndGetUserReferral,
    userReferral,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [referredByCode, setReferredByCode] = useState<string>('');

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

        try {
            await updateAndGetUserReferral(referredByCode);

            showGlobalSnackbar({
                message: 'Referred by code added successfully!',
                severity: 'success',
            });

            setReferredByCode('');
            onClose();
        } catch (error) {
            showGlobalSnackbar({
                message: 'Failed to add referred by code.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={(_event, reason) => {
                // Prevent closing the dialog when clicking outside or pressing the Escape key
                if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    onClose();
                }
            }}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <RedeemIcon fontSize="large" style={{ marginRight: 10 }} />
                    {mode === 'get' ? (
                        <Typography variant="h6">Your Referral Code</Typography>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%', // Full width
                                justifyContent: 'space-between', // Align Typography and Button with space in-between
                                alignItems: 'center', // Vertically center the Typography and Button
                            }}
                        >
                            <Typography variant="h6">Referral System</Typography>
                        </Box>
                    )}
                </Box>
            </DialogTitle>
            <DialogContent>
                {mode === 'get' && userReferral && userReferral.code ? (
                    <Box display="flex" alignItems="center" justifyContent="center">
                        <AccountIcon fontSize="large" style={{ marginRight: 10 }} />
                        <Typography>
                            <strong>{userReferral.code}</strong>
                        </Typography>
                        <IconButton
                            onClick={() => copyToClipboard(userReferral.code)}
                            aria-label="Copy Referral Code"
                            sx={{ marginLeft: 1 }}
                        >
                            <ContentCopyRoundedIcon />
                        </IconButton>
                    </Box>
                ) : (
                    <>
                        <Box display="flex" alignItems="center">
                            <AccountIcon fontSize="large" style={{ marginRight: 10 }} />
                            <Typography>
                                Welcome to our referral program! Share your referral code with others, and earn
                                points when they sign up. The more you share, the more you earn! You can also
                                manage your referral codes and access your unique referral link directly from your
                                portfolio. Start sharing and boost your rewards!
                            </Typography>
                        </Box>
                        <Box marginTop={1} display="flex" flexDirection="column" alignItems="center">
                            {/* Input field to add a referral code */}
                            <Typography variant="h6" align="center" gutterBottom>
                                Add Referral Code given to you by the user or community, if you have one!
                            </Typography>
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
            <DialogActions sx={{ paddingTop: 0 }}>
                <Button onClick={onClose} color="secondary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReferralDialog;
