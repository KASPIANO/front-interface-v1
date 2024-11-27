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
} from '@mui/material';

interface LaunchpadUsageGuideProps {
    open: boolean;
    onClose: () => void;
}

const LaunchpadUsageGuide: React.FC<LaunchpadUsageGuideProps> = ({ open, onClose }) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>How to Use the Launchpad</DialogTitle>
        <DialogContent>
            <DialogContentText>
                <Typography variant="body1" paragraph>
                    Follow these steps to manage and operate your launchpad effectively:
                </Typography>
            </DialogContentText>
            <List>
                <ListItem>
                    <ListItemText
                        primary="1. Fund Tokens"
                        secondary="You must fund the tokens required for the launchpad to operate. This ensures buyers receive their tokens upon purchase."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="2. Fund Gas (Kaspa)"
                        secondary="Fund the required gas (Kaspa) for transactions. This covers the fees for processing purchases."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="3. Start/Stop Launchpad"
                        secondary="You can start the launchpad when ready. If stopped, the launchpad will finish any open orders before ceasing new purchases."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="4. Manage Whitelist"
                        secondary="Toggle the whitelist to restrict purchases to specific wallet addresses or make the launchpad public."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="5. Edit Launchpad"
                        secondary="You can update details like token price, tokens per batch, and whitelist settings at any time."
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="6. Withdraw Funds"
                        secondary="To withdraw funds (tokens or gas), stop the launchpad first. The Laucnhpad will finish processing the orders before allowing withdrawals."
                    />
                </ListItem>
            </List>
            <Typography variant="body2" sx={{ mt: 2 }}>
                *Note: Kaspiano charges a <strong>2.5% fee</strong> on the total funds raised during withdrawal.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Close
            </Button>
        </DialogActions>
    </Dialog>
);

export default LaunchpadUsageGuide;
