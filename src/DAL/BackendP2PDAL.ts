import { DecentralizedOrder, MixedOrder, Order, SortPaginationParams, UserOrdersParams } from '../types/Types';
import { backendService } from './AxiosInstaces';

const P2PCONTROLLER = 'p2p';
const P2PV2CONTROLLER = 'p2p-v2';

export const createSellOrder = async (
    ticker: string,
    quantity: number,
    totalPrice: number,
    pricePerToken: number,
    walletAddress: string,
): Promise<{ id: string; temporaryWalletAddress: string; status: string }> => {
    const capitalTicker = ticker.toUpperCase();
    const response = await backendService.post<{ temporaryWalletAddress: string; id: string; status: string }>(
        `/${P2PCONTROLLER}/sell`,
        {
            ticker: capitalTicker,
            quantity,
            totalPrice,
            pricePerToken,
            walletAddress,
        },
    );
    return response.data;
};

export const startBuyOrder = async (
    orderId,
    walletAddress: string,
): Promise<{ id: string; temporaryWalletAddress: string; status: string; success: boolean }> => {
    const response = await backendService.post<{
        temporaryWalletAddress: string;
        id: string;
        status: string;
        success: boolean;
    }>(`/${P2PCONTROLLER}/buy/${orderId}`, {
        walletAddress,
    });
    return response.data;
};

