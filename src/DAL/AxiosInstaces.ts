import axios from 'axios';

export const KRC20InfoService = axios.create({
    baseURL: 'https://tn11api.kasplex.org/v1',
});

export const kasInfoService = axios.create({
    baseURL: 'https://api.kaspa.org/',
});

export const backendService = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_ENDPOINT,
});
