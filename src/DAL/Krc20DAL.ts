import { Krc20ApiTokenResponse, TokenRowPortfolioItem } from '../types/Types';
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

export async function fetchMintHistory(ticker: string, urlParams = ''): Promise<any[]> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/oplist/mint?tick=${ticker}${urlParams}`);
        return response.data.result.slice(0, 10);
    } catch (error) {
        console.error('Error fetching mint history:', error);
        return [];
    }
}

export const fetchTokenInfo = async (tick: string, holders = true): Promise<Krc20ApiTokenResponse> => {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/token/${tick}?holder=${holders}`);
        return response.data.result[0];
    } catch (error) {
        console.error('Error fetching token info:', error);
        return {} as Krc20ApiTokenResponse;
    }
};

export async function fetchTransactionCount(ticker: string): Promise<number> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/oplist/transfer?tick=${ticker}`);
        return response.data.result.length;
    } catch (error) {
        console.error('Error fetching transaction count:', error);
        return 0;
    }
}

export async function fetchDevWalletBalance(ticker: string, devWallet: string): Promise<number> {
    const response = await KRC20InfoService.get<any>(`krc20/address/${devWallet}/token/${ticker}`);

    const balance = response.data.result[0].balance || '0';

    return parseFloat(balance) / 1e8;
}

export async function fetchWalletKRC20Balance(address: string): Promise<TokenRowPortfolioItem[]> {
    try {
        const response = await KRC20InfoService.get<any>(`krc20/address/${address}/tokenlist`);
        const { result } = response.data;

        // Map the result to fit TokenRowPortfolioItem structure
        const portfolioItems = result.map((item: any) => ({
            ticker: item.tick,
            balance: parseInt(item.balance) / 1e8,
            logoUrl: '', // Metadata request will fill this later
        }));

        return portfolioItems;
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return [];
    }
}
