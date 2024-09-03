import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchAllTokens } from './BackendDAL';

export const useFetchAllTokens = (limit = 50, order: string | null = null, direction: string | null = null) =>
    useInfiniteQuery({
        queryKey: ['tokens', order || 'noOrder', direction || 'noDir'],
        queryFn: (pageParam) => fetchAllTokens(limit, pageParam.pageParam, order, direction),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => lastPageParam + 1 * limit,
        staleTime: 25000, // Data stays fresh for 25 seconds
        retry: 2, // Retry 2 times on failure
    });
