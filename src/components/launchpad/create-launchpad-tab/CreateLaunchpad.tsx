import { FC, useState } from 'react';
import { TextField, Tooltip, IconButton, Box, Button } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { createLunchpadOrder } from '../../../DAL/BackendLunchpadDAL';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';

const CreateLaunchpadForm: FC = () => {
    const [ticker, setTicker] = useState('');
    const [kasPerBatch, setKasPerBatch] = useState('');
    const [tokensPerBatch, setTokensPerBatch] = useState('');
    const [maxFeeRate, setMaxFeeRate] = useState('');
    const [minBatches, setMinBatches] = useState('');
    const [maxBatches, setMaxBatches] = useState('');
    const [errors, setErrors] = useState({
        ticker: '',
        kasPerBatch: '',
        tokensPerBatch: '',
    });
    const validateField = (field, value) => {
        let error = '';
        if (field === 'ticker' && (!value || value.length < 4 || value.length > 6)) {
            error = 'Ticker must be 4-6 characters.';
        }
        if (field === 'kasPerBatch' && (!value || isNaN(Number(value)))) {
            error = 'Kas per batch is required and must be a number.';
        }
        if (field === 'tokensPerBatch' && (!value || isNaN(Number(value)))) {
            error = 'Tokens per batch is required and must be a number.';
        }
        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleSubmit = async () => {
        validateField('ticker', ticker);
        validateField('kasPerBatch', kasPerBatch);
        validateField('tokensPerBatch', tokensPerBatch);
        if (!Object.values(errors).some((error) => error)) {
            try {
                await createLunchpadOrder({
                    ticker,
                    kasPerUnit: Number(kasPerBatch),
                    tokenPerUnit: Number(tokensPerBatch),
                    maxFeeRatePerTransaction: Number(maxFeeRate),
                    minUnitsPerOrder: minBatches ? Number(minBatches) : undefined,
                    maxUnitsPerOrder: maxBatches ? Number(maxBatches) : undefined,
                });
            } catch (error) {
                showGlobalSnackbar({ message: 'Failed to create launchpad order.', severity: 'error' });
            }
        }
    };

    return (
        <Box sx={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Ticker"
                fullWidth
                value={ticker}
                onChange={(e) => {
                    setTicker(e.target.value);
                    validateField('ticker', e.target.value);
                }}
                placeholder="e.g., KASP"
                InputProps={{
                    endAdornment: (
                        <Tooltip title="Ticker or Token Symbol must be 4-6 characters, representing the token name (e.g., KASP).">
                            <IconButton>
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ),
                }}
                error={!!errors.ticker}
                helperText={errors.ticker}
            />
            <TextField
                label="Kas Per Batch"
                fullWidth
                value={kasPerBatch}
                onChange={(e) => {
                    setKasPerBatch(e.target.value);
                    validateField('kasPerBatch', e.target.value);
                }}
                placeholder="Amount of Kas per Batch"
                InputProps={{
                    endAdornment: (
                        <Tooltip title="The Kas amount required per batch of tokens. For example, if each batch contains 1,000 tokens and costs 1 Kas, then 1,000 tokens are purchased for 1 Kas.">
                            <IconButton>
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ),
                }}
                error={!!errors.kasPerBatch}
                helperText={errors.kasPerBatch}
            />
            <TextField
                label="Tokens Per Batch"
                fullWidth
                value={tokensPerBatch}
                onChange={(e) => {
                    setTokensPerBatch(e.target.value);
                    validateField('tokenPerBatch', e.target.value);
                }}
                placeholder="Number of tokens per batch"
                InputProps={{
                    endAdornment: (
                        <Tooltip title="The number of tokens included in each batch. Buyers receive this amount of tokens with each batch they purchase.">
                            <IconButton>
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ),
                }}
                error={!!errors.tokensPerBatch}
                helperText={errors.tokensPerBatch}
            />
            <TextField
                label="Max Gas Fee Per Transaction"
                fullWidth
                value={maxFeeRate}
                onChange={(e) => setMaxFeeRate(e.target.value)}
                placeholder="Optional"
                InputProps={{
                    endAdornment: (
                        <Tooltip title="Optional. The highest transaction fee percentage the creator is willing to pay for the launchpad transactions.">
                            <IconButton>
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ),
                }}
            />
            <TextField
                label="Min Batches Per Order"
                fullWidth
                value={minBatches}
                onChange={(e) => setMinBatches(e.target.value)}
                placeholder="Minimum batches per order"
                InputProps={{
                    endAdornment: (
                        <Tooltip title="The minimum number of batches a buyer can purchase in one transaction.">
                            <IconButton>
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ),
                }}
            />
            <TextField
                label="Max Batches Per Order"
                fullWidth
                value={maxBatches}
                onChange={(e) => setMaxBatches(e.target.value)}
                placeholder="Maximum batches per order"
                InputProps={{
                    endAdornment: (
                        <Tooltip title="The maximum number of batches a buyer can purchase in one transaction.">
                            <IconButton>
                                <InfoOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ),
                }}
            />
            <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ marginTop: 2 }}>
                Submit
            </Button>
        </Box>
    );
};

export default CreateLaunchpadForm;
