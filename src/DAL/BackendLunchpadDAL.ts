import {
    GetLunchpadListParams,
    Pagination,
    Sort,
    SortDirection,
    CreateLunchpadOrderParams,
    LunchpadWalletType,
} from '../utils/Constants';
import { backendService } from './AxiosInstaces';

const LUNCHPAD_CONTROLLER = 'lunchpad';

export const getLunchpad = async (ticker: string) => {
    const response = await backendService.get(`/${LUNCHPAD_CONTROLLER}/${ticker}`);
    return response.data;
};

export const getLunchpadForOwner = async (ticker: string) => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${ticker}/owner-info`);
    return response.data;
};

export const getLunchpads = async (
    filters: GetLunchpadListParams['filters'] = {},
    pagination: Pagination = { limit: 20, offset: 0 },
    sort: Sort = { direction: SortDirection.DESC },
): Promise<any> => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/list`, {
        filters,
        pagination,
        sort,
    });
    return response.data;
};

// Creates a new lunchpad order
export const createLunchpadOrder = async ({
    ticker,
    kasPerUnit,
    tokenPerUnit,
    maxFeeRatePerTransaction,
    minUnitsPerOrder,
    maxUnitsPerOrder,
}: CreateLunchpadOrderParams): Promise<any> => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/create`, {
        ticker,
        kasPerUnit,
        tokenPerUnit,
        maxFeeRatePerTransaction,
        minUnitsPerOrder,
        maxUnitsPerOrder,
    });
    return response.data;
};

export const startLunchpad = async (id: string) => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${id}/start`);
    return response.data;
};

export const stopLunchpad = async (id: string) => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${id}/stop`);
    return response.data;
};

export const retrieveFunds = async (id: string, walletType: LunchpadWalletType) => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${id}/retrieve-funds/${walletType}`);
    return response.data;
};

export const createLunchpadOrderWithId = async (ticker: string, units: number) => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${ticker}/create-order`, {
        units,
    });
    return response.data;
};

export const startVerifyAndProcessOrder = async (orderId: string, transactionId: string) => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${orderId}/verify-process-order`, {
        transactionId,
    });
    return response.data;
};

export const cancelOrder = async (orderId: string) => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${orderId}/cancel-order`);
    return response.data;
};
