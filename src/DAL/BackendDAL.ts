import { Token, TokenListItem } from '../types/Types';
import { backendService } from './AxiosInstaces';

const KRC20CONTROLLER = 'krc20';

export async function fetchAllTokens(
    limit = 50,
    skip = 0,
    order: string | null = null,
    direction: string | null = null,
): Promise<TokenListItem[]> {
    try {
        const urlParams = new URLSearchParams();
        urlParams.append('skip', skip.toString());
        urlParams.append('limit', limit.toString());

        if (order) {
            urlParams.append('order', order);
        }
        if (direction) {
            urlParams.append('direction', direction);
        }
        const url = `/${KRC20CONTROLLER}?${urlParams.toString()}`;

        const response = await backendService.get<any>(url);

        return response.data;
    } catch (error) {
        console.error('Error fetching tokens from backend:', error);
        return [];
    }
}

export async function fetchTokenByTicker(ticker: string): Promise<Token> {
    try {
        const response = await backendService.get<any>(`/${KRC20CONTROLLER}/${ticker}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching token from backend:', error);
        return {} as Token;
    }
}

export async function countTokens(): Promise<number> {
    try {
        const response = await backendService.get<any>(`/${KRC20CONTROLLER}/count`);
        return response.data.count;
    } catch (error) {
        console.error('Error counting tokens from backend:', error);
        return 0;
    }
}
