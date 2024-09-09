import axios from 'axios';

export const KRC20InfoService = axios.create({
    baseURL: import.meta.env.VITE_API_KRC20,
});

export const kasInfoService = axios.create({
    baseURL: import.meta.env.VITE_KASPA_API,
});

export const backendService = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
});
