import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchAllTokens } from './BackendDAL';

export const useFetchAllTokens = (
    limit = 50,
    skip = 0,
    order: string | null = null,
    direction: string | null = null,
) =>
    useQuery({
        queryKey: ['tokens', limit, skip, order, direction],
        queryFn: () => fetchAllTokens(limit, skip, order, direction),
        placeholderData: keepPreviousData, // Keeps previous data while fetching new data
        staleTime: 25000, // Data stays fresh for 25 seconds
        retry: 2, // Retry 2 times on failure
    });
