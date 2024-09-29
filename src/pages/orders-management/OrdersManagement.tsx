import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    MenuItem,
} from '@mui/material';
import {
    getOrdersManagementOrder,
    revealPrivateKey,
    updateOrdersManagementSellOrder,
} from '../../DAL/BackendOrdersManagementDAL';
import { fetchWalletKRC20TokensBalance } from '../../DAL/Krc20DAL';
import { SellOrderStatus, TokenRowPortfolioItem } from '../../types/Types';
import { getWalletLastTransactions } from '../../DAL/KaspaApiDal';
import { showGlobalSnackbar } from '../../components/alert-context/AlertContext';

const OrdersManagementItem: FC = () => {
    const { id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUtxoData, setSelectedUtxoData] = useState<any>(null);
    const [krc20Tokens, setKrc20Tokens] = useState<TokenRowPortfolioItem[]>(null);
    const [transactions, setTransactions] = useState<any>(null);
    const [updateTransactionAndStatusOrderData, setUpdateTransactionAndStatusOrderData] = useState<any>({});
    const [revealPrivateKeyPassword, setRevealPrivateKeyPassword] = useState<string | null>(null);
    const [isLoadingReveal, setIsLoadingReveal] = useState(false);

    const loadData = async () => {
        setOrderData(null);
        setTransactions(null);
        setKrc20Tokens(null);

        try {
            const response = await getOrdersManagementOrder(id);
            setOrderData(response);
            setUpdateTransactionAndStatusOrderData({
                status: response.order.status,
                transactions: response.order.transactions || {},
            });

            try {
                const krc20TokensResult = await fetchWalletKRC20TokensBalance(response.tempWalletAddress);
                setKrc20Tokens(krc20TokensResult.portfolioItems);
            } catch (error) {
                console.error(error);
            }

            try {
                const walletTransactions = await getWalletLastTransactions(response.tempWalletAddress, 20);
                setTransactions(walletTransactions.sort((a, b) => a.block_time - b.block_time));
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
            setLoadingError(error.message);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleUtxoClick = (data: any) => {
        setSelectedUtxoData(data);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUtxoData(null);
    };

    const handleRevealPrivateKey = async () => {
        setIsLoadingReveal(true);
        try {
            await revealPrivateKey(id, revealPrivateKeyPassword);
            showGlobalSnackbar({
                message: 'Private key sent successfully',
                severity: 'success',
            });
        } catch (error) {
            console.error(error);
            showGlobalSnackbar({
                message: 'Failed reveal private key',
                severity: 'error',
                details: error.message,
            });
        }
        setIsLoadingReveal(false);
    };

    if (!orderData) {
        return loadingError ? (
            <Alert severity="error">Error: {loadingError}</Alert>
        ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const handleSubmitUpdateStatusAndTransactions = async () => {
        setOrderData(null);
        await updateOrdersManagementSellOrder(orderData.order._id, updateTransactionAndStatusOrderData);
        await loadData();
    };

    return (
        <Box p={3}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Order Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid container item spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Order ID:
                                </Typography>
                                <Typography variant="body1">{orderData.order._id}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Ticker:
                                </Typography>
                                <Typography variant="body1">{orderData.order.ticker}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Quantity:
                                </Typography>
                                <Typography variant="body1">{orderData.order.quantity}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Price per token:
                                </Typography>
                                <Typography variant="body1">{orderData.order.pricePerToken}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Total price:
                                </Typography>
                                <Typography variant="body1">{orderData.order.totalPrice}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Wallet sequence id:
                                </Typography>
                                <Typography variant="body1">{orderData.order.walletSequenceId}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Seller wallet address:
                                </Typography>
                                <Typography variant="body1">{orderData.order.sellerWalletAddress}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Buyer wallet address:
                                </Typography>
                                <Typography variant="body1">
                                    {orderData.order.buyerWalletAddress || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Status:
                                </Typography>
                                <Typography variant="body1">{orderData.order.status || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Fulfillment timestamp:
                                </Typography>
                                <Typography variant="body1">
                                    {orderData.order.fulfillmentTimestamp
                                        ? new Date(orderData.order.fulfillmentTimestamp).toLocaleString()
                                        : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Transactions:
                                </Typography>
                                <Typography variant="body1">
                                    {orderData.order.transactions
                                        ? Object.entries(orderData.order.transactions).map(([key, value]) => (
                                              <Typography variant="body1" key={key}>
                                                  {`${key}: ${value}`}
                                              </Typography>
                                          ))
                                        : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Is delist:
                                </Typography>
                                <Typography variant="body1">{orderData.order.isDelist ? 'Yes' : 'No'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Error:
                                </Typography>
                                <Typography variant="body1">{orderData.order.error || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Expires at:
                                </Typography>
                                <Typography variant="body1">
                                    {orderData.order.expiresAt
                                        ? orderData.order.expiresAt.toLocaleString()
                                        : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Created at:
                                </Typography>
                                <Typography variant="body1">
                                    {orderData.order.createdAt
                                        ? orderData.order.createdAt.toLocaleString()
                                        : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Updated at:
                                </Typography>
                                <Typography variant="body1">
                                    {orderData.order.updatedAt
                                        ? orderData.order.updatedAt.toLocaleString()
                                        : 'N/A'}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Temporary Wallet Stats
                            </Typography>

                            <Typography variant="subtitle1" color="textSecondary">
                                Address:
                            </Typography>
                            <Typography variant="body1">{orderData.tempWalletAddress}</Typography>

                            <Typography variant="subtitle1" color="textSecondary">
                                Total Amount:
                            </Typography>
                            <Typography variant="body1">{orderData.orderUtxos.totalBalance / 1e8}</Typography>

                            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                KRC20 Tokens:
                            </Typography>
                            <Box>
                                {!krc20Tokens ? (
                                    <CircularProgress />
                                ) : (
                                    krc20Tokens.map((token, index) => (
                                        <Typography key={index} variant="body1">
                                            {' '}
                                            {`${token.ticker}: ${token.balance}`}{' '}
                                        </Typography>
                                    ))
                                )}
                            </Box>

                            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                Transactions:
                            </Typography>
                            <List>
                                {!transactions ? (
                                    <CircularProgress />
                                ) : (
                                    transactions.map((tx, index) => (
                                        <ListItem
                                            key={`tx${index}`}
                                            sx={{
                                                padding: 0,
                                            }}
                                        >
                                            <ListItemText primary={`Id: ${tx.transaction_id}`} />
                                            <Button variant="outlined" onClick={() => handleUtxoClick(tx)}>
                                                View Transaction JSON
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={() =>
                                                    window.open(
                                                        `https://explorer.kaspa.org/txs/${tx.transaction_id}`,
                                                        '_blank',
                                                    )
                                                }
                                            >
                                                View on Explorer
                                            </Button>
                                        </ListItem>
                                    ))
                                )}
                            </List>

                            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                UTXOs:
                            </Typography>
                            <List>
                                {orderData.orderUtxos.utxoEntries.map((utxo, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            padding: 0,
                                        }}
                                    >
                                        <ListItemText primary={`AMOUNT: ${utxo.amount / 1e8}`} />
                                        <Button variant="outlined" onClick={() => handleUtxoClick(utxo)}>
                                            View UTXO Data
                                        </Button>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Dialog for displaying UTXO JSON data */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Json viewer</DialogTitle>
                <DialogContent>
                    <pre>{JSON.stringify(selectedUtxoData, null, 2)}</pre>
                </DialogContent>
            </Dialog>

            <CardContent>
                <Typography variant="h6">Update Order Status and Transactions</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Status"
                            type="text"
                            fullWidth
                            value={updateTransactionAndStatusOrderData.status}
                            onChange={(e) =>
                                setUpdateTransactionAndStatusOrderData({
                                    ...updateTransactionAndStatusOrderData,
                                    status: e.target.value,
                                })
                            }
                            variant="outlined"
                            select
                        >
                            {Object.values(SellOrderStatus).map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Commit Transaction ID"
                            type="text"
                            fullWidth
                            value={updateTransactionAndStatusOrderData.transactions?.commitTransactionId || ''}
                            onChange={(e) =>
                                setUpdateTransactionAndStatusOrderData({
                                    ...updateTransactionAndStatusOrderData,
                                    transactions: {
                                        ...updateTransactionAndStatusOrderData.transactions,
                                        commitTransactionId: e.target.value,
                                    },
                                })
                            }
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Reveal Transaction ID"
                            type="text"
                            fullWidth
                            value={updateTransactionAndStatusOrderData.transactions?.revealTransactionId || ''}
                            onChange={(e) =>
                                setUpdateTransactionAndStatusOrderData({
                                    ...updateTransactionAndStatusOrderData,
                                    transactions: {
                                        ...updateTransactionAndStatusOrderData.transactions,
                                        revealTransactionId: e.target.value,
                                    },
                                })
                            }
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Seller Transaction ID"
                            type="text"
                            fullWidth
                            value={updateTransactionAndStatusOrderData.transactions?.sellerTransactionId || ''}
                            onChange={(e) =>
                                setUpdateTransactionAndStatusOrderData({
                                    ...updateTransactionAndStatusOrderData,
                                    transactions: {
                                        ...updateTransactionAndStatusOrderData.transactions,
                                        sellerTransactionId: e.target.value,
                                    },
                                })
                            }
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Buyer Transaction ID"
                            type="text"
                            fullWidth
                            value={updateTransactionAndStatusOrderData.transactions?.buyerTransactionId || ''}
                            onChange={(e) =>
                                setUpdateTransactionAndStatusOrderData({
                                    ...updateTransactionAndStatusOrderData,
                                    transactions: {
                                        ...updateTransactionAndStatusOrderData.transactions,
                                        buyerTransactionId: e.target.value,
                                    },
                                })
                            }
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmitUpdateStatusAndTransactions}
                >
                    Update Order
                </Button>
            </CardContent>
            <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="h6">Reveal Private Key</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                value={revealPrivateKeyPassword}
                                onChange={(e) => setRevealPrivateKeyPassword(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            {isLoadingReveal ? (
                                <CircularProgress />
                            ) : (
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleRevealPrivateKey}
                                >
                                    Reveal Private Key
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default OrdersManagementItem;
