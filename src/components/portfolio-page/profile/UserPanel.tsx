import { Grid, Divider, Box } from '@mui/material';
import UserProfile from './UserProfile';
import { FC } from 'react';

interface UserPanelProps {
    walletAddress: string;
    tabValue: string;
}
const UserPanel: FC<UserPanelProps> = ({ walletAddress }) => (
    <div style={{ display: 'flex' }}>
        <Grid container spacing={2} padding={2}>
            {/* Left Side - UserProfile */}
            <Grid item xs={4.9} sm={4.9} md={4.9} lg={4.9}>
                <UserProfile walletAddress={walletAddress} />
            </Grid>

            {/* Divider */}
            <Grid item xs={0.1} sm={0.1} md={0.1} lg={0.1} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Divider orientation="vertical" flexItem sx={{ height: '100%' }} />
            </Grid>

            {/* Right Side - Placeholder for future component */}
            <Grid item xs={6.9} sm={6.9} md={6.9} lg={6.9}>
                <Box sx={{ width: '100%' }}>
                    <h3>Referral Dashboard</h3>
                    <p>Coming soon.</p>
                </Box>
            </Grid>
        </Grid>
    </div>
);

export default UserPanel;
