import { UseMutationResult, useQuery } from '@tanstack/react-query';
import {
    ClientSideLunchpadListWithStatus,
    ClientSideLunchpadOrderWithStatus,
    ClientSideLunchpadWithStatus,
    CreateLunchpadOrderParams,
    GetLunchpadListParams,
    LunchpadStatus,
    LunchpadWalletType,
    Pagination,
    Sort,
    SortDirection,
} from '../types/Types';
import {
    cancelOrder,
    createLaunchpadOrderWithId,
    estimateKasRequirement,
    getLaunchpad,
    getLaunchpadForOwner,
    getLaunchpads,
    isWhitelisted,
    retrieveFunds,
    startLaunchpad,
    startVerifyAndProcessOrder,
    stopLaunchpad,
    updateLaunchpad,
} from './BackendLunchpadDAL';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showGlobalSnackbar } from '../components/alert-context/AlertContext';
import { handleLaunchpadError } from '../utils/ErrorHandling';

export const useGetOwnerLaunchpads = (
    walletAddress: string,
    filters: GetLunchpadListParams['filters'] = { ownerOnly: true },
    pagination: Pagination = { limit: 20, offset: 0 },
    sort: Sort = { direction: SortDirection.DESC },
) =>
    useQuery({
        queryKey: ['OwnerLaunchpads', walletAddress, filters, pagination, sort],
        queryFn: () => getLaunchpads(filters, pagination, sort),
        // You can add more options here, such as:
        // refetchInterval: 5000, // Refetch every 5 seconds
        staleTime: 70000, // Consider data fresh for 1 minute
    });

export const useLaunchpadOwnerInfo = (ticker: string, walletAddress: string, expanded = false) =>
    useQuery({
        queryKey: ['launchpadOwnerInfo', ticker, walletAddress],
        queryFn: () => getLaunchpadForOwner(ticker),
        // Only run the query if ticker is provided
        enabled: !!ticker && expanded,
        // You can add more options here, such as:
        staleTime: 60000, // Consider data fresh for 1 minute
        refetchInterval: 300000, // Refetch every 5 minutes
    });

export const useLaunchpad = (ticker: string) =>
    useQuery({
        queryKey: ['launchpad', ticker],
        queryFn: () => getLaunchpad(ticker),
        // Only run the query if ticker is provided
        enabled: !!ticker,
        // You can add more options here, such as:
        staleTime: 15000, // Consider data fresh for 1 minute
        refetchInterval: 10000, // Refetch every 5 minutes
    });

// launchpadMutations.ts

export const useStartLaunchpad = (
    ticker: string,
    walletAddress: string,
): UseMutationResult<ClientSideLunchpadWithStatus, Error, string, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: startLaunchpad,
        onSuccess: (data) => {
            if (data.success) {
                showGlobalSnackbar({ message: 'Launchpad started successfully', severity: 'success' });
                queryClient.invalidateQueries({ queryKey: ['launchpadOwnerInfo', ticker] });
                queryClient.invalidateQueries({ queryKey: ['launchpads'] });
                queryClient.invalidateQueries({ queryKey: ['OwnerLaunchpads', walletAddress] });
            } else {
                handleLaunchpadError({ response: { data } });
            }
        },
        onError: handleLaunchpadError,
    });
};

export const useStopLaunchpad = (
    ticker: string,
    walletAddress: string,
): UseMutationResult<ClientSideLunchpadWithStatus, Error, string, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: stopLaunchpad,
        onSuccess: (data) => {
            if (data.success) {
                showGlobalSnackbar({ message: 'Launchpad stopped successfully', severity: 'success' });
                queryClient.invalidateQueries({ queryKey: ['launchpadOwnerInfo', ticker] });
                queryClient.invalidateQueries({ queryKey: ['launchpads'] });
                queryClient.invalidateQueries({ queryKey: ['OwnerLaunchpads', walletAddress] });
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

export const useCreateLaunchpadOrder = (
    ticker: string,
): UseMutationResult<ClientSideLunchpadOrderWithStatus, Error, number, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (units: number) => createLaunchpadOrderWithId(ticker, units),
        onSuccess: (data) => {
            if (data.success) {
                showGlobalSnackbar({ message: 'Launchpad order created successfully', severity: 'success' });
                queryClient.invalidateQueries({ queryKey: ['launchpad', ticker] });
            } else {
                handleLaunchpadError({ response: { data } });
            }
        },
        onError: handleLaunchpadError,
    });
};

