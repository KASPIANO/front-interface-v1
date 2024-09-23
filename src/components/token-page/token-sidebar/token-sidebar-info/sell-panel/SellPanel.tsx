import React, { useState, useEffect } from 'react';
import { Box, IconButton, InputAdornment, Typography } from '@mui/material';
import { BackendTokenResponse } from '../../../../../types/Types';
import { StyledButton, StyledSellPanel, StyledTextField } from './SellPanel.s';
import { fetchWalletKRC20Balance } from '../../../../../DAL/Krc20DAL';
import { SwapHoriz } from '@mui/icons-material'; // MUI icon for swap

interface SellPanelProps {
    tokenInfo: BackendTokenResponse;
    kasPrice: number;
    walletAddress: string | null;
}

const SellPanel: React.FC<SellPanelProps> = (props) => {
    const { tokenInfo, kasPrice, walletAddress } = props;
    const [tokenAmount, setTokenAmount] = useState<string>(''); // Changed to string
    const [totalPrice, setTotalPrice] = useState<string>(''); // Changed to string
    const [pricePerToken, setPricePerToken] = useState<string>(''); // Changed to string
    const [priceDifference, setPriceDifference] = useState<number>(0);
    const [walletTickerBalance, setWalletTickerBalance] = useState<number>(0);
    const [priceCurrency, setPriceCurrency] = useState<'KAS' | 'USD'>('KAS');

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
        const amount = parseInt(tokenAmount);

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
        const newPricePerTokenValue = tokenInfo.price * multiplier;
        setPricePerToken(newPricePerTokenValue.toString());

        const amount = parseInt(tokenAmount);
        if (!isNaN(amount) && amount > 0) {
            const newTotalPrice = newPricePerTokenValue * amount;
            setTotalPrice(newTotalPrice.toString());
        }
    };

    const handleCurrencyToggle = () => {
        if (priceCurrency === 'KAS') {
            // Convert prices to USD
            setPriceCurrency('USD');
            if (pricePerToken !== '') {
                const pricePerTokenValue = parseFloat(pricePerToken);
                const priceInUSD = pricePerTokenValue * kasPrice;
                setPricePerToken(priceInUSD.toFixed(2));
            }
            if (totalPrice !== '') {
                const totalPriceValue = parseFloat(totalPrice);
                const totalInUSD = totalPriceValue * kasPrice;
                setTotalPrice(totalInUSD.toFixed(2));
            }
        } else {
            // Convert prices back to KAS
            setPriceCurrency('KAS');
            if (pricePerToken !== '') {
                const pricePerTokenValue = parseFloat(pricePerToken);
                const priceInKAS = pricePerTokenValue / kasPrice;
                setPricePerToken(priceInKAS.toString());
            }
            if (totalPrice !== '') {
                const totalPriceValue = parseFloat(totalPrice);
                const totalInKAS = totalPriceValue / kasPrice;
                setTotalPrice(totalInKAS.toString());
            }
        }
    };

    const handleCreateSellOrder = () => {
        const amount = parseInt(tokenAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid token amount.');
            return;
        }
        if (amount > walletTickerBalance) {
            alert('Token amount exceeds your balance.');
            return;
        }
        // Proceed with creating the sell order
        // Implement the logic to create the sell order here
        alert('Sell order created successfully.');
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
        <Box sx={{ display: 'flex', gap: '0.3rem', mb: '0.5rem' }}>
            <StyledButton onClick={() => handleSetPricePerToken(1)} variant="contained">
                Floor
            </StyledButton>
            <StyledButton onClick={() => handleSetPricePerToken(1.01)} variant="contained">
                +1%
            </StyledButton>
            <StyledButton onClick={() => handleSetPricePerToken(1.05)} variant="contained">
                +5%
            </StyledButton>
            <StyledButton onClick={() => handleSetPricePerToken(1.1)} variant="contained">
                +10%
            </StyledButton>
        </Box>
    );
    return (
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
            <Box sx={{ mb: '0.5rem' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                    Wallet Balance:
                </Typography>
                <Typography
                    sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                    variant="body2"
                >{`${walletTickerBalance} ${tokenInfo.ticker}`}</Typography>
            </Box>

            <StyledButton sx={{ marginTop: 'auto' }} variant="contained" onClick={handleCreateSellOrder} fullWidth>
                Create Sell Order
            </StyledButton>
            {pricePerToken !== '' && (
                <Typography variant="body2">
                    {`Price per token is ${priceDifference > 0 ? '+' : ''}${priceDifference.toFixed(2)}% compared to the floor price.`}
                </Typography>
            )}
        </StyledSellPanel>
    );
};

export default SellPanel;
