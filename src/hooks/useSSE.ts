import { useEffect, useState } from 'react';

const useSSE = (walletId: string) => {
    const [events, setEvents] = useState([]);
    const url = import.meta.env.VITE_API_ENDPOINT;
    useEffect(() => {
        // Open SSE connection with customer ID
        const eventSource = new EventSource(`${url}?walletId=${walletId}`);

        // Handle incoming messages
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setEvents((prevEvents) => [...prevEvents, data]);
        };

        // Handle errors (optional, SSE will attempt to reconnect automatically)
        eventSource.onerror = (err) => {
            console.error('EventSource failed:', err);
            eventSource.close(); // Optionally close connection on error
        };

        // Cleanup: Close the connection when the component unmounts
        return () => {
            console.log(`Closing connection for customer ${walletId}`);
            eventSource.close();
        };
    }, [url, walletId]);

    return events;
};

export default useSSE;
