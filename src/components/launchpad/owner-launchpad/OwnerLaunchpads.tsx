import React, { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useGetOwnerLaunchpads } from '../../../DAL/LaunchPadQueries';
import LaunchpadCard from './OwnerLaunchpadItem';
import { useQueryClient } from '@tanstack/react-query';

interface OwnerLaunchpadPageProps {
    walletAddress: string;
    walletConnected;
}

const OwnerLaunchpadPage: React.FC<OwnerLaunchpadPageProps> = (props) => {
    const { walletAddress, walletConnected } = props;
    const { data, isLoading, error } = useGetOwnerLaunchpads(walletAddress);
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['OwnerLaunchpads', walletAddress] });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress]);

    if (!walletConnected) {
        return (
            <Typography sx={{ height: '76vh' }}>Please connect your wallet to view your launchpads.</Typography>
        );
    }

    if (isLoading) {
        return <Typography sx={{ height: '76vh' }}>Loading launchpads...</Typography>;
    }

    if (error) {
        return <Typography sx={{ height: '76vh' }}>Error loading launchpads: {error.message}</Typography>;
    }

    if (!data || !data.lunchpads || data.lunchpads.length === 0) {
        return <Typography sx={{ height: '76vh' }}>No launchpads available.</Typography>;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                {data.lunchpads.map((launchpad) => (
                    <Grid item xs={12} sm={6} md={4} key={launchpad.ticker}>
                        <LaunchpadCard
                            walletAddress={walletAddress}
                            ticker={launchpad.ticker}
                            availabeUnits={launchpad.availabeUnits}
                            kasPerUnit={launchpad.kasPerUnit}
                            tokenPerUnit={launchpad.tokenPerUnit}
                            status={launchpad.status}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default OwnerLaunchpadPage;
