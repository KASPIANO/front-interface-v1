import { AxiosError, AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';
import {
    BackendTokenResponse,
    TickerPortfolioBackend,
    TokenListItemResponse,
    TokenSearchItems,
    TokenSentiment,
    TradeStats,
    UserReferral,
    VerifiedUser,
} from '../types/Types';
import { backendService } from './AxiosInstaces';

const KRC20CONTROLLER = 'krc20';
const P2PCONTROLLER = 'p2p';
const P2PCONTROLLERDATA = 'p2p-data';
const KRC20METADATA_CONTROLLER = 'krc20metadata';
const USER_REFERRALS_CONTROLLER = 'referrals';
const AUTH_CONTROLLER = 'auth';

export type BackendValidationErrorsType = {
    [key: string]: string[];
};

export const fetchAllTokens = async (
    limit = 50,
    skip = 0,
    order: string | null = null,
    direction: string | null = null,
    timeInterval: string,
): Promise<TokenListItemResponse[]> => {
    try {
        const urlParams = new URLSearchParams();
        urlParams.append('skip', skip.toString());
        urlParams.append('limit', limit.toString());
        urlParams.append('timeInterval', timeInterval.toString());

        if (order) {
            urlParams.append('order', order);
        }
        if (direction) {
            urlParams.append('direction', direction);
        }
        const url = `/${KRC20CONTROLLER}?${urlParams.toString()}`;

        const response = await backendService.get<TokenListItemResponse[]>(url);

        return response.data;
    } catch (error) {
        console.error('Error fetching tokens from backend:', error);
        return [];
    }
};

export async function fetchTokenByTicker(
    ticker: string,
    wallet?: string,
    refresh = false,
): Promise<BackendTokenResponse> {
    const params = {};
    const capitalTicker = ticker.toUpperCase();
    if (refresh) {
        params['refresh'] = true;
    }
    if (wallet) {
        params['wallet'] = wallet;
    }

    const response = await backendService.get<BackendTokenResponse>(`/${KRC20CONTROLLER}/${capitalTicker}`, {
        params,
    });
    return response.data;
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

export async function recalculateRugScore(ticker: string): Promise<number> {
    const response = await backendService.post<{ rugScore: number }>(
        `/${KRC20METADATA_CONTROLLER}/update-rug-score`,
        {
            ticker,
        },
    );
    return response.data.rugScore;
}

export async function updateWalletSentiment(
    ticker: string,
    wallet: string,
    sentiment: keyof TokenSentiment,
): Promise<TokenSentiment> {
    const result = await backendService.post<TokenSentiment>(`/${KRC20METADATA_CONTROLLER}/set-sentiment`, {
        sentiment,
        ticker,
        wallet,
    });

    return result.data;
}

export async function updateTokenMetadata(
    tokenDetails: FormData, // TokenDeploy
): Promise<AxiosResponse<any> | null> {
    // eslint-disable-next-line no-return-await
    return await makeUpdateTokenMetadataRequest(tokenDetails, false);
}

export async function validateFormDetailsForUpdateTokenMetadata(
    tokenDetails: FormData, // TokenDeploy
): Promise<AxiosResponse<any> | null> {
    // eslint-disable-next-line no-return-await
    return await makeUpdateTokenMetadataRequest(tokenDetails, true);
}

export async function makeUpdateTokenMetadataRequest(
    tokenDetails: FormData, // TokenDeploy
    validateOnly = false,
): Promise<AxiosResponse<any> | null> {
    try {
        let url = `/${KRC20METADATA_CONTROLLER}/update`;

        if (validateOnly) {
            url += '-validate';
        }

        const response = await backendService.post<any>(url, tokenDetails);
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

    if (!response || ![200, 201].includes(response.status)) {
        return null;
    }

    return response.data;
}

export async function searchToken(query: string, cancelToken: CancelToken = null): Promise<TokenSearchItems[]> {
    const requestOptions: AxiosRequestConfig = {
        params: { query },
    };

    if (cancelToken) {
        requestOptions.cancelToken = cancelToken;
    }

    const response = await backendService.get<TokenSearchItems[]>(`/${KRC20CONTROLLER}/search`, requestOptions);
    return response.data;
}

export async function fetchTokenPortfolio(tickers: string[]): Promise<TickerPortfolioBackend[]> {
    const tickersString = tickers.length > 0 ? tickers.join(',') : '';
    try {
        const response = await backendService.get<TickerPortfolioBackend[]>(
            `/${KRC20CONTROLLER}/portfolio?tickers=${tickersString}`,
        );

        // Assuming response.data contains the actual array of logo URLs
        return response.data;
    } catch (error) {
        console.error('Error fetching token logo URL:', error);
        return [];
    }
}

export async function signUser(verifiedUser: VerifiedUser): Promise<{ message: string }> {
    try {
        const response = await backendService.post<{ message: string }>(`/${AUTH_CONTROLLER}/sign`, {
            verifiedUser,
        });

        // Assuming response.data contains the actual array of logo URLs
        return response.data;
    } catch (error) {
        console.error('Error fetching token logo URL:', error);
        return;
    }
}

export const fetchTokenPrice = async (ticker: string): Promise<number> => {
    try {
        const response = await backendService.get<{ price: number }>(`/${KRC20CONTROLLER}/token-price/${ticker}`);
        return response.data.price;
    } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error.response ? error.response.data : error.message);
        return 0; // Return 0 in case of an error
    }
};
export const getTokenPriceHistory = async (ticker: string): Promise<{ price: number; date: string }[]> => {
    try {
        const capitalTicker = ticker.toUpperCase();
        const response = await backendService.get<{ data: { price: number; date: string }[] }>(
            `/${KRC20CONTROLLER}/price-history/${capitalTicker}`,
        );
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error.response ? error.response.data : error.message);
        return []; // Return empty array in case of an error
    }
};

