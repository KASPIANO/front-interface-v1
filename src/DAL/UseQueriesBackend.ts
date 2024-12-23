// import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
    fetchAllTokens,
    countTokens,
    fetchTickerTradeStats,
    fetchTickerFloorPrice,
    getHolderChange,
    getCurrentAds,
} from './BackendDAL';
import { useQuery } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getTickerSellOrders, getUserOrders } from './BackendP2PDAL'; // Adjust the
import { SellOrderStatus, SellOrderStatusV2 } from '../types/Types';

export interface UseOrdersHistoryProps {
    walletAddress: string;
    currentPage: number;
    selectedTickers: string[]; // Multi-select filter for tickers
    sort: { field: string; direction: 'asc' | 'desc' };
    filters: {
        startDateTimestamp?: number;
        endDateTimestamp?: number;
        minPrice?: number;
        maxPrice?: number;
        statuses?: string[];
        isSeller?: boolean;
        isBuyer?: boolean;
    };
}
export const useFetchTokens = (
    limit = 50,
    order: string | null = null,
    direction: string | null = null,
    timeInterval: string,
    page: number,
) =>
    useQuery({
        queryKey: ['tokens', order || 'noOrder', direction || 'noDir', timeInterval, page],
        queryFn: () => fetchAllTokens(limit, page * 50, order, direction, timeInterval),
        staleTime: 10000, // Data stays fresh for 25 seconds
        retry: 2, // Retry 2 times on failure
        refetchOnWindowFocus: false,
    });

export const useFetchCountTokensQuery = () =>
    useQuery({
        queryKey: ['countTokens'], // Query key to uniquely identify this query
        queryFn: countTokens, // Function to fetch data
        staleTime: Infinity, // Data won't be refetched until explicitly invalidated
        gcTime: Infinity, // Data remains cached indefinitely
    });

const LIMIT = 10; // Define the limit for each page of results

export const useFetchOrders = (tokenInfo, sortBy, sortOrder) =>
    useInfiniteQuery({
        queryKey: ['orders', tokenInfo.ticker, sortBy, sortOrder],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await getTickerSellOrders(tokenInfo.ticker, {
                pagination: {
                    limit: LIMIT,
                    offset: pageParam,
                },
                sort: {
                    field: sortBy,
                    direction: sortOrder,
                },
            });
            return {
                orders: response.orders || [],
                nextOffset: pageParam + LIMIT,
                hasMore: response.totalCount > pageParam + LIMIT,
                totalCount: response.totalCount, // You can also return the totalCount if needed elsewhere
            };
        },
        getNextPageParam: (lastPage) =>
            // Return undefined if there are no more orders to fetch
            lastPage.hasMore ? lastPage.nextOffset : undefined,
        initialPageParam: 0, // Add this line
        staleTime: 3000,
        retry: 2,
        refetchOnWindowFocus: false,
    });

export const useOrdersHistory = ({
    walletAddress,
    currentPage,
    selectedTickers,
    sort,
    filters,
}: UseOrdersHistoryProps) => {
    const limit = 30; // Limit per page

    return useQuery({
        queryKey: ['ordersHistory', walletAddress, currentPage, selectedTickers, sort, filters],
        queryFn: () =>
            getUserOrders({
                sort,
                pagination: {
                    limit,
                    offset: (currentPage - 1) * limit,
                },
                filters: {
                    tickers: selectedTickers.length > 0 ? selectedTickers : undefined, // Filter by selected tickers
                    totalPrice:
                        filters.minPrice || filters.maxPrice
                            ? { min: filters.minPrice, max: filters.maxPrice }
                            : undefined,
                    statuses: (filters.statuses as (SellOrderStatus | SellOrderStatusV2)[]) || undefined,
                    startDateTimestamp: filters.startDateTimestamp,
                    endDateTimestamp: filters.endDateTimestamp,
                    isSeller: filters.isSeller,
                    isBuyer: filters.isBuyer,
                },
            }),
        enabled: !!walletAddress, // Only fetch if wallet address exists
        select: (data) => ({
            orders: data.orders,
            totalCount: data.totalCount,
            allTickers: data.allTickers, // Add the list of all tickers from the response
        }),
    });
};

export const useUserListings = (walletAddress, offset = 0) =>
    useQuery({
        queryKey: ['userListings', walletAddress, offset],
        queryFn: () =>
            getUserOrders({
                pagination: {
                    limit: LIMIT,
                    offset,
                },
                filters: {
                    isSeller: true,
                    isBuyer: false,
                    statuses: [
                        SellOrderStatus.LISTED_FOR_SALE,
                        SellOrderStatus.OFF_MARKETPLACE,
                        SellOrderStatusV2.PSKT_VERIFICATION_ERROR,
                    ],
                },
            }),

        enabled: !!walletAddress,
        select: (data) => ({
            listings: data.orders,
            totalCount: data.totalCount,
        }),
    });

export const useFetchHolderChange = (ticker: string, timeInterval: string) =>
    useQuery({
        queryKey: ['holder_change', ticker, timeInterval],
        queryFn: () => getHolderChange(ticker, timeInterval),
        staleTime: 20000, // Data stays fresh for 25 seconds
        refetchOnWindowFocus: false,
    });
export const useFetchFloorPrice = (ticker: string) =>
    useQuery({
        queryKey: ['floor_price', ticker],
        queryFn: () => fetchTickerFloorPrice(ticker),
        staleTime: 20000, // Data stays fresh for 25 seconds
        refetchOnWindowFocus: false,
        enabled: !!ticker,
    });

export const useFetchTradeStats = (ticker: string, timeInterval: string) =>
    useQuery({
        queryKey: ['tarde-stats', ticker, timeInterval],
        queryFn: () => fetchTickerTradeStats(ticker, timeInterval),
        staleTime: 10000, // Data stays fresh for 25 seconds
        refetchOnWindowFocus: false,
    });
export const useGetCurrentAds = (type: string) =>
    useQuery({
        queryKey: ['ads', type],
        queryFn: () => getCurrentAds(type),
        staleTime: Infinity, // Data stays fresh for 25 seconds
        refetchOnWindowFocus: false,
    });
