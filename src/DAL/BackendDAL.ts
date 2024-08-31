import { AxiosError, AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';
import { BackendTokenResponse, TokenListItemResponse, TokenSearchItems } from '../types/Types';
import { backendService } from './AxiosInstaces';

const KRC20CONTROLLER = 'krc20';
const KRC20METADATA_CONTROLLER = 'krc20metadata';

export type BackendValidationErrorsType = {
    [key: string]: string[];
};

export const fetchAllTokens = async (
    limit = 50,
    skip = 0,
    order: string | null = null,
    direction: string | null = null,
): Promise<TokenListItemResponse[]> => {
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

        const response = await backendService.get<TokenListItemResponse[]>(url);

        return response.data;
    } catch (error) {
        console.error('Error fetching tokens from backend:', error);
        return [];
    }
};

export async function fetchTokenByTicker(ticker: string): Promise<BackendTokenResponse> {
    try {
        const response = await backendService.get<BackendTokenResponse>(`/${KRC20CONTROLLER}/${ticker}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching token from backend:', error);
        return {} as BackendTokenResponse;
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
    tokenDetails: FormData, // TokenDeploy
): Promise<AxiosResponse<any> | null> {
    // eslint-disable-next-line no-return-await
    return await makeUpdateTokenMetadataAfterDeployRequest(tokenDetails, false);
}

export async function validateFormDetailsForUpdateTokenMetadataAfterDeploy(
    tokenDetails: FormData, // TokenDeploy
): Promise<AxiosResponse<any> | null> {
    // eslint-disable-next-line no-return-await
    return await makeUpdateTokenMetadataAfterDeployRequest(tokenDetails, true);
}

export async function makeUpdateTokenMetadataAfterDeployRequest(
    tokenDetails: FormData, // TokenDeploy
    validateOnly = false,
): Promise<AxiosResponse<any> | null> {
    try {
        let url = `/${KRC20METADATA_CONTROLLER}/after-deploy`;

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
