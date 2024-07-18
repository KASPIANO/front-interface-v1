import { KRC20InfoService, kasInfoService } from './AxiosInstaces';
import { Token, TokenResponse } from '../types/Types';

export const fetchReceivingBalance = async (address: string, tokenSymbol: string): Promise<number> => {
    try {
        const response = await kasInfoService.get<any>(`addresses/${address}/${tokenSymbol}/balance`);
        return response.data.balance / 1e8;
    } catch (error) {
        console.error('Error fetching receiving balance:', error);
        return 0;
    }
};

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

export const fetchTokens = async (page = 1): Promise<TokenResponse[]> => {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/tokenlist?page=${page}`);
        return response.data.result || [];
    } catch (error) {
        console.error('Error fetching token list:', error);
        return [];
    }
};

export const fetchTokenInfo = async (tick: string, holders = true): Promise<Token> => {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/token/${tick}?holder=${holders}`);
        return response.data.result;
    } catch (error) {
        console.error('Error fetching token info:', error);
        return {} as Token;
    }
};

export async function fetchHoldersCount(ticker: string): Promise<number> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/token/${ticker}?holder=true`);
        return response.data.result.length;
    } catch (error) {
        console.error('Error fetching holders count:', error);
        return 0;
    }
}

export async function fetchTransactionCount(ticker: string): Promise<number> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/oplist/transfer?tick=${ticker}`);
        return response.data.result.length;
    } catch (error) {
        console.error('Error fetching transaction count:', error);
        return 0;
    }
}

export async function fetchTotalSupply(ticker: string): Promise<number> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/token/${ticker}`);
        const { data } = response;
        if (data.result && data.result.length > 0) {
            return parseInt(data.result[0].max);
        }
        throw new Error('Total supply not found');
    } catch (error) {
        console.error('Error fetching total supply:', error);
        return 1;
    }
}

export async function fetchMintHistory(ticker: string, urlParams = ''): Promise<any[]> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/oplist/mint?tick=${ticker}${urlParams}`);
        return response.data.result.slice(0, 10);
    } catch (error) {
        console.error('Error fetching mint history:', error);
        return [];
    }
}

export async function fetchTransferHistory(ticker: string, urlParams = ''): Promise<any[]> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/oplist/transfer?tick=${ticker}${urlParams}`);
        return response.data.result.slice(0, 10);
    } catch (error) {
        console.error('Error fetching transfer history:', error);
        return [];
    }
}
