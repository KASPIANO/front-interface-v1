// import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { countTokens, fetchAllTokens } from './BackendDAL';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getOrders } from './BackendP2PDAL'; // Adjust the

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
        staleTime: 25000, // Data stays fresh for 25 seconds
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
            const response = await getOrders(tokenInfo.ticker, pageParam, LIMIT, {
                field: sortBy,
                direction: sortOrder,
            });
            return {
                orders: response.orders || [],
                nextOffset: pageParam + LIMIT,
                hasMore: response.totalCount > pageParam + LIMIT,
            };
        },
        getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextOffset : undefined),
        initialPageParam: 0, // Add this line
        staleTime: 25000,
        retry: 2,
        refetchOnWindowFocus: false,
    });
