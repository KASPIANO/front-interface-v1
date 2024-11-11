import axios from 'axios';

export const KRC20InfoService = axios.create({
    baseURL: import.meta.env.VITE_API_KRC20,
});

export const kasInfoService = axios.create({
    baseURL: import.meta.env.VITE_KASPA_API,
});

export const kasInfoMainnetService = axios.create({
    baseURL: 'https://api.kaspa.org/',
});

export const fyiLogoService = axios.create({
    baseURL: 'https://krc20-assets.kas.fyi/icons/',
});

export const backendService = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    withCredentials: true,
});
