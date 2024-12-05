import React, { useState, useEffect } from 'react';
import { Box, IconButton, InputAdornment, Tooltip, Typography } from '@mui/material';
import { BackendTokenResponse, SellOrderStatusV2 } from '../../../../../types/Types';
import { StyledButton, StyledSellPanel, StyledTextField } from './SellPanel.s';
import { fetchWalletKRC20Balance } from '../../../../../DAL/Krc20DAL';
import { SwapHoriz } from '@mui/icons-material'; // MUI icon for swap
import { showGlobalSnackbar } from '../../../../alert-context/AlertContext';
import ConfirmSellDialog from './confirm-sell-dialog/ConfirmSellDialog';
import { createOrderKRC20, MINIMUM_KASPA_AMOUNT_FOR_TRANSACTION } from '../../../../../utils/KaswareUtils';
import { createSellOrderV2 } from '../../../../../DAL/BackendP2PDAL';
// import { doPolling } from '../../../../../utils/Utils';
import { useQueryClient } from '@tanstack/react-query';

interface SellPanelProps {
    tokenInfo: BackendTokenResponse;
    kasPrice: number;
    walletAddress: string | null;
    walletConnected;
    walletBalance: number;
    startPolling: () => void;
}

// const KASPA_TO_SOMPI = 100000000;
const STORAGE_KEY = 'pendingPSKT';
const KASPIANO_TRADE_COMMISSION = import.meta.env.VITE_TRADE_COMMISSION;
const KASPIANO_WALLET = import.meta.env.VITE_APP_KAS_WALLET_ADDRESS;

