/* eslint-disable @typescript-eslint/no-unused-vars */
// import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchAllTokens } from './BackendDAL';
import { useQuery } from '@tanstack/react-query';

export const useFetchTokens = (
    limit = 50,
    order: string | null = null,
    direction: string | null = null,
    timeInterval: string,
    page: number,
) =>
    useQuery({
        queryKey: ['tokens', order || 'noOrder', direction || 'noDir', page],
        queryFn: () => fetchAllTokens(limit, page, order, direction, timeInterval),
        staleTime: 25000, // Data stays fresh for 25 seconds
        retry: 2, // Retry 2 times on failure
    });
