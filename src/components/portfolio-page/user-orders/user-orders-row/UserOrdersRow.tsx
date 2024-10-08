import React from 'react';
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
import { Order, SellOrderStatus } from '../../../../types/Types';
import LoadingSpinner from '../../../common/spinner/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';

interface UserOrdersRowProps {
    order: Order;
    kasPrice: number;
    walletConnected: boolean;
    handleDelist: (orderId: string) => void;
    handleRelist: (orderId: string) => void;
    handleEditOrder: (orderId: string, pricePerToken: number, totalPrice: number) => void;
    handleCancelOrder?: (orderId: string) => void;
    cancelOrderWaitingConfirmation: boolean;
    cancelOrderWaitingPayment: boolean;
    setCancelOrderWaitingConfirmation: (value: boolean) => void;
    loadingOrderId: string | null;
    setLoadingOrderId: (orderId: string | null) => void;
    offset: number;
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
        offset,
        walletAddress,
    } = props;
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [pricePerToken, setPricePerToken] = React.useState('');
    const [totalPrice, setTotalPrice] = React.useState('');
    const [editError, setEditError] = React.useState('');
    const [openCancelDialog, setOpenCancelDialog] = React.useState(false);
    const [isCancelOrderLoading, setIsCancelOrderLoading] = React.useState(false);
    const [isEditOrderLoading, setIsEditOrderLoading] = React.useState(false);
    const [isRelistLoading, setIsRelistLoading] = React.useState(false);
    const [cancelDialogButtonLoader, setCancelDialogButtonLoader] = React.useState(false);
    const [pricePerTokenError, setPricePerTokenError] = React.useState('');
    const queryClient = useQueryClient();
    const handleCloseEditDialog = () => {
        if (isEditOrderLoading) return;
        setLoadingOrderId(null);
        setOpenEditDialog(false);
        setPricePerToken('');
        setTotalPrice('');
        setEditError('');
    };

    const delistHandler = async (orderId: string) => {
        setLoadingOrderId(orderId);

        // Optimistically update the order status

        try {
            await handleDelist(orderId);
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
        } catch (error) {
            // Revert the optimistic update on error
            queryClient.invalidateQueries({ queryKey: ['userListings', walletAddress, offset] });
            // Optionally show an error message to the user
        } finally {
            setLoadingOrderId(null);
        }
    };

    const relistHandler = async (orderId: string) => {
        setIsRelistLoading(true);
        setLoadingOrderId(orderId);
        try {
            await handleRelist(orderId);
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
        } catch (error) {
            // Revert the optimistic update on error
            queryClient.invalidateQueries({ queryKey: ['userListings', walletAddress, offset] });
            // Optionally show an error message to the user
        } finally {
            setIsRelistLoading(false);
            setLoadingOrderId(null);
        }
    };

    // Reset the loading state

    const formatPrice = (price: number) => {
        if (price >= 1) return price.toFixed(2);
        if (price >= 0.01) return price.toFixed(3);
        return price.toFixed(6);
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
                setPricePerToken((total / amount).toFixed(2)); // Calculate price per token
                setEditError(''); // Clear error if any
            } else {
                setEditError('Total price must be at least 25 KAS.');
            }
        } else {
            setPricePerToken('');
            setEditError('');
        }
    };
    const handleTotalPriceDecimals = (totalPrice) => {
        if (totalPrice.includes('.')) {
            setTotalPrice(parseFloat(totalPrice).toFixed(0));
            return parseFloat(totalPrice).toFixed(0);
        } else {
            return totalPrice;
        }
    };

    const handlePricePerTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const priceStr = e.target.value;
        setPricePerToken(priceStr);

        const pricePerTokenValue = parseFloat(priceStr);
        const amount = order.quantity;

        if (!isNaN(pricePerTokenValue)) {
            const newTotalPrice = pricePerTokenValue * amount;
            if (newTotalPrice >= 25) {
                const fixedPrice = handleTotalPriceDecimals(newTotalPrice.toString());
                setTotalPrice(fixedPrice); // Calculate total price
                setEditError(''); // Clear error if any
            } else {
                setEditError('Total price must be at least 25 KAS.');
            }
        } else {
            setTotalPrice('');
            setEditError('');
        }
    };

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
        setIsEditOrderLoading(false);
        handleCloseEditDialog();
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

    return (
        <div key={order.orderId}>
            <ListItem disablePadding sx={{ height: '12vh' }}>
                {/* Order Ticker */}
                <ListItemText
                    sx={{ width: '3vw', marginLeft: '1rem' }}
                    primary={
                        <Typography variant="body1" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {order.ticker}
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
                            {order.quantity}
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
                                        onClick={() => setOpenEditDialog(true)}
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
                                margin="dense"
                                id="totalPrice"
                                label="Total Price"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={totalPrice}
                                onChange={handleTotalPriceChange}
                                error={!!editError || !!pricePerTokenError}
                                helperText={editError || pricePerTokenError || ''}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="pricePerToken"
                                label="Price Per Token"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={pricePerToken}
                                onChange={handlePricePerTokenChange}
                                error={!!editError}
                            />
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
                    {cancelOrderWaitingPayment || cancelOrderWaitingConfirmation ? '' : 'Cancel Order Process'}
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
