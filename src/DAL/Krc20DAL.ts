import { TokenResponse, Token, TokenListResponse } from '../types/Types';
import { KRC20InfoService } from './AxiosInstaces';

export const fetchReceivingBalance = async (address: string, tokenSymbol: string): Promise<number> => {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/address/${address}/token/${tokenSymbol}`);
        return response.data.balance / 1e8;
    } catch (error) {
        console.error('Error fetching receiving balance:', error);
        return 0;
    }
};

export async function fetchTransferHistory(ticker: string, urlParams = ''): Promise<any[]> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/oplist/transfer?tick=${ticker}${urlParams}`);
        return response.data.result.slice(0, 10);
    } catch (error) {
        console.error('Error fetching transfer history:', error);
        return [];
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

export const fetchTokens = async (next?: string): Promise<TokenListResponse> => {
    try {
        const nextString = next ? `?next=${next}` : '';
        const response = await KRC20InfoService.get<any>(`krc20/tokenlist${nextString}`);
        return response.data
            ? { result: response.data.result, next: response.data.next, prev: response.data.prev }
            : {
                  result: [],
                  next: '',
                  prev: '',
              };
    } catch (error) {
        console.error('Error fetching token list:', error);
        return {
            result: [],
            next: '',
            prev: '',
        };
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
export async function fetchTotalTokensDeployed(): Promise<number> {
    try {
        const response = await KRC20InfoService.get<any>(`info/`);
        return response.data.result.tokenTotal;
    } catch (error) {
        console.error('Error fetching token count:', error);
        return 0;
    }
}
