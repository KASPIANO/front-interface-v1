import axios from 'axios';

const GOOGLE_CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const fetchCalendarEvents = async (startDate: string, endDate: string) => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events`,
            {
                params: {
                    key: API_KEY,
                    timeMin: startDate,
                    timeMax: endDate,
                    singleEvents: true,
                    orderBy: 'startTime',
                },
            },
        );

        // Only include events that have 'isBooked' set to 'false' and are predefined weekly slots
        const events = (response.data.items || []).filter(
            (event: any) => event.extendedProperties?.private?.isBooked === 'false',
        );

        // Map events to a simpler structure for displaying in the component
        return events.map((event: any) => ({
            id: event.id,
            summary: event.summary, // Slot name (e.g., "Slot 1", "Slot 2")
            start: event.start.dateTime, // Start of the week
            end: event.end.dateTime, // End of the week
            isBooked: event.extendedProperties?.private?.isBooked === 'true',
        }));
    } catch (error) {
        console.error('Error fetching events from Google Calendar:', error);
        return [];
    }
};
