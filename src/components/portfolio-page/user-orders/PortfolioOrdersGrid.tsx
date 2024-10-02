import { Box, List, Table, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { FC, useEffect, useState } from 'react';
import { Order } from '../../../types/Types';
import { GlobalStyle } from '../../../utils/GlobalStyleScrollBar';
import { PrevPageButton, NextPageButton } from '../../krc-20-page/grid-title-sort/GridTitle.s';
import { StyledPortfolioGridContainer } from './PortfolioOrdersGrid.s';
import UserOrdersRow from './user-orders-row/UserOrdersRow';
import {
    confirmDelistOrder,
    getUSerListings,
    relistSellOrder,
    removeFromMarketplace,
    updateSellOrder,
} from '../../../DAL/BackendP2PDAL';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { sendKaspa } from '../../../utils/KaswareUtils';

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
const PortfolioOrdersGrid: FC<PortfolioOrdersGridProps> = (props) => {
    const { kasPrice, walletConnected, walletAddress } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [operationFinished, setOperationFinished] = useState<boolean>(false);
    const [cancelOrderWaitingPayment, setCancelOrderWaitingPayment] = useState<boolean>(false);
    const [cancelOrderWaitingConfirmation, setCancelOrderWaitingConfirmation] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (orders.length === 0) {
                setLoading(true);
            }
            getUSerListings(walletAddress).then((data) => {
                setOrders(data.orders);
                setTotalCount(data.totalCount);
                setLoading(false);
            });
        };
        if (walletConnected) {
            fetchUserOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress, walletConnected, operationFinished]);

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
        // handlePortfolioPagination('prev');
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
        // handlePortfolioPagination('next');
    };

    const handleDelist = async (orderId: string) => {
        const response = await removeFromMarketplace(orderId, walletAddress);
        if (response.success) {
            showGlobalSnackbar({
                message: 'Order removed from marketplace',
                severity: 'success',
            });
            setOperationFinished((prev) => !prev);
        }
    };
    const handleRelist = async (orderId: string) => {
        const response = await relistSellOrder(orderId, walletAddress);
        if (response === 201) {
            showGlobalSnackbar({
                message: 'Order relisted successfully',
                severity: 'success',
            });
            setOperationFinished((prev) => !prev);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        const { needMoney, temporaryWalletAddress, confirm } = await confirmDelistOrder(orderId, walletAddress);
        if (needMoney === true) {
            try {
                setCancelOrderWaitingPayment(true);
                const txData = await sendKaspa(temporaryWalletAddress, 5 * KASPA_TO_SOMPI);
                if (txData) {
                    setCancelOrderWaitingPayment(false);
                    setCancelOrderWaitingConfirmation(true);
                    const parsedTxData = JSON.parse(txData);
                    const txId = parsedTxData.id;
                    const { confirm } = await confirmDelistOrder(orderId, walletAddress, txId);
                    if (confirm) {
                        setCancelOrderWaitingConfirmation(false);
                        showGlobalSnackbar({
                            message: 'Order removed from marketplace, tokens returned to your wallet',
                            severity: 'success',
                        });
                        setOperationFinished((prev) => !prev);
                    }
                } else {
                    showGlobalSnackbar({
                        message: 'Error sending Kas for Fees to remove tokens, please try again',
                        severity: 'success',
                    });
                    setCancelOrderWaitingPayment(false);
                }
            } catch (error) {
                showGlobalSnackbar({
                    message: 'Error removing order from marketplace, please try again',
                    severity: 'error',
                });
                setCancelOrderWaitingPayment(false);
                setCancelOrderWaitingConfirmation(false);
            }
        }
        if (confirm === true) {
            showGlobalSnackbar({
                message: 'Order removed from marketplace, tokens returned to your wallet',
                severity: 'success',
            });
            setOperationFinished((prev) => !prev);
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
        const response = await updateSellOrder(orderId, walletAddress, pricePerToken, totalPrice);
        if (response === 201) {
            showGlobalSnackbar({
                message: 'Order Edited Successfully',
                severity: 'success',
            });
            setOperationFinished((prev) => !prev);
        }
    };

    const disableNext = totalCount < 15;
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
                <NextPageButton onClick={handleNextPage} disabled={disableNext}>
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
                    {orders.length > 0 && !loading
                        ? orders.map((order) => (
                              <UserOrdersRow
                                  cancelOrderWaitingPayment={cancelOrderWaitingPayment}
                                  cancelOrderWaitingConfirmation={cancelOrderWaitingConfirmation}
                                  handleCancelOrder={handleCancelOrder}
                                  handleEditOrder={handleEditOrder}
                                  handleRelist={handleRelist}
                                  handleDelist={handleDelist}
                                  key={order.orderId}
                                  order={order}
                                  walletConnected={walletConnected}
                                  kasPrice={kasPrice}
                              />
                          ))
                        : // Replace single Skeleton with multiple Skeletons
                          [...Array(5)].map((_, index) => <Skeleton key={index} width={'100%'} height={'12vh'} />)}
                </List>
            )}
            {orders.length === 0 && walletConnected && (
                <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                    <b>End of list</b>
                </p>
            )}
        </StyledPortfolioGridContainer>
    );
};

export default PortfolioOrdersGrid;