export const useVerifyAndProcessOrder = (
    ticker: string,
): UseMutationResult<ClientSideLunchpadWithStatus, Error, { orderId: string; transactionId: string }, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, transactionId }) => startVerifyAndProcessOrder(orderId, transactionId),
        onSuccess: (data) => {
            if (data.success) {
                showGlobalSnackbar({ message: 'Order verified and processed successfully', severity: 'success' });
                // You might want to invalidate relevant queries here
                queryClient.invalidateQueries({ queryKey: ['launchpad', ticker] });
            } else {
                handleLaunchpadError({ response: { data } });
            }
        },
        onError: handleLaunchpadError,
    });
};

export const useCancelOrder = (
    ticker,
): UseMutationResult<ClientSideLunchpadWithStatus, Error, string, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelOrder,
        onSuccess: (data) => {
            if (data.success) {
                showGlobalSnackbar({ message: 'Order cancelled successfully', severity: 'success' });
                // You might want to invalidate relevant queries here
                queryClient.invalidateQueries({ queryKey: ['launchpad', ticker] });
            } else {
                handleLaunchpadError({ response: { data } });
            }
        },
        onError: handleLaunchpadError,
    });
};

export const useGetLaunchpads = (
    filters: GetLunchpadListParams['filters'] = { statuses: [LunchpadStatus.ACTIVE] },
    pagination: Pagination = { limit: 20, offset: 0 },
    sort: Sort = { direction: SortDirection.DESC },
) =>
    useQuery<ClientSideLunchpadListWithStatus>({
        queryKey: ['launchpads', filters, pagination, sort],
        queryFn: () => getLaunchpads(filters, pagination, sort),
        // Additional options can be added here
        staleTime: 60000, // Data is considered fresh for 1 minute
        refetchOnWindowFocus: false, // Avoid refetching on window focus
    });

export const useUpdateLaunchpad = (
    id: string,
    ticker,
): UseMutationResult<ClientSideLunchpadWithStatus, Error, Omit<CreateLunchpadOrderParams, 'ticker'>, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params) => updateLaunchpad(id, params),
        onSuccess: (data) => {
            if (data.success) {
                showGlobalSnackbar({ message: 'Launchpad updated successfully', severity: 'success' });
                queryClient.invalidateQueries({ queryKey: ['launchpadOwnerInfo', ticker] }); // Invalidate the launchpad query
            } else {
                handleLaunchpadError({ response: { data } });
            }
        },
        onError: handleLaunchpadError,
    });
};

export const useEstimateKasRequirement = (id: string) =>
    useQuery({
        queryKey: ['estimateKasRequirement', id],
        queryFn: () => estimateKasRequirement(id),
        enabled: !!id, // Only run the query if id is provided
        staleTime: 60000, // Data is considered fresh for 1 minute
        refetchOnWindowFocus: false, // Avoid refetching on window focus
    });
export const useIsWhitelisted = (ticker: string, walletConnected: boolean) =>
    useQuery({
        queryKey: ['isWhitelisted', ticker],
        queryFn: () => isWhitelisted(ticker),
        enabled: !!ticker && walletConnected, // Run the query only if ticker is provided and wallet is connected
        staleTime: 60000, // Data is considered fresh for 1 minute
        refetchOnWindowFocus: false, // Avoid refetching on window focus
    });
