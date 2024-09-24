import React, { useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';
import { Order } from '../../../../../../types/Types';
import { showGlobalSnackbar } from '../../../../../alert-context/AlertContext';

interface OrderDetailsProps {
    order: Order;
    walletConnected: boolean;
    walletBalance: number;
    kasPrice: number;
}

const OrderDetails: React.FC<OrderDetailsProps> = (props) => {
    const { order, walletConnected, walletBalance, kasPrice } = props;
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    // Fee Calculations
    const marketplaceFeePercentage = 0.02; // 2%
    const marketplaceFee = order.totalPrice * marketplaceFeePercentage;
    const networkFee = 0.1; // Fixed network fee
    const finalTotal = order.totalPrice + marketplaceFee + networkFee;

    const handlePurchase = () => {
        if (!agreeToTerms) {
            showGlobalSnackbar({
                message: 'Please agree to the terms of service to proceed with the purchase',
                severity: 'error',
            });
            return;
        }

        // Proceed with the purchase
        // Implement the logic to handle the purchase here
        showGlobalSnackbar({
            message: 'Purchase successful!',
            severity: 'success',
        });
    };

    return (
        <Box sx={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1">
                Total Token Price: {order.totalPrice.toFixed(2)} KAS{' '}
                <Typography variant="body2" color="textSecondary" component="span">
                    (${(order.totalPrice * kasPrice).toFixed(2)})
                </Typography>
            </Typography>
            <Typography variant="body1">
                Marketplace Fee: {marketplaceFee.toFixed(2)} KAS{' '}
                <Typography variant="body2" color="textSecondary" component="span">
                    (${(marketplaceFee * kasPrice).toFixed(2)})
                </Typography>
            </Typography>
            <Typography variant="body1">
                Network Fee: {networkFee.toFixed(2)} KAS{' '}
                <Typography variant="body2" color="textSecondary" component="span">
                    (${(networkFee * kasPrice).toFixed(2)})
                </Typography>
            </Typography>
            <Typography variant="h6">
                Final Total: {finalTotal.toFixed(2)} KAS{' '}
                <Typography variant="body2" color="textSecondary" component="span">
                    (${(finalTotal * kasPrice).toFixed(2)})
                </Typography>
            </Typography>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        color="primary"
                    />
                }
                label="I agree to the Kaspiano Terms of Service"
            />

            <Button
                variant="contained"
                color="primary"
                onClick={handlePurchase}
                disabled={!agreeToTerms || !walletConnected || walletBalance < finalTotal}
                sx={{ marginTop: '1rem' }}
            >
                Confirm Purchase
            </Button>
        </Box>
    );
};

export default OrderDetails;
