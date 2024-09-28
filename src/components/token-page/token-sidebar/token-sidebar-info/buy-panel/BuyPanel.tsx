// BuyPanel.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { BackendTokenResponse, Order } from '../../../../../types/Types';
import OrderList from './order-list/OrderList';
import BuyHeader from './buy-header/BuyHeader';
import OrderDetails from './order-details/OrderDetails';
import { showGlobalSnackbar } from '../../../../alert-context/AlertContext';
import { sendKaspa, USER_REJECTED_TRANSACTION_ERROR_CODE } from '../../../../../utils/KaswareUtils';
import { startBuyOrder, confirmBuyOrder, releaseBuyLock } from '../../../../../DAL/BackendP2PDAL';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material'; // Import CircularProgress for the spinner
import { useFetchOrders } from '../../../../../DAL/UseQueriesBackend';
import { GlobalStyle } from '../../../../../utils/GlobalStyleScrollBar';

interface BuyPanelProps {
    tokenInfo: BackendTokenResponse;
    kasPrice: number;
    walletBalance: number;
    walletConnected: boolean;
    walletAddress: string | null;
}

const KASPA_TO_SOMPI = 100000000;

const BuyPanel: React.FC<BuyPanelProps> = (props) => {
    const { tokenInfo, walletBalance, walletConnected, kasPrice, walletAddress } = props;
    const [sortBy, setSortBy] = useState('pricePerToken');
    const [sortOrder] = useState<'asc' | 'desc'>('asc');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [timeLeft, setTimeLeft] = useState(240); // 235 seconds = 3 minutes and 55 seconds
    const [tempWalletAddress, setTempWalletAddress] = useState('');
    const [isProcessingBuyOrder, setIsProcessingBuyOrder] = useState(false);
    const [waitingForWalletConfirmation, setWaitingForWalletConfirmation] = useState(false);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFetchOrders(tokenInfo, sortBy, sortOrder);

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
        const handleTimeout = () => {
            showGlobalSnackbar({
                message: 'Purchase canceled due to timeout.',
                severity: 'info',
            });
            handleDrawerClose(selectedOrder.orderId); // Close the OrderDetails panel
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
                return;
            }
            setTempWalletAddress(temporaryWalletAddress);
            setSelectedOrder(order);
            setIsPanelOpen(true);
        } catch (error) {
            console.error(error);
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
        const { confirmed, commitTransactionId, revealTransactionId } = await confirmBuyOrder(
            order.orderId,
            paymentTxnId,
        );
        if (confirmed) {
            showGlobalSnackbar({
                message: 'Purchase successful!',
                severity: 'success',
                reveal: revealTransactionId,
                commit: commitTransactionId,
            });
            setIsProcessingBuyOrder(false);
            setIsPanelOpen(false);
            setSelectedOrder(null);
        } else {
            showGlobalSnackbar({
                message: 'Purchase failed!',
                severity: 'error',
            });
        }
    };

    // Handler to close the drawer
    const handleDrawerClose = async (orderId: string) => {
        await releaseBuyLock(orderId);
        setIsPanelOpen(false);
        setSelectedOrder(null);
    };
    return (
        <>
            <GlobalStyle />
            <Box sx={{ width: '100%' }}>
                <BuyHeader sortBy={sortBy} onSortChange={handleSortChange} />
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
                        endMessage={<p style={{ textAlign: 'center' }}>No more orders to load.</p>}
                    >
                        <OrderList
                            selectedOrder={selectedOrder}
                            walletConnected={walletConnected}
                            walletBalance={walletBalance}
                            kasPrice={kasPrice}
                            orders={orders}
                            onOrderSelect={handleOrderSelect}
                            floorPrice={tokenInfo.price}
                        />
                    </InfiniteScroll>
                </div>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: isPanelOpen ? 0 : '-100%',
                        height: '45%',
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
