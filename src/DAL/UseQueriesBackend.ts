/* eslint-disable @typescript-eslint/no-unused-vars */
// import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchAllTokens } from './BackendDAL';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useFetchAllTokens = (limit = 50, order: string | null = null, direction: string | null = null, timeInterval: string) =>
    useInfiniteQuery({
        queryKey: ['tokens', order || 'noOrder', direction || 'noDir'],
        queryFn: (pageParam) => fetchAllTokens(limit, pageParam.pageParam, order, direction, timeInterval),
        initialPageParam: 0,
        getNextPageParam: (_lastPage, _allPages, lastPageParam, _allPageParams) => lastPageParam + 1 * limit,
        staleTime: 25000, // Data stays fresh for 25 seconds
        retry: 2, // Retry 2 times on failure
    });
