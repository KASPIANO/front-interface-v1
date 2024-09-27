import { Order } from '../types/Types';
import { backendService } from './AxiosInstaces';

const P2PCONTROLLER = 'p2p';

export const createSellOrder = async (
    ticker: string,
    quantity: number,
    totalPrice: number,
    pricePerToken: number,
    walletAddress: string,
): Promise<{ id: string; temporaryWalletAddress: string; status: string }> => {
    try {
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
    } catch (error) {
        console.error(
            `Error creating sell order for ${ticker}:`,
            error.response ? error.response.data : error.message,
        );
        return { id: '', temporaryWalletAddress: '', status: '' }; // Return empty array in case of an error
    }
};

export const startBuyOrder = async (
    orderId,
    walletAddress: string,
): Promise<{ id: string; temporaryWalletAddress: string; status: string; success: boolean }> => {
    try {
        const response = await backendService.post<{
            temporaryWalletAddress: string;
            id: string;
            status: string;
            success: boolean;
        }>(`/${P2PCONTROLLER}/buy/${orderId}`, {
            walletAddress,
        });
        return response.data;
    } catch (error) {
        console.error(
            `Error starting buy order for ${walletAddress}:`,
            error.response ? error.response.data : error.message,
        );
        return { id: '', temporaryWalletAddress: '', status: '', success: false }; // Return empty array in case of an error
    }
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
    commitTransactionId: string;
    revealTransactionId: string;
    sellerTransactionId: string;
    buyerTransactionId: string;
}> => {
    try {
        const response = await backendService.post<{
            confirmed: boolean;
            commitTransactionId: string;
            revealTransactionId: string;
            sellerTransactionId: string;
            buyerTransactionId: string;
        }>(`/${P2PCONTROLLER}/confirmBuyOrder/${orderId}`, {
            transactionId,
        });
        return response.data;
    } catch (error) {
        console.error(
            `Error confirming buy order ${orderId}:`,
            error.response ? error.response.data : error.message,
        );
        return {
            confirmed: false,
            commitTransactionId: '',
            revealTransactionId: '',
            sellerTransactionId: '',
            buyerTransactionId: '',
        }; // Return empty array in case of an error
    } // Return empty array in case of an error
};

export const getOrders = async (
    ticker: string,
    offset?: number,
    limit?: number,
    sort?: { field: string; direction: string },
): Promise<{ orders: Order[]; totalCount: number }> => {
    try {
        const capitalTicker = ticker.toUpperCase();
        const response = await backendService.post<any>(
            `/${P2PCONTROLLER}/getSellOrders?ticker=${capitalTicker}`,
            {
                pagination: {
                    offset,
                    limit,
                },
                sort,
            },
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error getting sell orders for ${ticker}:`,
            error.response ? error.response.data : error.message,
        );
        return { orders: [], totalCount: 0 }; // Return empty array in case of an error
    }
};

export const getUSerListings = async (
    walletAdress: string,
    offset = 0,
    limit = 50,
    sort?: { field: string; direction: string },
): Promise<any> => {
    try {
        const response = await backendService.post<any>(`/${P2PCONTROLLER}/getUserListings`, {
            walletAdress,
            pagination: {
                offset,
                limit,
            },
            sort,
        });
        return response.data;
    } catch (error) {
        console.error(`Error getUSerListings`, error.response ? error.response.data : error.message);
        return { confirmed: false }; // Return empty array in case of an error
    }
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
    transactionId: string,
    walletAddress: string,
): Promise<any> => {
    try {
        const response = await backendService.post<any>(
            `/${P2PCONTROLLER}/confirmDelistOrder/${orderId}`,

            {
                transactionId,
                walletAddress,
            },
        );
        return response.data;
    } catch (error) {
        console.error(`Error deleting order ${orderId}:`, error.response ? error.response.data : error.message);
        return { confirmed: false }; // Return empty array in case of an error
    }
};
