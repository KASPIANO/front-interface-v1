import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { AdType } from '../../types/Types';
import GoogleCalendarEmbed from './GoogleCalendar';

const AdsPage: React.FC = () => {
    const [selectedAdType, setSelectedAdType] = useState<AdType | null>(null);
    const [selectedSlot] = useState(null);

    const handleAdTypeChange = (event: SelectChangeEvent<AdType>) => {
        setSelectedAdType(event.target.value as AdType);
    };

    const handleProceedToBooking = () => {
        if (selectedSlot) {
            // Trigger booking API with selectedAdType and selectedSlot details
            console.log('Booking slot:', { selectedAdType, selectedSlot });
        }
    };

    return (
        <Box
            sx={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            {/* Page Header */}
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                Schedule Your Ad on Kaspiano
            </Typography>

            {/* Step 1: Choose Ad Type */}
            <Card sx={{ width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
                <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
                        Step 1: Choose Ad Type
                    </Typography>
                    <Select
                        value={selectedAdType}
                        onChange={handleAdTypeChange}
                        displayEmpty
                        fullWidth
                        variant="outlined"
                    >
                        <MenuItem value="" disabled>
                            Select Ad Type
                        </MenuItem>
                        <MenuItem value={AdType.BANNER}>Main Page (Banner) - $300/week</MenuItem>
                        <MenuItem value={AdType.SIDEBAR}>Token Page (Sidebar) - $250/week</MenuItem>
                    </Select>
                </CardContent>
            </Card>

            {/* Step 2: Google Calendar Embed for Slot Selection */}
            <Card sx={{ width: '100%', maxWidth: '800px', marginBottom: '2rem' }}>
                <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
                        Step 2: Select Your Slot
                    </Typography>
                    <GoogleCalendarEmbed />
                </CardContent>
            </Card>

            {/* Proceed to Booking */}
            <Box sx={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProceedToBooking}
                    disabled={!selectedAdType || !selectedSlot}
                >
                    Proceed to Booking
                </Button>
            </Box>
        </Box>
    );
};

export default AdsPage;
