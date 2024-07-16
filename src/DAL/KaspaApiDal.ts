import { Token, TokenResponse } from '../types/Types';
import { KRC20InfoService, kasInfoService } from './AxiosInstaces';

// Fetch receiving balance
export const fetchReceivingBalance = async (address: string, tokenSymbol: string): Promise<number> => {
    try {
        const response = await kasInfoService.get<any>(`addresses/${address}/${tokenSymbol}/balance`);
        return response.data.balance / 1e8;
    } catch (error) {
        console.error('Error fetching receiving balance:', error);
        return 0;
    }
};

// Fetch wallet balance
export const fetchWalletBalance = async (address: string): Promise<number> => {
    try {
        let balanceInKaspa;

        if (window.kasware && window.kasware.getBalance) {
            const balance = await window.kasware.getBalance();
            balanceInKaspa = balance.total / 1e8;
        } else {
            const response = await kasInfoService.get<any>(`addresses/${address}/balance`);
            balanceInKaspa = response.data.balance / 1e8;
        }

        return balanceInKaspa;
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return 0;
    }
};

// Fetch tokens
export const fetchTokens = async (page = 1): Promise<TokenResponse[]> => {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/tokenlist?page=${page}`);
        return response.data.result || [];
    } catch (error) {
        console.error('Error fetching token list:', error);
        return [];
    }
};

// Fetch token info
export const fetchTokenInfo = async (tick: string, holders = true): Promise<Token> => {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/token/${tick}?holder=${holders}`);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching token info:', error);
        return {} as Token;
    }
};