const SellPanel: React.FC<SellPanelProps> = (props) => {
    const { tokenInfo, kasPrice, walletAddress, walletConnected, walletBalance, startPolling } = props;
    const [tokenAmount, setTokenAmount] = useState<string>(''); // Changed to string
    const [totalPrice, setTotalPrice] = useState<string>(''); // Changed to string
    const [pricePerToken, setPricePerToken] = useState<string>(''); // Changed to string
    const [priceDifference, setPriceDifference] = useState<number>(0);
    const [walletTickerBalance, setWalletTickerBalance] = useState<number>(0);
    const [priceCurrency, setPriceCurrency] = useState<'KAS' | 'USD'>('KAS');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // Dialog state
    const [walletConfirmation, setWalletConfirmation] = useState<boolean>(false);
    const [disableSellButton, setDisableSellButton] = useState<boolean>(false);
    const [finishedSellOrder, setFinishedSellOrder] = useState<boolean>(false);
    const [amountError, setAmountError] = useState<string>('');
    const [pricePerTokenError, setPricePerTokenError] = useState<string>('');
    const [isPriceFromButton, setIsPriceFromButton] = useState<boolean>(false);
    const [showButtonsTooltip, setShowButtonsTooltip] = useState<boolean>(false);
    const [showInputTooltip, setShowInputTooltip] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const kaspianoCommissionInt = parseFloat(KASPIANO_TRADE_COMMISSION);

    useEffect(() => {
        const fetchBalance = () => {
            fetchWalletKRC20Balance(walletAddress, tokenInfo.ticker)
                .then((balance) => {
                    setWalletTickerBalance(balance);
                })
                .catch((error) => {
                    console.error('Error fetching wallet balance:', error);
                });
        };

        // Fetch immediately on mount
        fetchBalance();

        // Set interval to fetch every 4 seconds
        const intervalId = setInterval(fetchBalance, 4000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [walletAddress, tokenInfo.ticker, finishedSellOrder]);

    const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPriceFromButton(false);
        const amountStr = e.target.value;
        if (amountStr.includes('.')) {
            setAmountError('Please enter a rounded number without decimals.');
            return;
        }
        setAmountError('');
        setTokenAmount(amountStr);

        const amount = parseInt(amountStr);
        const total = parseFloat(totalPrice);
        const pricePerTokenValue = parseFloat(pricePerToken);

        if (!isNaN(amount) && amount > 0) {
            if (!isNaN(total)) {
                const newPricePerToken = total / amount;
                setPricePerToken(newPricePerToken.toString());
            } else if (!isNaN(pricePerTokenValue)) {
                const newTotalPrice = pricePerTokenValue * amount;
                const fixedTotalPrice = handleTotalPriceDecimals(newTotalPrice.toString());
                setTotalPrice(fixedTotalPrice);
            }
        } else {
            setTokenAmount('');
            setPricePerToken('');
            setTotalPrice('');
        }
    };

    // Handle changes in total price
    const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPriceFromButton(false);
        const priceStr = e.target.value;
        let totalRounded;
        if (priceStr.includes('.') && priceCurrency === 'KAS') {
            setTotalPrice(parseFloat(priceStr).toFixed(0));
            totalRounded = parseFloat(priceStr).toFixed(0);
            setPricePerTokenError('Please enter a rounded number without decimals.');
        } else {
            totalRounded = roundUp(priceStr, 8);
            setTotalPrice(priceStr);
            setPricePerTokenError('');
        }

        const total = parseFloat(totalRounded);
        const amount = parseInt(tokenAmount);

        if (!isNaN(total)) {
            if (!isNaN(amount) && amount > 0) {
                setPricePerToken(roundUp(total / amount, 8).toString());
            }
        } else {
            setPricePerToken('');
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

    // const handlePricePerTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const priceStr = e.target.value;
    //     setPricePerToken(priceStr);

    //     const pricePerTokenValue = parseFloat(priceStr);
    //     const amount = parseFloat(tokenAmount);

    //     if (!isNaN(pricePerTokenValue)) {
    //         if (!isNaN(amount) && amount > 0) {
    //             const newTotalPrice = pricePerTokenValue * amount;
    //             const fixedTotalPrice = handleTotalPriceDecimals(newTotalPrice.toString());
    //             setTotalPrice(fixedTotalPrice);
    //         }
    //     } else {
    //         setTotalPrice('');
    //     }
    // };

    useEffect(() => {
        let pricePerTokenValue = parseFloat(pricePerToken);

        if (priceCurrency === 'USD') {
            const priceInKAS = pricePerTokenValue / kasPrice;
            const roundedPriceInKAS = roundUp(priceInKAS, 8);

            pricePerTokenValue = roundedPriceInKAS;
        }

        if (!isNaN(pricePerTokenValue) && tokenInfo.price) {
            const diff = ((pricePerTokenValue - tokenInfo.price) / tokenInfo.price) * 100;
            setPriceDifference(diff);
        } else {
            setPriceDifference(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pricePerToken, totalPrice, tokenInfo.price]);

    const handleSetPricePerToken = (multiplier: number) => {
        if (!tokenInfo.price) {
            showGlobalSnackbar({ message: 'No Token Floor Price Exists', severity: 'error' });
            return;
        }
        if (tokenAmount === '') {
            showGlobalSnackbar({ message: 'Please enter a valid token amount.', severity: 'error' });
            return;
        }

        const amount = parseInt(tokenAmount);
        const newTotalPrice = Number(handleTotalPriceDecimals((tokenInfo.price * multiplier * amount).toString()));
        const roundedPricePerToken = roundUp(newTotalPrice / amount, 8);
        setPricePerToken(roundedPricePerToken.toString());
        setTotalPrice(String(newTotalPrice));
        setIsPriceFromButton(true);
    };

    function roundUp(value, decimals) {
        const factor = Math.pow(10, decimals);
        return Math.ceil(value * factor) / factor;
    }

    const handleCurrencyToggle = () => {
        if (priceCurrency === 'KAS') {
            // Convert prices to USD
            setPriceCurrency('USD');
            if (pricePerToken !== '') {
                const pricePerTokenValue = parseFloat(pricePerToken);
                const priceInUSD = pricePerTokenValue * kasPrice;
                setPricePerToken(roundUp(priceInUSD, 8).toString());
            }
            if (totalPrice !== '') {
                const totalPriceValue = parseFloat(totalPrice);
                const totalInUSD = totalPriceValue * kasPrice;
                setTotalPrice(roundUp(totalInUSD, 8).toString());
            }
        } else {
            // Convert prices back to KAS
            setPriceCurrency('KAS');
            if (pricePerToken !== '') {
                const pricePerTokenValue = parseFloat(pricePerToken);
                const priceInKAS = pricePerTokenValue / kasPrice;
                const roundedPriceInKAS = roundUp(priceInKAS, 8);
                setPricePerToken(roundedPriceInKAS.toString());
            }
            if (totalPrice !== '') {
                const totalPriceValue = parseFloat(totalPrice);
                const totalInKAS = totalPriceValue / kasPrice;
                const roundedTotalInKAS = handleTotalPriceDecimals(totalInKAS.toString());
                setTotalPrice(String(roundedTotalInKAS));
            }
        }
    };
    const cleanFields = () => {
        setTokenAmount('');
        setTotalPrice('');
        setPricePerToken('');
    };

    const handleCreateSellOrder = async () => {
        setDisableSellButton(true);
        if (priceCurrency === 'USD') {
            setPriceCurrency('KAS');
            if (totalPrice !== '') {
                const totalPriceValue = parseFloat(totalPrice);
                const totalInKAS = totalPriceValue / kasPrice;
                const roundedTotalInKAS = roundUp(totalInKAS, 8);
                setTotalPrice(roundedTotalInKAS.toString());
            }
            if (pricePerToken !== '') {
                const pricePerTokenValue = parseFloat(pricePerToken);
                const priceInKAS = pricePerTokenValue / kasPrice;
                const roundedPriceInKAS = roundUp(priceInKAS, 8);
                setPricePerToken(roundedPriceInKAS.toString());
            }
        }

        const amount = parseInt(tokenAmount);
        if (isNaN(amount) || amount <= 0) {
            showGlobalSnackbar({ message: 'Please enter a valid token amount.', severity: 'error' });
            setDisableSellButton(false);
            return;
        }
        if (amount > walletTickerBalance) {
            showGlobalSnackbar({ message: 'Insufficient Token balance.', severity: 'error' });
            setDisableSellButton(false);
            return;
        }

        if (walletBalance <= MINIMUM_KASPA_AMOUNT_FOR_TRANSACTION) {
            showGlobalSnackbar({
                message: `Minimum wallet balance need to be ${MINIMUM_KASPA_AMOUNT_FOR_TRANSACTION} KAS in order to transfer the tokens.`,
                severity: 'error',
            });
            setDisableSellButton(false);
            return;
        }

        try {
            setIsDialogOpen(true);
        } catch (error) {
            console.error(error);
            showGlobalSnackbar({
                message: 'Failed to create sell order for the token. Please try again later.',
                severity: 'error',
            });
        }
    };

    // const handleTransfer = async (priorityFee?: number) => {
    //     let idResponse = '';
    //     let temporaryWalletAddressResponse = '';
    //     try {
    //         const { id, temporaryWalletAddress } = await createSellOrder(
    //             tokenInfo.ticker,
    //             parseInt(tokenAmount),
    //             parseInt(totalPrice),
    //             parseFloat(pricePerToken),
    //             walletAddress,
    //         );
    //         idResponse = id;
    //         temporaryWalletAddressResponse = temporaryWalletAddress;
    //     } catch (error) {
    //         showGlobalSnackbar({
    //             message: 'Failed to create sell order for the token. Please try again later.',
    //             severity: 'error',
    //         });
    //         return;
    //     }
    //     setWalletConfirmation(true);
    //     const inscribeJsonString: TransferObj = {
    //         p: 'KRC-20',
    //         op: 'transfer',
    //         tick: tokenInfo.ticker,
    //         amt: (parseInt(tokenAmount) * KASPA_TO_SOMPI).toString(),
    //         to: temporaryWalletAddressResponse,
    //     };
    //     const jsonStringified = JSON.stringify(inscribeJsonString);

    //     try {
    //         const result = await transferKRC20Token(jsonStringified, priorityFee);
    //         setCreatingSellOrder(true);
    //         setWalletConfirmation(false);
    //         if (result) {
    //             const { commitId, revealId } = JSON.parse(result);
    //             showGlobalSnackbar({
    //                 message: 'Token transferred successfully',
    //                 severity: 'success',
    //                 commitId,
    //                 revealId,
    //             });
    //         }
    //         const confirmation = await doPolling(
    //             () => confirmSellOrder(idResponse),
    //             (result) => result.confirmed,
    //         );

    //         if (confirmation) {
    //             setIsDialogOpen(false);
    //             setDisableSellButton(false);
    //             showGlobalSnackbar({
    //                 message: 'Sell order created successfully',
    //                 severity: 'success',
    //             });
    //             cleanFields();
    //             queryClient.invalidateQueries({ queryKey: ['orders'] });
    //             setFinishedSellOrder((prev) => !prev);
    //             setTimeout(() => {
    //                 setCreatingSellOrder(false); // Ensures it closes after a slight delay
    //             }, 500);

    //             return true;
    //         } else {
    //             showGlobalSnackbar({
    //                 message: 'Failed to create sell order',
    //                 severity: 'error',
    //             });
    //             return false;
    //         }
    //     } catch (error) {
    //         setCreatingSellOrder(false);
    //         setWalletConfirmation(false);
    //         showGlobalSnackbar({
    //             message: 'Failed to Transfer Token',
    //             severity: 'error',
    //             details: error.message,
    //         });
    //         return false;
    //     }
    // };

    const getStoredTransactions = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    };

    const saveTransactionsToStorage = (transactions) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    const saveFailedTransaction = (txData) => {
        const pendingTransactions = getStoredTransactions();
        const newTransaction = {
            ...txData,
            retryCount: 0,
            timestamp: Date.now(),
        };

        saveTransactionsToStorage([...pendingTransactions, newTransaction]);
        return startPolling();
    };

    const handleTransferV2 = async (priorityFee?: number) => {
        setWalletConfirmation(true);
        try {
            const fee =
                kaspianoCommissionInt > 0 ? Math.max(parseInt(totalPrice) * kaspianoCommissionInt, 0.5) : 0;
            const psktExtraOutput = [{ address: KASPIANO_WALLET, amount: fee }];
            const { txJsonString, sendCommitTxId } = await createOrderKRC20(
                tokenInfo.ticker,
                parseInt(tokenAmount),
                parseInt(totalPrice),
                psktExtraOutput,
                priorityFee,
            );
            const parse = JSON.parse(txJsonString);
            console.log(parse);
            if (txJsonString || sendCommitTxId) {
                try {
                    const res = await createSellOrderV2(
                        tokenInfo.ticker,
                        parseInt(tokenAmount),
                        parseInt(totalPrice),
                        parseFloat(pricePerToken),
                        txJsonString,
                    );
                    if (res.status === SellOrderStatusV2.LISTED_FOR_SALE) {
                        showGlobalSnackbar({
                            message: 'Sell order created successfully',
                            severity: 'success',
                            commitId: sendCommitTxId,
                        });
                    }
                    if (res.status === SellOrderStatusV2.PSKT_VERIFICATION_ERROR) {
                        showGlobalSnackbar({
                            message: 'Order not created, PSKT verification failed',
                            severity: 'error',
                        });
                    }
                    // add kasplex valdiation of utxo creation sendcommit
                    setIsDialogOpen(false);
                    setDisableSellButton(false);
                    cleanFields();
                    queryClient.invalidateQueries({ queryKey: ['orders'] });
                    setTimeout(() => {
                        setFinishedSellOrder((prev) => !prev);
                        setWalletConfirmation(false); // Ensures it closes after a slight delay
                    }, 500);

                    return true;
                } catch (error) {
                    saveFailedTransaction({
                        ticker: tokenInfo.ticker,
                        amount: parseInt(tokenAmount),
                        totalPrice: parseInt(totalPrice),
                        pricePerToken: parseFloat(pricePerToken),
                        txJsonString,
                        sendCommitTxId,
                    });
                    setIsDialogOpen(false);
                    setDisableSellButton(false);
                    cleanFields();
                    setTimeout(() => {
                        setFinishedSellOrder((prev) => !prev);
                        setWalletConfirmation(false); // Ensures it closes after a slight delay
                    }, 500);
                    showGlobalSnackbar({
                        message: 'Sell order Failed, it will be created in the background',
                        severity: 'warning',
                    });
                    return false;
                }
            } else {
                showGlobalSnackbar({
                    message: 'Failed to create sell order',
                    severity: 'error',
                });
                return false;
            }
        } catch (error) {
            setWalletConfirmation(false);
            showGlobalSnackbar({
                message: 'Failed to Transfer Token',
                severity: 'error',
                details: error.message,
            });
            return false;
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setDisableSellButton(false);
    };

    const currencyAdornment = (
        <InputAdornment position="end">
            <IconButton
                onClick={handleCurrencyToggle}
                sx={{
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                    '&:hover': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }}
                disableRipple
                disableFocusRipple
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 0.1 }}>
                        {priceCurrency === 'KAS' ? 'KAS' : 'USD'}
                    </Typography>
                    <SwapHoriz fontSize="small" />
                </Box>
            </IconButton>
        </InputAdornment>
    );

    const buttons = (
        <Tooltip
            title="The USD price will be rounded to the nearest whole Kaspa (KAS) number based on the specified percentage"
            placement="top"
            open={showButtonsTooltip}
            disableHoverListener
            onMouseEnter={() => setShowButtonsTooltip(true)}
            onMouseLeave={() => setShowButtonsTooltip(false)}
        >
            <Box sx={{ display: 'flex', gap: '0.3rem', mb: '0.5rem', justifyContent: 'center' }}>
                <StyledButton
                    disabled={!tokenInfo.price}
                    onClick={() => handleSetPricePerToken(1)}
                    variant="contained"
                >
                    Floor
                </StyledButton>
                <StyledButton
                    disabled={!tokenInfo.price}
                    onClick={() => handleSetPricePerToken(1.01)}
                    variant="contained"
                >
                    +1%
                </StyledButton>
                <StyledButton
                    disabled={!tokenInfo.price}
                    onClick={() => handleSetPricePerToken(1.05)}
                    variant="contained"
                >
                    +5%
                </StyledButton>
                <StyledButton
                    disabled={!tokenInfo.price}
                    onClick={() => handleSetPricePerToken(1.1)}
                    variant="contained"
                >
                    +10%
                </StyledButton>
            </Box>
        </Tooltip>
    );
    const formatPrice = (value) => {
        const num = parseFloat(value);

        // Fix the number to 10 decimal places, then remove unnecessary trailing zeros
        return num.toFixed(10).replace(/\.?0+$/, '');
    };

    return (
        <>
            <StyledSellPanel>
                {buttons}
                <StyledTextField
                    label="Token Amount"
                    value={tokenAmount}
                    onChange={handleTokenAmountChange}
                    fullWidth
                    error={!!amountError}
                    helperText={amountError}
                />

                <Tooltip
                    title={
                        priceCurrency === 'KAS'
                            ? 'Must be a whole number'
                            : 'The USD price will be rounded to the nearest whole Kaspa (KAS) number'
                    }
                    placement="top"
                    open={showInputTooltip}
                    disableHoverListener
                    onMouseEnter={() => setShowInputTooltip(true)}
                    onMouseLeave={() => setShowInputTooltip(false)}
                >
                    <StyledTextField
                        label={`Total Price (${priceCurrency})`}
                        value={totalPrice}
                        onChange={handleTotalPriceChange}
                        fullWidth
                        InputProps={{
                            endAdornment: currencyAdornment,
                        }}
                        error={!!pricePerTokenError}
                        helperText={pricePerTokenError}
                    />
                </Tooltip>
                <StyledTextField
                    label={`Price per Token (${priceCurrency})`}
                    value={pricePerToken ? formatPrice(pricePerToken) : ''}
                    // onChange={handlePricePerTokenChange}
                    disabled={true}
                    fullWidth
                    InputProps={{
                        endAdornment: currencyAdornment,
                    }}
                />
                {isPriceFromButton && priceDifference < -1 && pricePerToken !== '' && tokenInfo.price !== 0 ? (
                    <Typography variant="body2" sx={{ ml: '0.15rem', color: '#f44336' }}>
                        The current token amount is too low. Please add more tokens to ensure accurate total price
                        calculations.
                    </Typography>
                ) : (
                    pricePerToken !== '' &&
                    tokenInfo.price !== 0 && (
                        <Typography variant="body2" sx={{ ml: '0.15rem' }}>
                            {'Price per token is '}
                            <Typography
                                component="span"
                                sx={{
                                    fontWeight: 'bold',
                                    color: priceDifference > 0 ? '#4caf50' : '#f44336',
                                }}
                            >
                                {priceDifference > 0 ? '+' : ''}
                                {priceDifference.toFixed(2)}%
                            </Typography>
                            {' compared to the floor price.'}
                        </Typography>
                    )
                )}
                <Box
                    sx={{
                        mt: '0.5rem',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '0.2rem',
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '0.8rem', ml: '0.15rem' }}>
                        Wallet Balance:
                    </Typography>
                    <Typography
                        sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                        variant="body2"
                    >{`${walletTickerBalance} ${tokenInfo.ticker}`}</Typography>
                </Box>

                <Tooltip
                    title={
                        !walletConnected
                            ? 'Connect your wallet to create a sell order'
                            : walletTickerBalance === 0
                              ? 'You do not have enough tokens to create a sell order'
                              : disableSellButton
                                ? 'Creating Your Sell Order...'
                                : ''
                    }
                >
                    <span style={{ marginTop: 'auto' }}>
                        {/* Wrapping in a <span> to avoid Tooltip being disabled when the button is disabled */}
                        <StyledButton
                            sx={{ marginTop: 'auto' }}
                            variant="contained"
                            onClick={handleCreateSellOrder}
                            fullWidth
                            disabled={!walletConnected || walletTickerBalance === 0 || disableSellButton}
                        >
                            {disableSellButton ? 'Creating Your Sell Order...' : 'Create Sell Order'}
                        </StyledButton>
                    </span>
                </Tooltip>
            </StyledSellPanel>
            <ConfirmSellDialog
                waitingForWalletConfirmation={walletConfirmation}
                open={isDialogOpen}
                onClose={handleCloseDialog}
                onConfirm={handleTransferV2}
                ticker={tokenInfo.ticker}
                tokenAmount={tokenAmount}
                totalPrice={totalPrice}
                pricePerToken={pricePerToken}
                priceCurrency={priceCurrency}
            />
        </>
    );
};

export default SellPanel;
