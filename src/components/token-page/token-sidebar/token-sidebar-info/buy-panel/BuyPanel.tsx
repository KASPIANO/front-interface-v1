// BuyPanel.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { BackendTokenResponse, DecentralizedOrder, MixedOrder, Order } from '../../../../../types/Types';
import OrderList from './order-list/OrderList';
import BuyHeader from './buy-header/BuyHeader';
import OrderDetails from './order-details/OrderDetails';
import { showGlobalSnackbar } from '../../../../alert-context/AlertContext';
import { buyOrderKRC20, sendKaspa, USER_REJECTED_TRANSACTION_ERROR_CODE } from '../../../../../utils/KaswareUtils';
import {
    startBuyOrder,
    confirmBuyOrder,
    releaseBuyLock,
    getDecentralizedOrder,
    buyDecentralizedOrder,
    cancelDecentralizedOrder,
} from '../../../../../DAL/BackendP2PDAL';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material'; // Import CircularProgress for the spinner
import { useFetchOrders } from '../../../../../DAL/UseQueriesBackend';
import { GlobalStyle } from '../../../../../utils/GlobalStyleScrollBar';
import { useQueryClient } from '@tanstack/react-query';
import { isEmptyString } from '../../../../../utils/Utils';
import { checkOrderExists } from '../../../../../DAL/Krc20DAL';

interface BuyPanelProps {
    tokenInfo: BackendTokenResponse;
    kasPrice: number;
    walletBalance: number;
    walletConnected: boolean;
    walletAddress: string | null;
    setBuyPanelRef: (ref: { handleDrawerClose: () => void }) => void;
}

