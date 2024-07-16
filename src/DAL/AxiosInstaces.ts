import axios from 'axios';

export const KRC20InfoService = axios.create({
    baseURL: 'https://tn11api.kasplex.org/v1',
});

export const kasInfoService = axios.create({
    baseURL: 'https://api.kaspa.org/',
});
