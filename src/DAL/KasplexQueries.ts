// src/hooks/usePortfolioActivityQuery.ts

import { useQuery } from '@tanstack/react-query';
import { TokenRowActivityItem } from '../types/Types';
import { fetchWalletActivity } from './Krc20DAL';

interface WalletActivityResponse {
    activityItems: TokenRowActivityItem[];
    next: string | null;
    prev: string | null;
}

/**
 * Hook to fetch paginated portfolio activity for a wallet
 * @param walletAddress The wallet address to fetch activity for
 * @param walletConnected Boolean indicating if the wallet is connected
 */
export const useFetchPortfolioActivity = (
    walletAddress: string | null,
    paginationKey: string | null,
    direction: 'next' | 'prev' | null,
    walletConnected: boolean,
) =>
    useQuery<WalletActivityResponse>({
        queryKey: ['walletActivity', walletAddress, paginationKey, direction],
        queryFn: async () => {
            if (!walletAddress) throw new Error('Wallet address is required');

            // Fetch activity using the paginationKey and direction if they exist
            return fetchWalletActivity(walletAddress, paginationKey, direction);
        },
        enabled: walletConnected && !!walletAddress, // Only run if wallet is connected
        staleTime: 0, // Cache the data for 25 seconds
        retry: 2, // Retry twice on failure
        refetchOnWindowFocus: false, // Disable refetching on window focus
    });
