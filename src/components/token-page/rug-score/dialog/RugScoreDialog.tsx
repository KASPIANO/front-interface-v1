import { FC, useState, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    TextField,
} from '@mui/material';

interface RugScoreDialogProps {
    open: boolean;
    onClose: () => void;
    onAddTwitterHandle: (twitterHandle: string, instantVerification: boolean) => void;
}

const RugScoreDialog: FC<RugScoreDialogProps> = ({ open, onClose, onAddTwitterHandle }) => {
    const [twitterHandle, setTwitterHandle] = useState('');
    const [error, setError] = useState('');

    const validateTwitterHandle = useCallback((handle: string) => {
        if (handle.startsWith('@')) {
            return 'Please enter the username without the @ symbol';
        }
        if (handle.length < 4) {
            return 'Username must be at least 4 characters long';
        }
        if (handle.length > 15) {
            return 'Username cannot exceed 15 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        return '';
    }, []);

    const handleTwitterHandleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setTwitterHandle(value);
            setError(validateTwitterHandle(value));
        },
        [validateTwitterHandle],
    );

    const handleAddTwitterHandle = (instantVerification: boolean) => {
        if (!twitterHandle) {
            setError('Please enter a Twitter handle');
            return;
        }
        if (!error) {
            console.log('instantVerification:', instantVerification);
            onAddTwitterHandle(twitterHandle, instantVerification);
            onClose();
            setTwitterHandle('');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Understanding the Rug Score</DialogTitle>
            <DialogContent>
                <Typography>
                    The Rug Score is an algorithm that evaluates token collections based on their metrics and
                    social media presence. It ranges from 1 to 100, with higher scores indicating greater
                    transparency and trustworthiness.
                </Typography>
                <Typography mt={2}>
                    To display your collection's Rug Score, please verify your Twitter handle using one of the
                    following methods:
                </Typography>
                <Box mt={2}>
                    <Typography variant="h6">1. Instant Verification</Typography>
                    <Typography variant="body2">
                        For immediate verification, pay a small fee of 20 KAS. This helps prevent spam and enhances
                        the credibility of your submission.
                    </Typography>
                    <Typography variant="h6" mt={2}>
                        2. Manual Review
                    </Typography>
                    <Typography variant="body2">
                        Submit your Twitter handle for a thorough manual review. This process may take up to 24
                        hours to ensure the provided information is accurate and belongs to the genuine project
                        token.
                    </Typography>
                </Box>
                <TextField
                    label="Twitter Handle"
                    value={twitterHandle}
                    onChange={handleTwitterHandleChange}
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error || "Enter your Twitter username without the @ symbol (e.g., 'TwitterDev')"}
                />
                <Typography variant="caption" color="textSecondary">
                    Username requirements:
                    <ul>
                        <li>4-15 characters long</li>
                        <li>Only letters (a-z, A-Z), numbers, and underscores</li>
                        <li>No spaces or special characters (except underscore)</li>
                    </ul>
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => handleAddTwitterHandle(true)}
                    color="primary"
                    variant="contained"
                    disabled={!!error || !twitterHandle}
                >
                    Instant Verification (20 KAS)
                </Button>
                <Button
                    onClick={() => handleAddTwitterHandle(false)}
                    color="primary"
                    variant="contained"
                    disabled={!!error || !twitterHandle}
                >
                    Submit for Manual Review
                </Button>
                <Button onClick={onClose} color="secondary" variant="contained">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RugScoreDialog;
