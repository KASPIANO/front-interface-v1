import { FC, useEffect, useState } from 'react';
import {
    TextField,
    Tooltip,
    IconButton,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLaunchpad } from '../../../DAL/BackendLunchpadDAL';

interface CreateLaunchpadFormProps {
    walletConnected: boolean;
}

const CreateLaunchpadForm: FC<CreateLaunchpadFormProps> = (props) => {
    const { walletConnected } = props;
    const [ticker, setTicker] = useState('');
    const [kasPerBatch, setKasPerBatch] = useState('');
    const [tokensPerBatch, setTokensPerBatch] = useState('');
    const [maxFeeRate, setMaxFeeRate] = useState('');
    const [minBatches, setMinBatches] = useState('');
    const [maxBatches, setMaxBatches] = useState('');
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({
        ticker: '',
        kasPerBatch: '',
        tokensPerBatch: '',
    });

    const handleClose = () => {
        setOpen(false);
    };

    const queryClient = useQueryClient();

    const createLaunchpadMutation = useMutation({
        mutationFn: createLaunchpad,
        onSuccess: () => {
            showGlobalSnackbar({ message: 'Launchpad order created.', severity: 'success' });
            cleanFields();
            queryClient.invalidateQueries({ queryKey: ['launchpads'] });
        },
        onError: () => {
            showGlobalSnackbar({ message: 'Failed to create launchpad order.', severity: 'error' });
        },
    });

    useEffect(() => {
        if (createLaunchpadMutation.isSuccess) {
            setOpen(true);
        }
    }, [createLaunchpadMutation.isSuccess]);

    const validateField = (field, value) => {
        let error = '';

        if (field === 'ticker') {
            if (!value || value.length < 4 || value.length > 6 || !/^[A-Za-z]+$/.test(value)) {
                error = 'Ticker must be 4-6 letters only.';
            }
        }

        if (field === 'kasPerBatch') {
            if (!value || isNaN(Number(value))) {
                error = 'Kas per batch is required and must be a number.';
            }
        }

        if (field === 'tokensPerBatch') {
            if (!value || isNaN(Number(value))) {
                error = 'Tokens per batch is required and must be a number.';
            }
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
        return error;
    };

    const handleSubmit = () => {
        const errors = {
            ticker: validateField('ticker', ticker),
            kasPerBatch: validateField('kasPerBatch', kasPerBatch),
            tokensPerBatch: validateField('tokensPerBatch', tokensPerBatch),
        };

        // Check if any error messages are present
        const hasErrors = Object.values(errors).some((error) => error);

        if (!hasErrors) {
            createLaunchpadMutation.mutate({
                ticker: ticker.toUpperCase(),
                kasPerUnit: Number(kasPerBatch),
                tokenPerUnit: Number(tokensPerBatch),
                maxFeeRatePerTransaction: maxFeeRate ? Number(maxFeeRate) : undefined,
                minUnitsPerOrder: Number(minBatches),
                maxUnitsPerOrder: Number(maxBatches),
            });
        }
    };

    const cleanFields = () => {
        setTicker('');
        setKasPerBatch('');
        setTokensPerBatch('');
        setMaxFeeRate('');
        setMinBatches('');
        setMaxBatches('');
        setErrors({
            ticker: '',
            kasPerBatch: '',
            tokensPerBatch: '',
        });
    };

    return (
        <Box sx={{ padding: '30px 60px', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                        <Tooltip title="Optional. The transaction fee the creator is willing to pay for the each launchpad transaction.">
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
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                disabled={createLaunchpadMutation.isPending || !walletConnected}
            >
                {!walletConnected
                    ? 'Connect Wallet to create launchpad'
                    : createLaunchpadMutation.isPending
                      ? 'Creating Launchpad...'
                      : 'Submit'}
            </Button>
            {createLaunchpadMutation.isSuccess && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Success!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Launchpad created successfully! You can proceed to the "My Launchpads" tab to continue
                            the process.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default CreateLaunchpadForm;
