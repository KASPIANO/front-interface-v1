import { useEffect, useState } from 'react';

const useSSE = (walletId: string) => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const url = import.meta.env.VITE_API_ENDPOINT;

    useEffect(() => {
        if (!walletId) return; // Don't open connection if no walletId

        // Open SSE connection with updated customer ID
        const eventSource = new EventSource(`${url}/events/stream?walletId=${walletId}`);

        // Handle incoming messages
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setEvents((prevEvents) => [...prevEvents, data]);
        };

        // Handle errors
        eventSource.onerror = (err) => {
            setError('EventSource failed to connect.');
            console.error('EventSource failed:', err);
            eventSource.close(); // Close connection on error
        };

        // Cleanup: Close the connection if the walletId changes or component unmounts
        return () => {
            console.log(`Closing connection for customer ${walletId}`);
            eventSource.close();
        };
    }, [url, walletId]); // Re-run the effect when walletId or URL changes

    return { events, error };
};

export default useSSE;
