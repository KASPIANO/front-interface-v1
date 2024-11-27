import {
    GetLunchpadListParams,
    Pagination,
    Sort,
    SortDirection,
    CreateLunchpadOrderParams,
    LunchpadWalletType,
    ClientSideLunchpad,
    ClientSideLunchpadWithStatus,
    ClientSideLunchpadListWithStatus,
    ClientSideLunchpadOrderWithStatus,
} from '../types/Types';
import { backendService } from './AxiosInstaces';

const LUNCHPAD_CONTROLLER = 'lunchpad';

export const getLaunchpad = async (ticker: string): Promise<ClientSideLunchpad> => {
    const upperCaseTicker = ticker.toUpperCase();
    const response = await backendService.get(`/${LUNCHPAD_CONTROLLER}/${upperCaseTicker}`);
    return response.data.lunchpad;
};

export const getLaunchpadForOwner = async (ticker: string): Promise<ClientSideLunchpadWithStatus> => {
    const upperCaseTicker = ticker.toUpperCase();
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${upperCaseTicker}/owner-info`);
    return response.data;
};

export const getLaunchpads = async (
    filters: GetLunchpadListParams['filters'] = {},
    pagination: Pagination = { limit: 20, offset: 0 },
    sort: Sort = { direction: SortDirection.DESC },
): Promise<ClientSideLunchpadListWithStatus> => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/list`, {
        filters,
        pagination,
        sort,
    });
    return response.data;
};
export const getOwnerLaunchpads = async (
    filters: GetLunchpadListParams['filters'] = {},
    pagination: Pagination = { limit: 20, offset: 0 },
    sort: Sort = { direction: SortDirection.DESC },
): Promise<ClientSideLunchpadListWithStatus> => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/list-owner`, {
        filters,
        pagination,
        sort,
    });
    return response.data;
};

// Creates a new lunchpad order

export const createLaunchpad = async (params: CreateLunchpadOrderParams): Promise<ClientSideLunchpad> => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/create`, params);
    return response.data;
};

export const startLaunchpad = async (id: string): Promise<ClientSideLunchpadWithStatus> => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${id}/start`);
    return response.data;
};

export const stopLaunchpad = async (id: string): Promise<ClientSideLunchpadWithStatus> => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${id}/stop`);
    return response.data;
};

export const retrieveFunds = async (
    id: string,
    walletType: LunchpadWalletType,
): Promise<ClientSideLunchpadWithStatus> => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${id}/retrieve-funds/${walletType}`);
    return response.data;
};

export const createLaunchpadOrderWithId = async (
    ticker: string,
    units: number,
): Promise<ClientSideLunchpadOrderWithStatus> => {
    const upperCaseTicker = ticker.toUpperCase();
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${upperCaseTicker}/create-order`, {
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

export const updateLaunchpad = async (
    id: string,
    params: Omit<CreateLunchpadOrderParams, 'ticker'>,
): Promise<ClientSideLunchpadWithStatus> => {
    const response = await backendService.post(`/${LUNCHPAD_CONTROLLER}/${id}/update`, params);
    return response.data;
};

export const estimateKasRequirement = async (id: string): Promise<ClientSideLunchpadWithStatus> => {
    const response = await backendService.get(`/${LUNCHPAD_CONTROLLER}/${id}/estimate-kas`);
    return response.data;
};
export const isWhitelisted = async (ticker: string): Promise<ClientSideLunchpadWithStatus> => {
    const response = await backendService.get(`/${LUNCHPAD_CONTROLLER}/${ticker}/is-whitelisted`);
    return response.data;
};
