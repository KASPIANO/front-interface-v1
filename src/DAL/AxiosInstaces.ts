import axios from 'axios';

export const KRC20InfoService = axios.create({
    baseURL: 'https://tn10api.kasplex.org/v1',
});

export const kasInfoService = axios.create({
    baseURL: 'https://api.kaspa.org/',
});

export const backendService = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    withCredentials: true, // This allows cookies to be sent with the request
});
