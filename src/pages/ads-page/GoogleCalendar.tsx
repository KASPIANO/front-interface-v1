import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Button, Grid } from '@mui/material';
import { format, addDays, startOfWeek, setHours, setMinutes, setSeconds } from 'date-fns';
import { fetchCalendarEvents } from '../../DAL/GoogleDal';

interface CalendarEvent {
    id: string;
    summary: string;
    start: string;
    end: string;
    isBooked: boolean;
}

const GoogleCalendarEmbed: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSlot, setSelectedSlot] = useState<CalendarEvent | null>(null);

    useEffect(() => {
        // Define Sunday 3 AM to the next Sunday 3 AM
        const startOfWeekDate = setHours(
            setMinutes(setSeconds(startOfWeek(new Date(), { weekStartsOn: 0 }), 0), 0),
            3,
        );
        const endOfWeekDate = addDays(startOfWeekDate, 7);

        const startDate = startOfWeekDate.toISOString();
        const endDate = endOfWeekDate.toISOString();

        const loadEvents = async () => {
            setLoading(true);
            const fetchedEvents = await fetchCalendarEvents(startDate, endDate);
            setEvents(fetchedEvents);
            setLoading(false);
        };

        loadEvents();
    }, []);

    const handleSlotClick = (slot: CalendarEvent) => {
        if (!slot.isBooked) {
            setSelectedSlot(slot);
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
                Select an Available Ad Slot for the Week
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2} sx={{ marginBottom: '2rem' }}>
                    {events.map((event) => {
                        const isAvailable = !event.isBooked;
                        return (
                            <Grid item xs={6} md={3} key={event.id}>
                                <Box
                                    sx={{
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: `2px solid ${isAvailable ? 'green' : 'red'}`,
                                        textAlign: 'center',
                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                        backgroundColor: isAvailable ? '#e8f5e9' : '#ffebee',
                                    }}
                                    onClick={() => handleSlotClick(event)}
                                >
                                    <Typography variant="body1">
                                        {event.summary} {/* Slot name, e.g., "Slot 1" */}
                                    </Typography>
                                    <Typography variant="body2" color={isAvailable ? 'green' : 'red'}>
                                        {isAvailable ? 'Available' : 'Booked'}
                                    </Typography>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {selectedSlot && (
                <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Typography variant="h6">Selected Slot</Typography>
                    <Typography variant="body1">
                        {selectedSlot.summary} from {format(new Date(selectedSlot.start), 'EEEE, MMM d')} to{' '}
                        {format(new Date(selectedSlot.end), 'EEEE, MMM d')}
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
                        Proceed to Book
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default GoogleCalendarEmbed;
