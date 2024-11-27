import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    Box,
} from '@mui/material';

interface CreateLaunchpadGuideDialogProps {
    open: boolean;
    onClose: () => void;
}

const CreateLaunchpadGuideDialog: React.FC<CreateLaunchpadGuideDialogProps> = ({ open, onClose }) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Create Launchpad Guide</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Follow these steps to create and manage your Launchpad effectively:
            </DialogContentText>
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6">1. Pre-minted Tokens</Typography>
                <Typography variant="body2">
                    Ensure that your tokens are pre-minted and available in your wallet. This step is mandatory.
                </Typography>

                <Typography variant="h6" sx={{ mt: 2 }}>
                    2. Fill Out the Fields
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="Ticker" secondary="The unique name of your token (4-6 letters)." />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Kas Per Batch"
                            secondary="The amount of KAS requested per batch from users."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Tokens Per Batch"
                            secondary="The number of tokens distributed per batch."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Optional Fields"
                            secondary="Include min/max batches per order, batch limit per wallet, or gas fee if needed."
                        />
                    </ListItem>
                </List>
                <Typography variant="body2" sx={{ ml: 2 }}>
                    Example: If "Kas Per Batch" is 5 KAS, "Tokens Per Batch" is 10,000 tokens, and "Max Batches Per
                    Order" is 10, users can send 50 KAS to receive 100,000 tokens.
                </Typography>

                <Typography variant="h6" sx={{ mt: 2 }}>
                    3. Whitelist Toggle
                </Typography>
                <Typography variant="body2">
                    Enable the whitelist if you want only specific wallet addresses to participate. Download the
                    example CSV, fill it with wallet addresses, and upload it. If Whitelist is off, all users can
                    participate.
                </Typography>

                <Typography variant="h6" sx={{ mt: 2 }}>
                    4. Default Behavior
                </Typography>
                <Typography variant="body2">
                    If you leave certain fields blank:
                    <List>
                        <ListItem>
                            <ListItemText primary="Min/Max Batches Per Order" secondary="Defaults to 1-10." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Limit Batches Per Wallet" secondary="No limit is applied." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Whitelist" secondary="Disabled by default." />
                        </ListItem>
                    </List>
                </Typography>

                <Typography variant="h6" sx={{ mt: 2 }}>
                    5. Important Note
                </Typography>
                <Typography variant="body2" color="error">
                    After creating your Launchpad, go to the "My Launchpads" section to continue managing it.
                </Typography>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} variant="contained" color="primary">
                Close
            </Button>
        </DialogActions>
    </Dialog>
);

export default CreateLaunchpadGuideDialog;
