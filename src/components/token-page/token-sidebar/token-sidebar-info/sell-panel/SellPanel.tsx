import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { BackendTokenResponse } from '../../../../../types/Types';
import { StyledButton, StyledSellPanel, StyledTextField } from './SellPanel.s';

interface SellPanelProps {
    tokenInfo: BackendTokenResponse;
    kasPrice: number;
}

const SellPanel: React.FC<SellPanelProps> = (props) => {
    const { tokenInfo, kasPrice } = props;
    const [tokenAmount, setTokenAmount] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number | null>(null);
    const [pricePerToken, setPricePerToken] = useState<number | null>(null);
    const [priceDifference, setPriceDifference] = useState<number>(0);

    const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amount = parseInt(e.target.value);
        if (!isNaN(amount)) {
            setTokenAmount(amount);
            if (totalPrice !== null && amount > 0) {
                setPricePerToken(totalPrice / amount);
            }
        }
    };

    // Handle changes in total price
    const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = parseFloat(e.target.value);
        if (!isNaN(price)) {
            setTotalPrice(price);
            if (tokenAmount > 0) {
                setPricePerToken(price / tokenAmount);
            }
        }
    };

    // Handle changes in price per token
    const handlePricePerTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const price = parseFloat(e.target.value);
        if (!isNaN(price)) {
            setPricePerToken(price);
            if (tokenAmount > 0) {
                setTotalPrice(price * tokenAmount);
            }
        }
    };

    useEffect(() => {
        if (pricePerToken !== null) {
            const diff = ((pricePerToken - tokenInfo.price) / tokenInfo.price) * 100;
            setPriceDifference(diff);
        }
    }, [pricePerToken, tokenInfo.price]);

    const buttons = (
        <Box sx={{ display: 'flex', gap: '0.3rem', mb: '0.5rem' }}>
            <StyledButton onClick={() => setPricePerToken(tokenInfo.price)} variant="contained">
                Floor
            </StyledButton>
            <StyledButton onClick={() => setPricePerToken(tokenInfo.price * 1.01)} variant="contained">
                +1%
            </StyledButton>
            <StyledButton onClick={() => setPricePerToken(tokenInfo.price * 1.05)} variant="contained">
                +5%
            </StyledButton>
            <StyledButton onClick={() => setPricePerToken(tokenInfo.price * 1.1)} variant="contained">
                +10%
            </StyledButton>
        </Box>
    );
    return (
        <StyledSellPanel>
            {buttons}
            <StyledTextField
                label="Token Amount"
                type="number"
                value={tokenAmount}
                onChange={handleTokenAmountChange}
                fullWidth
            />

            <StyledTextField
                label="Total Price"
                type="number"
                value={totalPrice || ''}
                onChange={handleTotalPriceChange}
                fullWidth
            />

            <StyledTextField
                label="Price per Token"
                type="number"
                value={pricePerToken || ''}
                onChange={handlePricePerTokenChange}
                fullWidth
            />

            {pricePerToken !== null && (
                <Typography variant="body2">
                    {`Price per token is ${priceDifference > 0 ? '+' : ''}${priceDifference.toFixed(2)}% compared to the floor price.`}
                </Typography>
            )}
        </StyledSellPanel>
    );
};

export default SellPanel;
