import { Box, List, Table, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useState } from 'react';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { PrevPageButton, NextPageButton } from '../../krc-20-page/grid-title-sort/GridTitle.s';
import { StyledPortfolioGridContainer } from './PortfolioOrdersGrid.s';
import UserOrdersRow from './user-orders-row/UserOrdersRow';
import {
    confirmDelistOrder,
    relistSellOrder,
    removeFromMarketplace,
    updateSellOrder,
} from '../../../DAL/BackendP2PDAL';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { sendKaspa } from '../../../utils/KaswareUtils';
import { useQueryClient } from '@tanstack/react-query';
import { useUserListings } from '../../../DAL/UseQueriesBackend';
import { Order, SellOrderStatus } from '../../../types/Types';

interface PortfolioOrdersGridProps {
    kasPrice: number;
    walletConnected: boolean;
    walletAddress: string | null;
}

enum GridHeaders {
    TICKER = 'TICKER',
    QUANTITY = 'QUANTITY',
    DATE = 'CREATED DATE',
    PRICE_PER_TOKEN = 'PRICE PER TOKEN',
    TOTAL_PRICE = 'TOTAL PRICE',
    ACTION = 'ACTION',
}
const KASPA_TO_SOMPI = 100000000;
const LIMIT = 10;
const PortfolioOrdersGrid: FC<PortfolioOrdersGridProps> = (props) => {
    const { kasPrice, walletConnected, walletAddress } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [cancelOrderWaitingPayment, setCancelOrderWaitingPayment] = useState<boolean>(false);
    const [cancelOrderWaitingConfirmation, setCancelOrderWaitingConfirmation] = useState<boolean>(false);
    const [loadingOrderId, setLoadingOrderId] = useState<string | null>('');
    const offset = (currentPage - 1) * LIMIT;
    const queryClient = useQueryClient();

    const { data, isLoading } = useUserListings(walletAddress, offset);

    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / LIMIT);
    const orders = data?.listings || [];
    const handlePrevPage = () => setCurrentPage(currentPage - 1);
    const handleNextPage = () => setCurrentPage(currentPage + 1);

    // Calculate total number of pages

    const disableNext = () => currentPage >= totalPages;
    const handleDelist = async (orderId: string) => {
        try {
            const response = await removeFromMarketplace(orderId, walletAddress);
            if (!response.success) {
                showGlobalSnackbar({
                    message: 'Failed to remove order from marketplace',
                    severity: 'error',
                });
                return;
            }
            queryClient.setQueryData(
                ['userListings', walletAddress, offset],
                (oldData: { orders: Order[] } | undefined) => {
                    if (!oldData) return oldData;

                    const newOrders = oldData.orders.map((order) => {
                        if (order.orderId === orderId) {
                            return { ...order, status: SellOrderStatus.OFF_MARKETPLACE };
                        }
                        return order;
                    });

                    return { ...oldData, orders: newOrders };
                },
            );
            showGlobalSnackbar({
                message: 'Order removed from marketplace',
                severity: 'success',
            });
        } catch (error) {
            queryClient.invalidateQueries({ queryKey: ['userListings', walletAddress, offset] });
            console.error('Error in handleDelist:', error); // Log the error for debugging
            showGlobalSnackbar({
                message: 'Failed to remove order from marketplace',
                severity: 'error',
            });
        }
    };

    const handleRelist = async (orderId: string) => {
        try {
            const response = await relistSellOrder(orderId, walletAddress);
            queryClient.setQueryData(
                ['userListings', walletAddress, offset],
                (oldData: { orders: Order[] } | undefined) => {
                    if (!oldData) return oldData;

                    const newOrders = oldData.orders.map((order) => {
                        if (order.orderId === orderId) {
                            return { ...order, status: SellOrderStatus.LISTED_FOR_SALE };
                        }
                        return order;
                    });

                    return { ...oldData, orders: newOrders };
                },
            );
            if (response.status === 201) {
                showGlobalSnackbar({
                    message: 'Order relisted successfully',
                    severity: 'success',
                });
            }
        } catch (error) {
            console.error('Error in handleRelist:', error); // Log the error for debugging
            showGlobalSnackbar({
                message: 'Error relisting order: Please try again later',
                severity: 'error',
            });
            queryClient.invalidateQueries({ queryKey: ['userListings', walletAddress] });
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        const { needMoney, temporaryWalletAddress, confirmed } = await confirmDelistOrder(orderId, walletAddress);
        if (needMoney === true) {
            try {
                setCancelOrderWaitingPayment(true);
                const txData = await sendKaspa(temporaryWalletAddress, 5 * KASPA_TO_SOMPI);

                if (txData) {
                    setCancelOrderWaitingPayment(false);
                    setCancelOrderWaitingConfirmation(true);
                    const parsedTxData = JSON.parse(txData);
                    const txId = parsedTxData.id;
                    const { confirmed } = await confirmDelistOrder(orderId, walletAddress, txId);
                    if (confirmed) {
                        showGlobalSnackbar({
                            message: 'Order removed from marketplace, tokens returned to your wallet',
                            severity: 'success',
                        });
                        queryClient.invalidateQueries({ queryKey: ['userListings', walletAddress] });
                    }
                } else {
                    showGlobalSnackbar({
                        message: 'Error sending Kas for Fees to remove tokens, please try again',
                        severity: 'success',
                    });
                    setLoadingOrderId(null);
                    setCancelOrderWaitingPayment(false);
                    setCancelOrderWaitingConfirmation(false);
                }
            } catch (error) {
                if (error.code === 4001) {
                    showGlobalSnackbar({
                        message: 'Transaction rejected by user',
                        severity: 'error',
                    });
                    setLoadingOrderId(null);
                    setCancelOrderWaitingPayment(false);
                    setCancelOrderWaitingConfirmation(false);
                } else {
                    showGlobalSnackbar({
                        message: 'Error removing order from marketplace, please try again',
                        severity: 'error',
                    });
                    setLoadingOrderId(null);
                    setCancelOrderWaitingPayment(false);
                    setCancelOrderWaitingConfirmation(false);
                }
            }
        } else if (confirmed === true) {
            showGlobalSnackbar({
                message: 'Order removed from marketplace, tokens returned to your wallet',
                severity: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['userListings', walletAddress] });
            setLoadingOrderId(null);
            setCancelOrderWaitingPayment(false);
            setCancelOrderWaitingConfirmation(false);
        } else {
            showGlobalSnackbar({
                message: 'Error removing order from marketplace, please try again',
                severity: 'error',
            });
        }
    };

    const handleEditOrder = async (orderId: string, pricePerToken: number, totalPrice: number) => {
        try {
            const response = await updateSellOrder(orderId, walletAddress, pricePerToken, totalPrice);

            if (response.status === 201) {
                showGlobalSnackbar({
                    message: 'Order Edited Successfully',
                    severity: 'success',
                });
                return true;
            }
        } catch (error) {
            console.error('Error in handleEditOrder:', error); // Log the error for debugging
            showGlobalSnackbar({
                message: 'Error Editing Order: Please try again later',
                severity: 'error',
            });
            return false;
        }
    };

    const tableHeader = (
        <Box
            sx={{
                height: '8vh',
                alignContent: 'center',
                display: 'flex',
                borderBottom: '0.1px solid rgba(111, 199, 186, 0.3)',
            }}
        >
            <Table style={{ width: '100%' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '12%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.TICKER}
                        </TableCell>
                        <TableCell sx={{ width: '17%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.DATE}
                        </TableCell>
                        <TableCell sx={{ width: '13%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            <Tooltip title="Quantity of tokens">
                                <span>{GridHeaders.QUANTITY}</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell sx={{ width: '15%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.PRICE_PER_TOKEN}
                        </TableCell>
                        <TableCell sx={{ width: '16%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.TOTAL_PRICE}
                        </TableCell>
                        <TableCell sx={{ width: '14%', borderBottom: 0, fontSize: '0.8rem', fontWeight: 600 }}>
                            {GridHeaders.ACTION}
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: '2vw' }}>
                <PrevPageButton onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </PrevPageButton>
                <NextPageButton onClick={handleNextPage} disabled={disableNext()}>
                    Next
                </NextPageButton>
            </Box>
        </Box>
    );

    return (
        <StyledPortfolioGridContainer>
            <GlobalStyle />
            {tableHeader}
            {!walletConnected ? (
                <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '10vh' }}>
                    <b>Please connect your wallet to view your orders.</b>
                </p>
            ) : (
                <List
                    dense
                    sx={{
                        width: '100%',
                        overflowX: 'hidden',
                    }}
                >
                    {!isLoading
                        ? orders.map((order) => (
                              <UserOrdersRow
                                  walletAddress={walletAddress}
                                  offset={offset}
                                  cancelOrderWaitingPayment={cancelOrderWaitingPayment}
                                  cancelOrderWaitingConfirmation={cancelOrderWaitingConfirmation}
                                  setCancelOrderWaitingConfirmation={setCancelOrderWaitingConfirmation}
                                  handleCancelOrder={handleCancelOrder}
                                  handleEditOrder={handleEditOrder}
                                  handleRelist={handleRelist}
                                  handleDelist={handleDelist}
                                  key={order.orderId}
                                  order={order}
                                  walletConnected={walletConnected}
                                  kasPrice={kasPrice}
                                  loadingOrderId={loadingOrderId}
                                  setLoadingOrderId={setLoadingOrderId}
                              />
                          ))
                        : // Replace single Skeleton with multiple Skeletons
                          [...Array(5)].map((_, index) => <Skeleton key={index} width={'100%'} height={'12vh'} />)}
                </List>
            )}
            {orders.length === 0 && walletConnected && !isLoading && (
                <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                    <b>End of list</b>
                </p>
            )}
        </StyledPortfolioGridContainer>
    );
};

export default PortfolioOrdersGrid;