const KASPA_TO_SOMPI = 100000000;
const KASPIANO_TRADE_COMMISSION = import.meta.env.VITE_TRADE_COMMISSION;
const KASPIANO_WALLET = import.meta.env.VITE_APP_KAS_WALLET_ADDRESS;
const BuyPanel: React.FC<BuyPanelProps> = (props) => {
    const { tokenInfo, walletBalance, walletConnected, kasPrice, walletAddress, setBuyPanelRef } = props;
    const [sortBy, setSortBy] = useState('pricePerToken');
    const [sortOrder] = useState<'asc' | 'desc'>('asc');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<MixedOrder | null>(null);
    const [timeLeft, setTimeLeft] = useState(240);
    const [tempWalletAddress, setTempWalletAddress] = useState('');
    const [psktSeller, setPsktSeller] = useState('');
    const [isProcessingBuyOrder, setIsProcessingBuyOrder] = useState(false);
    const [waitingForWalletConfirmation, setWaitingForWalletConfirmation] = useState(false);
    const queryClient = useQueryClient();
    const kaspianoCommissionInt = parseFloat(KASPIANO_TRADE_COMMISSION);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } = useFetchOrders(
        tokenInfo,
        sortBy,
        sortOrder,
    );

    useEffect(() => {
        if (setBuyPanelRef) {
            setBuyPanelRef({
                handleDrawerClose: () => {
                    if (selectedOrder) {
                        if (!selectedOrder.isDecentralized) {
                            releaseBuyLock(selectedOrder.orderId);
                        }
                        setIsPanelOpen(false);
                        setSelectedOrder(null);
                    }
                },
            });
        }
    }, [selectedOrder, setBuyPanelRef]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (selectedOrder) {
                if (!selectedOrder.isDecentralized) {
                    releaseBuyLock(selectedOrder.orderId);
                }
                setIsPanelOpen(false);
                setSelectedOrder(null);
                event.preventDefault();
            }
        };

        // Add event listener when component mounts
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup event listener when component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [selectedOrder]);

    const orders = data?.pages.flatMap((page) => page.orders) || [];

    const handleSortChange = useCallback((newSortBy: string) => {
        setSortBy(newSortBy);
        // The query will automatically refetch with the new parameters
    }, []);

    const loadMoreOrders = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        if (!selectedOrder) {
            return; // Do nothing if no order is selected
        }
        const handleTimeout = () => {
            showGlobalSnackbar({
                message: 'Purchase canceled due to timeout.',
                severity: 'info',
            });
            handleDrawerClose(selectedOrder.orderId, selectedOrder.isDecentralized); // Close the OrderDetails panel
        };

        // Reset the timer when selectedOrder changes
        setTimeLeft(240);

        const endTime = Date.now() + 240 * 1000; // Calculate the end time

        const timer = setInterval(() => {
            const newTimeLeft = Math.round((endTime - Date.now()) / 1000);

            if (newTimeLeft >= 0) {
                setTimeLeft(newTimeLeft);
            } else {
                // Time is up
                clearInterval(timer);
                handleTimeout();
            }
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, [selectedOrder]);

    const handleOrderSelect = async (order: Order) => {
        try {
            const { temporaryWalletAddress, success } = await startBuyOrder(order.orderId, walletAddress);

            if (!success) {
                showGlobalSnackbar({
                    message: 'Order already taken. Please select another order.',
                    severity: 'error',
                });
                setSelectedOrder(null);
                setIsPanelOpen(false);
                return;
            }
            setTempWalletAddress(temporaryWalletAddress);
            setIsPanelOpen(true);
        } catch (error) {
            console.error(error);
            showGlobalSnackbar({
                message: 'Failed to start the buying process. Please try again later.',
                severity: 'error',
            });
        }
    };

    const handleOrderSelectV2 = async (order: DecentralizedOrder) => {
        try {
            const { psktSeller, sellerWalletAddress, psktTransactionId } = await getDecentralizedOrder(
                order.orderId,
            );
            setPsktSeller(psktSeller);
            const orderDataKasplex = await checkOrderExists(
                tokenInfo.ticker,
                psktTransactionId,
                sellerWalletAddress,
            );
            if (orderDataKasplex.length === 0) {
                showGlobalSnackbar({
                    message: 'Order already taken. Please select another order.',
                    severity: 'error',
                });

                queryClient.setQueryData(
                    ['orders', tokenInfo.ticker],
                    (oldData: { orders: MixedOrder[] } | undefined) => {
                        if (!oldData) return oldData;

                        const newOrders = oldData.orders.filter(
                            (order) => order.orderId !== selectedOrder.orderId,
                        );

                        return { ...oldData, orders: newOrders };
                    },
                );

                setSelectedOrder(null);
                await cancelDecentralizedOrder(order.orderId);
                queryClient.invalidateQueries({ queryKey: ['orders', tokenInfo.ticker] });
                return;
            }
            if (orderDataKasplex[0].amount / 1e8 !== order.quantity) {
                showGlobalSnackbar({
                    message: 'Order not correct. Please select another order.',
                    severity: 'error',
                });
                setSelectedOrder(null);
                return;
            }
            setIsPanelOpen(true);
        } catch (error) {
            console.error(error);
            setSelectedOrder(null);
            setIsPanelOpen(false);
            showGlobalSnackbar({
                message: 'Failed to start the buying process. Please try again later.',
                severity: 'error',
            });
        }
    };

    const handlePurchase = async (order: Order, finalTotal: number) => {
        const sompiAmount = finalTotal * KASPA_TO_SOMPI;
        let paymentTxn = '';
        try {
            setWaitingForWalletConfirmation(true);
            paymentTxn = await sendKaspa(tempWalletAddress, sompiAmount);

            if (isEmptyString(paymentTxn)) {
                throw new Error('paymentTxn is empty');
            }
        } catch (err) {
            console.error(err);
            if (err?.code !== USER_REJECTED_TRANSACTION_ERROR_CODE) {
                showGlobalSnackbar({
                    message:
                        "Payment failed. Please ensure you're using the latest version of the wallet and try to compound your UTXOs before retrying.",
                    severity: 'error',
                });
            }

            setWaitingForWalletConfirmation(false);
            return;
        }
        setWaitingForWalletConfirmation(false);
        setIsProcessingBuyOrder(true);
        const parsedTxData = JSON.parse(paymentTxn);
        const paymentTxnId = parsedTxData.id;
        let confirmed: boolean;
        let transactions: {
            commitTransactionId: string;
            revealTransactionId: string;
            sellerTransactionId: string;
            buyerTransactionId: string;
        } = {
            commitTransactionId: '',
            revealTransactionId: '',
            sellerTransactionId: '',
            buyerTransactionId: '',
        };
        let priorityFeeTooHigh: boolean;

        try {
            ({ confirmed, transactions, priorityFeeTooHigh } = await confirmBuyOrder(order.orderId, paymentTxnId));
        } catch (error) {
            console.error(error);
            confirmed = false;
        }
        const { revealTransactionId, commitTransactionId, buyerTransactionId } = transactions;
        if (confirmed) {
            showGlobalSnackbar({
                message: 'Purchase successful!',
                severity: 'success',
                revealId: revealTransactionId,
                commitId: commitTransactionId,
                txIds: [buyerTransactionId],
            });
            queryClient.invalidateQueries({ queryKey: ['orders', tokenInfo.ticker] });
            setIsProcessingBuyOrder(false);
            setIsPanelOpen(false);
            setSelectedOrder(null);
        } else {
            let errorMessage =
                "Purchase failed in the process. Please wait 10 minutes and contact support if you didn't receive the tokens.";

            if (priorityFeeTooHigh) {
                errorMessage =
                    "The network fee is currently too high, so we can't process your order. Your order will be executed when the fee returns to normal.";
            }
            showGlobalSnackbar({
                message: errorMessage,
                severity: 'error',
            });

            setIsProcessingBuyOrder(false);
            setIsPanelOpen(false);
            setSelectedOrder(null);
        }
    };

    const handlePurchaseV2 = async (order: DecentralizedOrder, finalTotal: number) => {
        let txId;
        if (walletBalance < finalTotal) {
            showGlobalSnackbar({
                message: 'Insufficient balance for this order',
                severity: 'error',
            });
            setSelectedOrder(null);
            setIsPanelOpen(false);
            return;
        }
        try {
            const fee = kaspianoCommissionInt > 0 ? Math.max(order.totalPrice * kaspianoCommissionInt, 0.5) : 0;
            const extraOutput = [{ address: KASPIANO_WALLET, amount: fee }];
            setWaitingForWalletConfirmation(true);
            const finalFee = fee > 0 ? extraOutput : [];

            txId = await buyOrderKRC20(psktSeller, finalFee);
            console.log('txId', txId);

            if (isEmptyString(txId)) {
                throw new Error('paymentTxn is empty');
            }
        } catch (err) {
            console.error(err);
            if (err?.code !== USER_REJECTED_TRANSACTION_ERROR_CODE) {
                showGlobalSnackbar({
                    message:
                        "Payment failed. Please ensure you're using the latest version of the wallet and try to compound your UTXOs before retrying.",
                    severity: 'error',
                });
            }

            setWaitingForWalletConfirmation(false);
            return;
        }

        if (txId) {
            // wihtout await for fast finish
            buyDecentralizedOrder(order.orderId, txId);
            queryClient.setQueryData(
                ['orders', tokenInfo.ticker],
                (oldData: { orders: MixedOrder[] } | undefined) => {
                    if (!oldData) return oldData;

                    const newOrders = oldData.orders.filter((order) => order.orderId !== selectedOrder.orderId);

                    return { ...oldData, orders: newOrders };
                },
            );
        }

        setWaitingForWalletConfirmation(false);

        if (txId) {
            showGlobalSnackbar({
                message: 'Purchase successful!',
                severity: 'success',
                txIds: [txId],
            });
            setIsPanelOpen(false);
            setSelectedOrder(null);
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['orders', tokenInfo.ticker] });
            }, 1300);
        } else {
            const errorMessage =
                "Purchase failed in the process. Please wait 10 minutes and contact support if you didn't receive the tokens.";

            // if (priorityFeeTooHigh) {
            //     errorMessage =
            //         "The network fee is currently too high, so we can't process your order. Your order will be executed when the fee returns to normal.";
            // }
            showGlobalSnackbar({
                message: errorMessage,
                severity: 'error',
            });

            setIsPanelOpen(false);
            setSelectedOrder(null);
        }
    };

    // Handler to close the drawer
    const handleDrawerClose = async (orderId: string, isDecentralized: boolean) => {
        if (!isDecentralized) {
            releaseBuyLock(orderId);
        }

        setIsPanelOpen(false);
        setSelectedOrder(null);
    };

    return (
        <>
            <GlobalStyle />
            <Box sx={{ width: '100%' }}>
                <BuyHeader
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    ticker={tokenInfo.ticker}
                    isLoading={isFetching}
                />
                <div id="scrollableList" style={{ overflow: 'auto', height: '64vh' }}>
                    <InfiniteScroll
                        dataLength={orders.length} // Length of the current data
                        next={loadMoreOrders}
                        hasMore={!!hasNextPage} // Boolean to indicate if there's more data to load
                        loader={
                            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                <CircularProgress />
                            </Box>
                        } // Loading message
                        scrollableTarget="scrollableList"
                        scrollThreshold={0.6}
                        endMessage={
                            isLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <p style={{ textAlign: 'center' }}>No more orders to load</p>
                            )
                        }
                    >
                        <OrderList
                            ticker={tokenInfo.ticker}
                            setSelectedOrder={setSelectedOrder}
                            selectedOrder={selectedOrder}
                            walletConnected={walletConnected}
                            walletBalance={walletBalance}
                            kasPrice={kasPrice}
                            orders={orders}
                            onOrderSelect={handleOrderSelect}
                            onOrderSelectV2={handleOrderSelectV2}
                            floorPrice={tokenInfo.price}
                        />
                    </InfiniteScroll>
                </div>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: isPanelOpen ? 0 : '-100%',
                        height: '50%',
                        width: '100%',
                        backgroundColor: 'background.paper',
                        transition: 'bottom 0.5s ease-in-out',
                        boxShadow: '0px -2px 10px rgba(0,0,0,0.3)',
                        borderRadius: '6px 6px 0 0',
                    }}
                >
                    {selectedOrder && (
                        <OrderDetails
                            isProcessingBuyOrder={isProcessingBuyOrder}
                            waitingForWalletConfirmation={waitingForWalletConfirmation}
                            handlePurchase={handlePurchase}
                            handlePurchaseV2={handlePurchaseV2}
                            order={selectedOrder}
                            kasPrice={kasPrice}
                            walletConnected={walletConnected}
                            walletBalance={walletBalance}
                            onClose={handleDrawerClose}
                            timeLeft={timeLeft}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default BuyPanel;