export const confirmSellOrder = async (
    orderId: string,
): Promise<{
    confirmed: boolean;
}> => {
    try {
        const response = await backendService.get<{ confirmed: boolean }>(
            `/${P2PCONTROLLER}/confirmSellOrder/${orderId}`,
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error confirming sell order ${orderId}:`,
            error.response ? error.response.data : error.message,
        );
        return { confirmed: false }; // Return empty array in case of an error
    }
};

export const confirmBuyOrder = async (
    orderId: string,
    transactionId: string,
): Promise<{
    confirmed: boolean;
    transactions: {
        commitTransactionId: string;
        revealTransactionId: string;
        sellerTransactionId: string;
        buyerTransactionId: string;
    };
    priorityFeeTooHigh?: boolean;
}> => {
    const response = await backendService.post<{
        confirmed: boolean;
        transactions: {
            commitTransactionId: string;
            revealTransactionId: string;
            sellerTransactionId: string;
            buyerTransactionId: string;
        };
        priorityFeeTooHigh?: boolean;
    }>(`/${P2PCONTROLLER}/confirmBuyOrder/${orderId}`, {
        transactionId,
    });
    return response.data;
};

// export const getOrders = async (
//     ticker: string,
//     offset?: number,
//     limit?: number,
//     sort?: { field: string; direction: string },
// ): Promise<{ orders: Order[]; totalCount: number }> => {
//     try {
//         const capitalTicker = ticker.toUpperCase();
//         const response = await backendService.post<any>(
//             `/${P2PCONTROLLER}/getSellOrders?ticker=${capitalTicker}`,
//             {
//                 pagination: {
//                     offset,
//                     limit,
//                 },
//                 sort,
//             },
//         );
//         return response.data;
//     } catch (error) {
//         console.error(
//             `Error getting sell orders for ${ticker}:`,
//             error.response ? error.response.data : error.message,
//         );
//         return { orders: [], totalCount: 0 }; // Return empty array in case of an error
//     }
// };

// export const getUSerListings = async (
//     walletAddress: string,
//     offset = 0,
//     limit = 15,
//     sort?: { field: string; direction: string },
// ): Promise<{ orders: Order[]; totalCount: number }> => {
//     const response = await backendService.post<any>(`/${P2PCONTROLLER}/getUserListings`, {
//         walletAddress,
//         pagination: {
//             offset,
//             limit,
//         },
//         sort,
//     });
//     return response.data;
// };

export const relistSellOrder = async (orderId: string, walletAddress: string): Promise<any> => {
    const response = await backendService.post<any>(
        `/${P2PCONTROLLER}/relistSellOrder/${orderId}`,

        {
            walletAddress,
        },
    );
    return response;
};
export const updateSellOrder = async (
    orderId: string,
    walletAddress: string,
    pricePerToken: number,
    totalPrice: number,
): Promise<any> => {
    const response = await backendService.post<any>(
        `/${P2PCONTROLLER}/updateSellOrder/${orderId}`,

        {
            pricePerToken,
            totalPrice,
            walletAddress,
        },
    );
    return response;
};
export const removeFromMarketplace = async (orderId: string, walletAddress: string): Promise<any> => {
    try {
        const response = await backendService.post<any>(
            `/${P2PCONTROLLER}/removeFromMarketplace/${orderId}`,

            {
                walletAddress,
            },
        );
        return response.data;
    } catch (error) {
        console.error(`Error deleting order ${orderId}:`, error.response ? error.response.data : error.message);
        return { confirmed: false }; // Return empty array in case of an error
    }
};
export const releaseBuyLock = async (orderId: string): Promise<any> => {
    try {
        const response = await backendService.post<any>(`/${P2PCONTROLLER}/releaseBuyLock/${orderId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting order ${orderId}:`, error.response ? error.response.data : error.message);
        return { confirmed: false }; // Return empty array in case of an error
    }
};

export const confirmDelistOrder = async (
    orderId: string,
    walletAddress: string,
    transactionId?: string,
): Promise<{ needMoney: boolean; temporaryWalletAddress: string; confirmed: boolean; transactions: any }> => {
    const response = await backendService.post<any>(
        `/${P2PCONTROLLER}/confirmDelistOrder/${orderId}`,

        {
            transactionId,
            walletAddress,
        },
    );
    return response.data;
};

// export const getOrdersHistory = async (
//     sort?: { field?: string; direction?: 'asc' | 'desc' }, // Sort object
//     pagination?: { limit?: number; offset?: number }, // Pagination object
//     filters?: {
//         // Filters object
//         statuses?: string[];
//         tickers?: string[];
//         isSeller?: boolean;
//         isBuyer?: boolean;
//         totalPrice?: { min?: number; max?: number };
//         startDateTimestamp?: number;
//         endDateTimestamp?: number;
//     },
// ): Promise<any> => {
//     const cleanedFilters = cleanFilters(filters);
//     const response = await backendService.post<any>(`/${P2PCONTROLLER}/getOrdersHistory`, {
//         sort: sort || { direction: 'desc' }, // Default sorting direction (DESC)
//         pagination: pagination || { limit: 20, offset: 0 }, // Default pagination (limit of 10)
//         filters: cleanedFilters || {}, // Optional filters
//     });
//     return response.data;
// };

export const createSellOrderV2 = async (
    ticker: string,
    quantity: number,
    totalPrice: number,
    pricePerToken: number,
    psktSeller: string,
    psktTransactionId: string,
): Promise<{ id: string; status: string }> => {
    const capitalTicker = ticker.toUpperCase();
    const response = await backendService.post<{ id: string; status: string }>(`/${P2PV2CONTROLLER}/`, {
        ticker: capitalTicker,
        quantity,
        totalPrice,
        pricePerToken,
        psktSeller,
        psktTransactionId,
    });
    return response.data;
};

export const getDecentralizedOrder = async (orderId): Promise<DecentralizedOrder> => {
    const response = await backendService.get<DecentralizedOrder>(`/${P2PV2CONTROLLER}/${orderId}`);
    return response.data;
};

export const buyDecentralizedOrder = async (orderId, transactionId): Promise<DecentralizedOrder> => {
    const response = await backendService.post<DecentralizedOrder>(`/${P2PV2CONTROLLER}/buy/${orderId}`, {
        transactionId,
    });
    return response.data;
};

export const cancelDecentralizedOrder = async (orderId): Promise<DecentralizedOrder> => {
    const response = await backendService.post<DecentralizedOrder>(`/${P2PV2CONTROLLER}/cancel/${orderId}`);
    return response.data;
};

export const getUserOrders = async (
    params: UserOrdersParams,
): Promise<{ orders: MixedOrder[]; totalCount: number; allTickers: string[] }> => {
    const response = await backendService.post<any>(`/${P2PV2CONTROLLER}/user-orders`, params);
    return response.data;
};

export const getTickerSellOrders = async (
    ticker: string,
    params: SortPaginationParams,
): Promise<{ orders: Order[]; totalCount: number; allTickers: string[] }> => {
    const capitalTicker = ticker.toUpperCase();

    const response = await backendService.post<any>(
        `/${P2PV2CONTROLLER}/sell-orders?ticker=${capitalTicker}`,
        params,
    );
    return response.data;
};