export const getGasEstimator = async (orderId: string): Promise<any> => {
    try {
        const response = await backendService.get<any>(`/${P2PCONTROLLER}/feeRate`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting order ${orderId}:`, error.response ? error.response.data : error.message);
        return { confirmed: false }; // Return empty array in case of an error
    }
};

export const getUserReferral = async (walletAddress: string, referredBy?: string): Promise<UserReferral> => {
    const response = await backendService.post<UserReferral>(`/${USER_REFERRALS_CONTROLLER}/user-referral`, {
        walletAddress,
        referredBy,
    });
    return response.data;
};

export const fetchTickerTradeStats = async (ticker: string, timeInterval?: string): Promise<TradeStats> => {
    const timeFrame = timeInterval === 'All' ? '' : timeInterval;
    const timeQueryStr = timeFrame ? `&timeFrame=${timeFrame}` : '';
    const capitalTicker = ticker.toUpperCase();
    const response = await backendService.get<TradeStats>(
        `/${P2PCONTROLLERDATA}/trade-stats?ticker=${capitalTicker}${timeQueryStr}`,
    );
    return response.data;
};
export const fetchTickerFloorPrice = async (ticker: string): Promise<{ ticker: string; floor_price: number }> => {
    const capitalTicker = ticker.toUpperCase();
    const response = await backendService.get<{ ticker: string; floor_price: number }>(
        `/${P2PCONTROLLERDATA}/floor-price?ticker=${capitalTicker}`,
    );
    return response.data[0];
};

export const getHolderChange = async (ticker: string, timeInterval?: string): Promise<any> => {
    const capitalTicker = ticker.toUpperCase();
    const timeFrame = timeInterval === 'All' ? '' : timeInterval;
    const timeQueryStr = timeFrame ? `&timeInterval=${timeFrame}` : '';
    const response = await backendService.get<any>(
        `/${KRC20CONTROLLER}/holder-change?ticker=${capitalTicker}${timeQueryStr}`,
    );
    return response.data;
};
