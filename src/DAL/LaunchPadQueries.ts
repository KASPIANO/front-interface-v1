import { UseMutationResult, useQuery } from '@tanstack/react-query';
import {
    ClientSideLunchpadWithStatus,
    GetLunchpadListParams,
    LunchpadWalletType,
    Pagination,
    Sort,
    SortDirection,
} from '../types/Types';
import {
    getLaunchpadForOwner,
    getLaunchpads,
    retrieveFunds,
    startLaunchpad,
    stopLaunchpad,
} from './BackendLunchpadDAL';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showGlobalSnackbar } from '../components/alert-context/AlertContext';
import { handleLaunchpadError } from '../utils/ErrorHandling';

export const useGetOwnerLaunchpads = (
    filters: GetLunchpadListParams['filters'] = { ownerOnly: true },
    pagination: Pagination = { limit: 20, offset: 0 },
    sort: Sort = { direction: SortDirection.DESC },
) =>
    useQuery({
        queryKey: ['launchpads', filters, pagination, sort],
        queryFn: () => getLaunchpads(filters, pagination, sort),
        // You can add more options here, such as:
        // refetchInterval: 5000, // Refetch every 5 seconds
        staleTime: 70000, // Consider data fresh for 1 minute
    });

export const useLaunchpadOwnerInfo = (ticker: string) =>
    useQuery({
        queryKey: ['launchpadOwnerInfo', ticker],
        queryFn: () => getLaunchpadForOwner(ticker),
        // Only run the query if ticker is provided
        enabled: !!ticker,
        // You can add more options here, such as:
        staleTime: 60000, // Consider data fresh for 1 minute
        refetchInterval: 300000, // Refetch every 5 minutes
    });

// launchpadMutations.ts

export const useStartLaunchpad = (
    ticker: string,
): UseMutationResult<ClientSideLunchpadWithStatus, Error, string, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: startLaunchpad,
        onSuccess: (data) => {
            if (data.success) {
                showGlobalSnackbar({ message: 'Launchpad started successfully', severity: 'success' });
                queryClient.invalidateQueries({ queryKey: ['launchpadOwnerInfo', ticker] });
            } else {
                handleLaunchpadError({ response: { data } });
            }
        },
        onError: handleLaunchpadError,
    });
};

export const useStopLaunchpad = (
    ticker: string,
): UseMutationResult<ClientSideLunchpadWithStatus, Error, string, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: stopLaunchpad,
        onSuccess: (data) => {
            if (data.success) {
                showGlobalSnackbar({ message: 'Launchpad stopped successfully', severity: 'success' });
                queryClient.invalidateQueries({ queryKey: ['launchpadOwnerInfo', ticker] });
            } else {
                handleLaunchpadError({ response: { data } });
            }
        },
        onError: handleLaunchpadError,
    });
};

interface RetrieveFundsParams {
    id: string;
    walletType: LunchpadWalletType;
}

export const useRetrieveFunds = (
    ticker: string,
): UseMutationResult<ClientSideLunchpadWithStatus, Error, RetrieveFundsParams, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, walletType }: RetrieveFundsParams) => retrieveFunds(id, walletType),
        onSuccess: (data) => {
            if (data.success) {
                showGlobalSnackbar({ message: 'Funds retrieved successfully', severity: 'success' });
                queryClient.invalidateQueries({ queryKey: ['launchpadOwnerInfo', ticker] });
            } else {
                handleLaunchpadError({ response: { data } });
            }
        },
        onError: handleLaunchpadError,
    });
};
