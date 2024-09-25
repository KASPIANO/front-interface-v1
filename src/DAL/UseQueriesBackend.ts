// import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { countTokens, fetchAllTokens } from './BackendDAL';

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
