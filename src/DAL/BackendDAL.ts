import { AxiosError, AxiosResponse } from 'axios';
import { Token, TokenListItem, TokenDeploy } from '../types/Types';
import { backendService } from './AxiosInstaces';

const KRC20CONTROLLER = 'krc20';
const KRC20METADATA_CONTROLLER = 'krc20metadata';

export type BackendValidationErrorsType = {
    [key: string]: string[];
};

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

        const response = await backendService.get<Token[]>(url);

        return response.data;
    } catch (error) {
        console.error('Error fetching tokens from backend:', error);
        return [];
    }
}

export async function fetchTokenByTicker(ticker: string): Promise<Token> {
    try {
        const response = await backendService.get<Token>(`/${KRC20CONTROLLER}/${ticker}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching token from backend:', error);
        return {} as Token;
    }
}

export async function countTokens(): Promise<number> {
    try {
        const response = await backendService.get<{ count: number }>(`/${KRC20CONTROLLER}/count`);
        return response.data.count;
    } catch (error) {
        console.error('Error counting tokens from backend:', error);
        return 0;
    }
}

export async function updateTokenMetadataAfterDeploy(
    txid: string,
    tokenDetails: TokenDeploy,
): Promise<AxiosResponse<any> | null> {
    try {
        const response = await backendService.post<any>(`/${KRC20METADATA_CONTROLLER}/after-deploy`, {
            ...tokenDetails,
            transactionHash: txid,
        });
        return response;
    } catch (error) {
        console.error('Error saving token metadata:', error);
        
        if (error instanceof AxiosError) {
            return error.response;
        }

        return null;
    }
}

export async function sendServerRequestAndSetErrorsIfNeeded<T>(
    requestFunction: () => Promise<AxiosResponse<T | BackendValidationErrorsType> | null>,
    setErrors: (errors: BackendValidationErrorsType) => void,
) {
    const response = await requestFunction();

    if (!response) {
        return null;
    }

    if (response.status === 400) {
        setErrors(response.data as BackendValidationErrorsType);
        return null;
    }

    return response.data;
}
