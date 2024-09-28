import React, { useState, useEffect } from 'react';
import { Box, IconButton, InputAdornment, Typography } from '@mui/material';
import { BackendTokenResponse, TransferObj } from '../../../../../types/Types';
import { StyledButton, StyledSellPanel, StyledTextField } from './SellPanel.s';
import { fetchWalletKRC20Balance } from '../../../../../DAL/Krc20DAL';
import { SwapHoriz } from '@mui/icons-material'; // MUI icon for swap
import { showGlobalSnackbar } from '../../../../alert-context/AlertContext';
import ConfirmSellDialog from './confirm-sell-dialog/ConfirmSellDialog';
import { transferKRC20Token } from '../../../../../utils/KaswareUtils';
import { confirmSellOrder, createSellOrder } from '../../../../../DAL/BackendP2PDAL';
import { doPolling } from '../../../../../utils/Utils';

interface SellPanelProps {
    tokenInfo: BackendTokenResponse;
    kasPrice: number;
    walletAddress: string | null;
    walletConnected;
}

const KASPA_TO_SOMPI = 100000000;

const SellPanel: React.FC<SellPanelProps> = (props) => {
    const { tokenInfo, kasPrice, walletAddress, walletConnected } = props;
    const [tokenAmount, setTokenAmount] = useState<string>(''); // Changed to string
    const [totalPrice, setTotalPrice] = useState<string>(''); // Changed to string
    const [pricePerToken, setPricePerToken] = useState<string>(''); // Changed to string
    const [priceDifference, setPriceDifference] = useState<number>(0);
    const [walletTickerBalance, setWalletTickerBalance] = useState<number>(0);
    const [priceCurrency, setPriceCurrency] = useState<'KAS' | 'USD'>('KAS');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // Dialog state
    const [walletConfirmation, setWalletConfirmation] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string>('');
    const [tempWalletAddress, setTempWalletAddress] = useState<string>('');
    const [creatingSellOrder, setCreatingSellOrder] = useState<boolean>(false);

    useEffect(() => {
        fetchWalletKRC20Balance(walletAddress, tokenInfo.ticker).then((balance) => {
            setWalletTickerBalance(balance);
        });
    }, [walletAddress, tokenInfo.ticker]);

    const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amountStr = e.target.value;
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
                setTotalPrice(newTotalPrice.toString());
            }
        } else {
            setPricePerToken('');
            setTotalPrice('');
        }
    };

    // Handle changes in total price
    const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const priceStr = e.target.value;
        setTotalPrice(priceStr);

        const total = parseFloat(priceStr);
        const amount = parseInt(tokenAmount);

        if (!isNaN(total)) {
            if (!isNaN(amount) && amount > 0) {
                setPricePerToken((total / amount).toString());
            }
        } else {
            setPricePerToken('');
        }
    };

    const handlePricePerTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const priceStr = e.target.value;
        setPricePerToken(priceStr);

        const pricePerTokenValue = parseFloat(priceStr);
        const amount = parseFloat(tokenAmount);

        if (!isNaN(pricePerTokenValue)) {
            if (!isNaN(amount) && amount > 0) {
                const newTotalPrice = pricePerTokenValue * amount;
                setTotalPrice(newTotalPrice.toString());
            }
        } else {
            setTotalPrice('');
        }
    };

    useEffect(() => {
        const pricePerTokenValue = parseFloat(pricePerToken);
        if (!isNaN(pricePerTokenValue) && tokenInfo.price) {
            const diff = ((pricePerTokenValue - tokenInfo.price) / tokenInfo.price) * 100;
            setPriceDifference(diff);
        } else {
            setPriceDifference(0);
        }
    }, [pricePerToken, tokenInfo.price]);

    const handleSetPricePerToken = (multiplier: number) => {
        if (!tokenInfo.price) {
            showGlobalSnackbar({ message: 'No Token Floor Price Exists', severity: 'error' });
            return;
        }
        const newPricePerTokenValue = tokenInfo.price * multiplier;
        const roundedPricePerToken = roundUp(newPricePerTokenValue, 8);
        setPricePerToken(roundedPricePerToken.toString());

        const amount = parseInt(tokenAmount);
        if (!isNaN(amount) && amount > 0) {
            const newTotalPrice = newPricePerTokenValue * amount;
            const roundedTotalPrice = roundUp(newTotalPrice, 8);
            setTotalPrice(roundedTotalPrice.toString());
        }
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
                setPricePerToken(priceInUSD.toString());
            }
            if (totalPrice !== '') {
                const totalPriceValue = parseFloat(totalPrice);
                const totalInUSD = totalPriceValue * kasPrice;
                setTotalPrice(totalInUSD.toString());
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
                const roundedTotalInKAS = roundUp(totalInKAS, 8);
                setTotalPrice(roundedTotalInKAS.toString());
            }
        }
    };
    const cleanFields = () => {
        setTokenAmount('');
        setTotalPrice('');
        setPricePerToken('');
    };
    const handleCreateSellOrder = async () => {
        if (!walletConnected) {
            showGlobalSnackbar({ message: 'Please connect your wallet.', severity: 'error' });
            return;
        }
        if (priceCurrency === 'USD') {
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
                const roundedTotalInKAS = roundUp(totalInKAS, 8);
                setTotalPrice(roundedTotalInKAS.toString());
            }
        }

        const amount = parseInt(tokenAmount);
        if (isNaN(amount) || amount <= 0) {
            showGlobalSnackbar({ message: 'Please enter a valid token amount.', severity: 'error' });
            return;
        }
        if (amount > walletTickerBalance) {
            showGlobalSnackbar({ message: 'Insufficient Token balance.', severity: 'error' });
            return;
        }
        if (parseInt(totalPrice) < 25) {
            showGlobalSnackbar({
                message: 'Please enter a valid total price has to be more than 25 KAS',
                severity: 'error',
            });
            return;
        }
        try {
            // Retrieve wallet temp wallert address and order id and set it
            const { id, temporaryWalletAddress } = await createSellOrder(
                tokenInfo.ticker,
                amount,
                parseInt(totalPrice),
                parseFloat(pricePerToken),
                walletAddress,
            );
            setIsDialogOpen(true);
            setOrderId(id);
            setTempWalletAddress(temporaryWalletAddress);
        } catch (error) {
            console.error(error);
            showGlobalSnackbar({
                message: 'Failed to create sell order for the token. Please try again later.',
                severity: 'error',
            });
        }
    };

    const handleTransfer = async () => {
        const inscribeJsonString: TransferObj = {
            p: 'KRC-20',
            op: 'transfer',
            tick: tokenInfo.ticker,
            amt: (parseInt(tokenAmount) * KASPA_TO_SOMPI).toString(),
            to: tempWalletAddress,
        };
        const jsonStringified = JSON.stringify(inscribeJsonString);

        try {
            setWalletConfirmation(true);
            const result = await transferKRC20Token(jsonStringified);
            setWalletConfirmation(false);
            setCreatingSellOrder(true);
            if (result) {
                const { commit, reveal } = JSON.parse(result);

                showGlobalSnackbar({
                    message: 'Token transferred successfully',
                    severity: 'success',
                    commit,
                    reveal,
                });
            }
            const confirmation = await doPolling(
                () => confirmSellOrder(orderId),
                (result) => result.confirmed,
            );

            if (confirmation) {
                showGlobalSnackbar({
                    message: 'Sell order confirmed successfully',
                    severity: 'success',
                });
                setIsDialogOpen(false);
                setCreatingSellOrder(false);
                cleanFields();
                return true;
            } else {
                showGlobalSnackbar({
                    message: 'Failed to confirm sell order',
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
    );
    return (
        <>
            <StyledSellPanel>
                {buttons}
                <StyledTextField
                    label="Token Amount"
                    value={tokenAmount}
                    onChange={handleTokenAmountChange}
                    fullWidth
                />

                <StyledTextField
                    label={`Total Price (${priceCurrency})`}
                    value={totalPrice}
                    onChange={handleTotalPriceChange}
                    fullWidth
                    InputProps={{
                        endAdornment: currencyAdornment,
                    }}
                />
                <StyledTextField
                    label={`Price per Token (${priceCurrency})`}
                    value={pricePerToken}
                    onChange={handlePricePerTokenChange}
                    fullWidth
                    InputProps={{
                        endAdornment: currencyAdornment,
                    }}
                />
                {pricePerToken !== '' && tokenInfo.price && (
                    <Typography variant="body2" sx={{ ml: '0.15rem' }}>
                        {'Price per token is '}
                        <Typography
                            component="span"
                            sx={{ fontWeight: 'bold', color: priceDifference > 0 ? '#4caf50' : '#f44336' }}
                        >
                            {priceDifference > 0 ? '+' : ''}
                            {priceDifference.toFixed(2)}%
                        </Typography>
                        {' compared to the floor price.'}
                    </Typography>
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

                <StyledButton
                    sx={{ marginTop: 'auto' }}
                    variant="contained"
                    onClick={handleCreateSellOrder}
                    fullWidth
                    disabled={!walletConnected || walletTickerBalance === 0}
                >
                    Create Sell Order
                </StyledButton>
            </StyledSellPanel>
            <ConfirmSellDialog
                creatingSellOrder={creatingSellOrder}
                waitingForWalletConfirmation={walletConfirmation}
                open={isDialogOpen}
                onClose={handleCloseDialog}
                onConfirm={handleTransfer}
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
