import {
    FetchWalletActivityResponse,
    Krc20ApiTokenResponse,
    TokenRowActivityItem,
    TokenRowPortfolioItem,
} from '../types/Types';
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

export async function fetchWalletActivity(
    address: string,
    paginationKey: string | null = null,
    direction: 'next' | 'prev' | null = null,
): Promise<FetchWalletActivityResponse> {
    try {
        // Append pagination direction and key (next/prev) if applicable
        let queryParam = '';
        if (paginationKey && direction) {
            queryParam = `&${direction}=${paginationKey}`;
        }
        const response = await KRC20InfoService.get<any>(`krc20/oplist?address=${address}${queryParam}`);
        const operations = response.data.result;
        if (operations.length !== 0) {
            const activityItems: TokenRowActivityItem[] = operations.map((op: any) => {
                let type: string;
                switch (op.op) {
                    case 'transfer':
                        type = 'Transfer';
                        break;
                    case 'mint':
                        type = 'Mint';
                        break;
                    case 'deploy':
                        type = 'Deploy';
                        break;
                    default:
                        type = 'Unknown';
                        break;
                }
                const amount = op.amt ? (parseInt(op.amt) / 100000000).toFixed(2) : '---';
                return {
                    ticker: op.tick,
                    amount,
                    type,
                    time: new Date(parseInt(op.mtsAdd)).toLocaleString(),
                };
            });

            return {
                activityItems,
                next: response.data.next || null, // 'next' page key
                prev: response.data.prev || null, // 'prev' page key
            };
        } else {
            return {
                activityItems: [],
                next: null,
                prev: null,
            };
        }
    } catch (error) {
        console.error('Error fetching wallet activity:', error);
        return { activityItems: [], next: null, prev: null };
    }
}
