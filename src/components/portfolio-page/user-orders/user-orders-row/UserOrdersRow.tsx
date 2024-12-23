import React, { useEffect, useState } from 'react';
import {
    ListItem,
    Typography,
    Box,
    ListItemText,
    Tooltip,
    Divider,
    Button,
    DialogActions,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { DecentralizedOrder, Order, SellOrderStatus, SellOrderStatusV2 } from '../../../../types/Types';
import LoadingSpinner from '../../../common/spinner/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';
import { highGasWarning } from '../../../../DAL/KaspaApiDal';
import { HighGasWarning } from '../../../common/HighGasWarning';
import { useFetchFloorPrice } from '../../../../DAL/UseQueriesBackend';
import { verifyDecentralizedOrder, getDecentralizedOrder } from '../../../../DAL/BackendP2PDAL';
import { cancelOrderKRC20 } from '../../../../utils/KaswareUtils';
import { showGlobalSnackbar } from '../../../alert-context/AlertContext';
import { fetchTokenPrice } from '../../../../DAL/BackendDAL';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { formatNumberWithCommas } from '../../../../utils/Utils';

interface UserOrdersRowProps {
    order: Order | DecentralizedOrder;
    kasPrice: number;
    walletConnected: boolean;
    handleDelist: (orderId: string) => void;
    handleRelist: (orderId: string) => void;
    handleEditOrder: (orderId: string, pricePerToken: number, totalPrice: number) => Promise<boolean>;
    handleCancelOrder?: (orderId: string) => void;
    cancelOrderWaitingConfirmation: boolean;
    cancelOrderWaitingPayment: boolean;
    setCancelOrderWaitingConfirmation: (value: boolean) => void;
    loadingOrderId: string | null;
    setLoadingOrderId: (orderId: string | null) => void;
    walletAddress: string;
}

const UserOrdersRow: React.FC<UserOrdersRowProps> = (props) => {
    const {
        order,
        kasPrice,
        handleDelist,
        handleEditOrder,
        handleRelist,
        handleCancelOrder,
        cancelOrderWaitingConfirmation,
        cancelOrderWaitingPayment,
        setCancelOrderWaitingConfirmation,
        setLoadingOrderId,
        loadingOrderId,
        walletAddress,
    } = props;
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [pricePerToken, setPricePerToken] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [editError, setEditError] = useState('');
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [isCancelOrderLoading, setIsCancelOrderLoading] = useState(false);
    const [isEditOrderLoading, setIsEditOrderLoading] = useState(false);
    const [isRelistLoading, setIsRelistLoading] = useState(false);
    const [cancelDialogButtonLoader, setCancelDialogButtonLoader] = useState(false);
    const [pricePerTokenError, setPricePerTokenError] = useState('');
    const [showHighGasWarning, setShowHighGasWarning] = useState(false);
    const [floorPrice, setFloorPrice] = useState<number | null>(null);

    const { data: data, isLoading } = useFetchFloorPrice(order.ticker);

    useEffect(() => {
        if (!isLoading && data?.floor_price) {
            fetchTokenPrice(order.ticker)
                .then((price) => {
                    const lowest = price ? Math.min(data.floor_price, price) : data.floor_price;
                    setFloorPrice(lowest);
                })
                .catch(() => {
                    setFloorPrice(null);
                });
        } else {
            setFloorPrice(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, order.ticker]);

    const queryClient = useQueryClient();
    const handleCloseEditDialog = () => {
        if (isEditOrderLoading) return;
        setLoadingOrderId(null);
        setOpenEditDialog(false);
        setPricePerToken('');
        setTotalPrice('');
        setEditError('');
    };

    useEffect(() => {
        const checkGasLimits = async () => {
            const isHighGasWarning = await highGasWarning('TRANSFER');

            setShowHighGasWarning(isHighGasWarning);
        };

        checkGasLimits();
    }, [isCancelOrderLoading]);

    const delistHandler = async (orderId: string) => {
        setLoadingOrderId(orderId);
        await handleDelist(orderId);
        setLoadingOrderId(null);
    };

    const cancelV2 = async (order: DecentralizedOrder) => {
        try {
            setLoadingOrderId(order.orderId);
            const orderData = await getDecentralizedOrder(order.orderId);

            try {
                const txid = await cancelOrderKRC20(order.ticker, orderData.psktTransactionId);
                await verifyDecentralizedOrder(order.orderId, txid);

                showGlobalSnackbar({
                    message: 'Order cancelled successfully',
                    severity: 'success',
                });
                queryClient.invalidateQueries({ queryKey: ['userListings', walletAddress] });
            } catch (error) {
                showGlobalSnackbar({
                    message: 'Failed to cancel order',
                    severity: 'error',
                    details: error.message,
                });
                throw error; // Re-throw to be caught by outer try-catch
            }
        } catch (error) {
            showGlobalSnackbar({
                message: 'Failed to cancel order',
                severity: 'error',
                details: error.message,
            });
        } finally {
            setLoadingOrderId(null);
            verifyDecentralizedOrder(order.orderId);
        }
    };

    const relistHandler = async (orderId: string) => {
        setIsRelistLoading(true);
        setLoadingOrderId(orderId);
        await handleRelist(orderId);
        setIsRelistLoading(false);
        setLoadingOrderId(null);
    };

    // Reset the loading state

    const formatPrice = (price: number) => {
        if (price >= 1) return price.toFixed(3);
        if (price >= 0.01) return price.toFixed(4);
        return price.toFixed(7);
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // Customize as per your requirement
    };

    const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const totalStr = e.target.value;
        let totalRounded;
        if (totalStr.includes('.')) {
            setTotalPrice(parseFloat(totalStr).toFixed(0));
            totalRounded = parseFloat(totalStr).toFixed(0);
            setPricePerTokenError('Please enter a rounded number without decimals.');
        } else {
            totalRounded = totalStr;
            setTotalPrice(totalStr);
            setPricePerTokenError('');
        }

        const total = parseFloat(totalRounded);
        const amount = order.quantity; // The amount is fixed as per your requirement

        if (!isNaN(total)) {
            if (total >= 25) {
                // Minimum total price check
                setPricePerToken((total / amount).toFixed(8)); // Calculate price per token
                setEditError(''); // Clear error if any
            } else {
                setEditError('Total price must be at least 25 KAS.');
            }
        } else {
            setPricePerToken('');
            setEditError('');
        }
    };
    // const handleTotalPriceDecimals = (totalPrice) => {
    //     if (totalPrice.includes('.')) {
    //         setTotalPrice(parseFloat(totalPrice).toFixed(0));
    //         return parseFloat(totalPrice).toFixed(0);
    //     } else {
    //         return totalPrice;
    //     }
    // };

    // const handlePricePerTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const priceStr = e.target.value;
    //     setPricePerToken(priceStr);

    //     const pricePerTokenValue = parseFloat(priceStr);
    //     const amount = order.quantity;

    //     if (!isNaN(pricePerTokenValue)) {
    //         const newTotalPrice = pricePerTokenValue * amount;
    //         if (newTotalPrice >= 25) {
    //             const fixedPrice = handleTotalPriceDecimals(newTotalPrice.toString());
    //             setTotalPrice(fixedPrice); // Calculate total price
    //             setEditError(''); // Clear error if any
    //         } else {
    //             setEditError('Total price must be at least 25 KAS.');
    //         }
    //     } else {
    //         setTotalPrice('');
    //         setEditError('');
    //     }
    // };

    const editOrderHandler = async () => {
        if (pricePerToken === '' || totalPrice === '') {
            setEditError('Please fill in all fields');
            return;
        }
        if (isNaN(Number(pricePerToken)) || isNaN(Number(totalPrice))) {
            setEditError('Please enter a valid number');
            return;
        }
        if (Number(totalPrice) < 25) {
            setEditError('Total price must be at least 25 KAS.');
            return;
        }
        setIsEditOrderLoading(true);
        await handleEditOrder(order.orderId, Number(pricePerToken), Number(totalPrice));
        handleCloseEditDialog();
        queryClient.invalidateQueries({ queryKey: ['userListings', walletAddress] });
        setTimeout(() => {
            setIsEditOrderLoading(false);
        }, 700);
    };

    const cancelOrderHandler = async (orderId: string) => {
        setIsCancelOrderLoading(false);
        setCancelDialogButtonLoader(true);
        await handleCancelOrder(orderId);
        setCancelDialogButtonLoader(false);
        setOpenCancelDialog(false);
        setCancelOrderWaitingConfirmation(false);
    };

    const hadleOpenCancelDialog = (orderId: string) => {
        setIsCancelOrderLoading(true);
        setLoadingOrderId(orderId);
        setOpenCancelDialog(true);
    };

    const handleCancelCloseDialog = () => {
        if (cancelOrderWaitingPayment || cancelOrderWaitingConfirmation) return;
        setIsCancelOrderLoading(false);
        setLoadingOrderId(null);
        setOpenCancelDialog(false);
    };
    const openEditDialogHandler = () => {
        setOpenEditDialog(true);
        queryClient.invalidateQueries({ queryKey: ['floor_price', order.ticker] });
    };

    return (
        <div key={order.orderId}>
            <ListItem disablePadding sx={{ height: '12vh' }}>
                {/* Order Ticker */}
                <ListItemText
                    sx={{ width: '3vw', marginLeft: '1rem' }}
                    primary={
                        <Typography
                            variant="body1"
                            sx={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                        >
                            {order.ticker}
                            {!order.isDecentralized && (
                                <Tooltip
                                    title="This is an old order created before the PSKT protocol was introduced. Please delist and list it again to comply with the latest standards."
                                    arrow
                                >
                                    <WarningAmberIcon
                                        sx={{
                                            fontSize: '1rem',
                                            color: 'yellow',
                                            marginLeft: '0.5rem',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Typography>
                    }
                />
                {/* Created At */}
                <ListItemText
                    sx={{ width: '12vw' }}
                    primary={
                        <Typography
                            variant="body1"
                            sx={{ fontSize: '0.75rem', fontWeight: 'bold', justifyContent: 'center' }}
                        >
                            {formatDate(order.createdAt)}
                        </Typography>
                    }
                />
                {/* Quantity */}
                <ListItemText
                    sx={{ width: '2vw' }}
                    primary={
                        <Typography variant="body1" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {formatNumberWithCommas(order.quantity.toFixed(2))}
                        </Typography>
                    }
                />
                {/* Price Per Token */}
                <ListItemText
                    sx={{ width: '5vw' }}
                    primary={
                        <Tooltip title={`${order.pricePerToken} KAS`}>
                            <Typography
                                variant="body1"
                                style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                {formatPrice(order.pricePerToken)}
                            </Typography>
                        </Tooltip>
                    }
                />
                {/* Total Price */}
                <ListItemText
                    sx={{ width: '6vw' }}
                    primary={
                        <Typography
                            variant="body1"
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            {order.totalPrice.toFixed(2)} KAS
                        </Typography>
                    }
                    secondary={
                        <Typography
                            variant="body2"
                            style={{
                                fontSize: '0.7rem',
                                display: 'flex',
                                justifyContent: 'center',
                                color: 'gray', // Optional: to differentiate the secondary text
                            }}
                        >
                            (${(order.totalPrice * kasPrice).toFixed(2)})
                        </Typography>
                    }
                />
                {!order.isDecentralized && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            width: '23vw',
                            justifyContent: 'center',
                            paddingRight: '8rem',
                        }}
                    >
                        {order.status === SellOrderStatus.OFF_MARKETPLACE && (
                            <>
                                <Tooltip title="Relist the item for sale">
                                    {loadingOrderId === order.orderId && isRelistLoading ? (
                                        <LoadingSpinner size={20} />
                                    ) : (
                                        !isCancelOrderLoading && (
                                            <Button
                                                onClick={() => relistHandler(order.orderId)}
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    minWidth: '3.5vw',
                                                    width: '3vw',
                                                    fontSize: '0.6rem',
                                                }}
                                            >
                                                Relist
                                            </Button>
                                        )
                                    )}
                                </Tooltip>

                                <Tooltip title="Edit is to change the order details">
                                    {isCancelOrderLoading || isRelistLoading ? null : (
                                        <Button
                                            onClick={openEditDialogHandler}
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                minWidth: '3.5vw',
                                                width: '3vw',
                                                fontSize: '0.6rem',
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </Tooltip>
                                <Tooltip title="Cancel is to retrieve the tokens back to your wallet">
                                    {loadingOrderId === order.orderId && isCancelOrderLoading ? (
                                        <LoadingSpinner size={20} />
                                    ) : (
                                        !isRelistLoading && (
                                            <Button
                                                onClick={() => hadleOpenCancelDialog(order.orderId)}
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    minWidth: '3.5vw',
                                                    width: '3vw',
                                                    fontSize: '0.6rem',
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        )
                                    )}
                                </Tooltip>
                            </>
                        )}

                        {order.status === SellOrderStatus.LISTED_FOR_SALE &&
                            (loadingOrderId === order.orderId ? (
                                <LoadingSpinner size={20} />
                            ) : (
                                <Button
                                    onClick={() => delistHandler(order.orderId)}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        minWidth: '3.5vw',
                                        width: '3vw',
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    Delist
                                </Button>
                            ))}
                    </Box>
                )}
                {order.isDecentralized && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            width: '23vw',
                            justifyContent: 'center',
                            paddingRight: '8rem',
                        }}
                    >
                        {[SellOrderStatusV2.LISTED_FOR_SALE, SellOrderStatusV2.PSKT_VERIFICATION_ERROR].includes(
                            order.status as SellOrderStatusV2,
                        ) &&
                            (loadingOrderId === order.orderId ? (
                                <LoadingSpinner size={20} />
                            ) : (
                                <Button
                                    onClick={() => cancelV2(order as unknown as DecentralizedOrder)}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        minWidth: '3.5vw',
                                        width: '3vw',
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    Cancel
                                </Button>
                            ))}
                    </Box>
                )}{' '}
                {/* Price Per Token */}
            </ListItem>
            <Divider />
            <Dialog
                PaperProps={{
                    sx: {
                        width: '40vw',
                    },
                }}
                open={openEditDialog}
                onClose={handleCloseEditDialog}
            >
                <DialogTitle>
                    {isEditOrderLoading ? '' : `Edit Order - Amount of Tokens: ${order.quantity}`}
                </DialogTitle>
                <DialogContent>
                    {isEditOrderLoading ? (
                        <LoadingSpinner title="Editing Order..." size={45} />
                    ) : (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="totalPrice"
                                label="Total Price (KAS)"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={totalPrice}
                                onChange={handleTotalPriceChange}
                                error={!!editError || !!pricePerTokenError}
                                helperText={editError || pricePerTokenError || ''}
                            />
                            <TextField
                                margin="dense"
                                id="pricePerToken"
                                label="Price Per Token (KAS)"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={pricePerToken}
                                disabled
                                error={!!editError}
                            />
                            <Typography variant="body2" sx={{ marginTop: 1, fontSize: '1rem', fontWeight: 500 }}>
                                {floorPrice ? `Floor Price: ${floorPrice} KAS` : ''}
                            </Typography>
                        </>
                    )}

                    {/* Total Price Field */}
                </DialogContent>
                {isEditOrderLoading ? null : (
                    <DialogActions>
                        <Button onClick={handleCloseEditDialog}>Cancel</Button>
                        <Button onClick={editOrderHandler}>Save</Button>
                    </DialogActions>
                )}
            </Dialog>
            <Dialog
                PaperProps={{
                    sx: {
                        width: '40vw',
                    },
                }}
                open={openCancelDialog}
                onClose={handleCancelCloseDialog}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {cancelOrderWaitingPayment || cancelOrderWaitingConfirmation ? '' : 'Cancel Order Process'}
                        {showHighGasWarning && <HighGasWarning />}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {/* Conditionally show the loading spinner or the content based on the state */}
                    {cancelOrderWaitingPayment ? (
                        <LoadingSpinner title="Waiting for payment in wallet" size={60} />
                    ) : cancelOrderWaitingConfirmation ? (
                        <LoadingSpinner title="Waiting for confirmation" size={60} />
                    ) : (
                        <Box sx={{ marginBottom: 2 }}>
                            <Typography variant="body1">
                                To cancel your order and retrieve your tokens, you will need to send{' '}
                                <strong>5 Kas</strong> to cover the expected gas fees. This ensures the transaction
                                can be processed smoothly on the network.{' '}
                                <strong>
                                    In most cases, you will receive approximately 4.9 Kas back, depends on network
                                    fees
                                </strong>{' '}
                                after the tokens are successfully sent and the transaction is completed.
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 2 }}>
                                The <strong>small difference</strong> accounts for minor fluctuations in network
                                fees, but rest assured,{' '}
                                <strong>the majority of your sent amount will be returned to your wallet</strong>.
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 2 }}>
                                Please confirm if you wish to proceed with the cancellation process.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                {cancelOrderWaitingConfirmation || cancelOrderWaitingPayment ? null : (
                    <DialogActions>
                        {cancelDialogButtonLoader ? (
                            <LoadingSpinner size={20} />
                        ) : (
                            <Button onClick={() => cancelOrderHandler(order.orderId)} variant="contained">
                                Cancel Order
                            </Button>
                        )}
                        <Button onClick={handleCancelCloseDialog}>Exit</Button>
                    </DialogActions>
                )}
            </Dialog>
        </div>
    );
};

export default UserOrdersRow;
