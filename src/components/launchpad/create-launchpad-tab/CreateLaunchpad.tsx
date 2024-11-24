import { FC, useState } from 'react';
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
    Grid,
    Typography,
    FormControlLabel,
    Switch,
    Input,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLaunchpad } from '../../../DAL/BackendLunchpadDAL';
import { parse } from 'papaparse'; // For CSV parsing
import FileDownloadIconRounded from '@mui/icons-material/FileDownloadRounded';

interface CreateLaunchpadFormProps {
    walletConnected: boolean;
}

const CreateLaunchpadForm: FC<CreateLaunchpadFormProps> = ({ walletConnected }) => {
    const [ticker, setTicker] = useState('');
    const [kasPerBatch, setKasPerBatch] = useState('');
    const [tokensPerBatch, setTokensPerBatch] = useState('');
    const [maxFeeRate, setMaxFeeRate] = useState('');
    const [minBatches, setMinBatches] = useState('');
    const [maxBatches, setMaxBatches] = useState('');
    const [limitPerWallet, setLimitPerWallet] = useState('');
    const [whitelistEnabled, setWhitelistEnabled] = useState(false);
    const [open, setOpen] = useState(false);
    const [recipientList, setRecipientList] = useState([]);
    const [csvLoading, setCsvLoading] = useState(false);

    const [errors, setErrors] = useState({
        ticker: '',
        kasPerBatch: '',
        tokensPerBatch: '',
    });

    const handleToggleWhitelist = () => {
        setWhitelistEnabled((prev) => !prev);
        setRecipientList([]); // Clear wallet addresses when toggling
    };

    const queryClient = useQueryClient();

    const createLaunchpadMutation = useMutation({
        mutationFn: createLaunchpad,
        onSuccess: () => {
            showGlobalSnackbar({ message: 'Launchpad created successfully.', severity: 'success' });
            cleanFields();
            queryClient.invalidateQueries({ queryKey: ['launchpads'] });
        },
        onError: () => {
            showGlobalSnackbar({ message: 'Failed to create launchpad.', severity: 'error' });
        },
    });

    const validateField = (field: string, value: string) => {
        let error = '';
        if (field === 'ticker' && (!value || value.length < 4 || value.length > 6 || !/^[A-Za-z]+$/.test(value))) {
            error = 'Ticker must be 4-6 letters only.';
        }
        if ((field === 'kasPerBatch' || field === 'tokensPerBatch') && (!value || isNaN(Number(value)))) {
            error = `${field} is required and must be a number.`;
        }
        setErrors((prev) => ({ ...prev, [field]: error }));
        return error;
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        setCsvLoading(true);
        reader.onload = (event) => {
            const csvText = event.target?.result?.toString();
            if (csvText) {
                parse(csvText, {
                    header: true,
                    transformHeader: (header) => header.trim(),
                    complete: (results) => {
                        const list = results.data
                            .filter((row: any) => row.address?.trim()) // Ensure rows have a valid address
                            .map((row: any) => ({ address: row.address.trim() })); // Map valid rows to an array of objects

                        if (list.length === 0) {
                            alert('No valid addresses found in the CSV file.');
                            setCsvLoading(false);
                            return;
                        }

                        setRecipientList(list); // Update recipient list with the parsed addresses
                        setCsvLoading(false);
                    },
                });
            }
        };
        reader.readAsText(file);
    };

    const handleCleanWalletList = () => {
        setRecipientList([]);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/example_whitelist_csv.csv';
        link.download = 'example_whitelist.csv';
        link.type = 'text/csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = () => {
        const errors = {
            ticker: validateField('ticker', ticker),
            kasPerBatch: validateField('kasPerBatch', kasPerBatch),
            tokensPerBatch: validateField('tokensPerBatch', tokensPerBatch),
        };

        if (Object.values(errors).every((error) => !error)) {
            createLaunchpadMutation.mutate({
                ticker: ticker.toUpperCase(),
                kasPerUnit: Number(kasPerBatch),
                tokenPerUnit: Number(tokensPerBatch),
                maxFeeRatePerTransaction: maxFeeRate ? Number(maxFeeRate) : undefined,
                minUnitsPerOrder: minBatches ? Number(minBatches) : undefined,
                maxUnitsPerOrder: maxBatches ? Number(maxBatches) : undefined,
                maxUnitsPerWallet: limitPerWallet ? Number(limitPerWallet) : undefined,
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
        setLimitPerWallet('');
        setErrors({ ticker: '', kasPerBatch: '', tokensPerBatch: '' });
    };

    return (
        <Box sx={{ padding: '30px', width: '100%' }}>
            <Typography variant="h5" sx={{ marginBottom: 3 }}>
                Create Launchpad
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
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
                                <Tooltip title="Ticker must be 4-6 characters representing the token name (e.g., KASP).">
                                    <IconButton>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ),
                        }}
                        error={!!errors.ticker}
                        helperText={errors.ticker}
                    />
                </Grid>
                <Grid item xs={6}>
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
                                <Tooltip title="Amount of Kas required per batch of tokens.">
                                    <IconButton>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ),
                        }}
                        error={!!errors.kasPerBatch}
                        helperText={errors.kasPerBatch}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Tokens Per Batch"
                        fullWidth
                        value={tokensPerBatch}
                        onChange={(e) => {
                            setTokensPerBatch(e.target.value);
                            validateField('tokensPerBatch', e.target.value);
                        }}
                        placeholder="Number of Tokens per Batch"
                        InputProps={{
                            endAdornment: (
                                <Tooltip title="Number of tokens included in each batch.">
                                    <IconButton>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ),
                        }}
                        error={!!errors.tokensPerBatch}
                        helperText={errors.tokensPerBatch}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Max Gas Fee Per Transaction"
                        fullWidth
                        value={maxFeeRate}
                        onChange={(e) => setMaxFeeRate(e.target.value)}
                        placeholder="Optional"
                        InputProps={{
                            endAdornment: (
                                <Tooltip title="Optional transaction fee for each launchpad transaction.">
                                    <IconButton>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Min Batches Per Order"
                        fullWidth
                        value={minBatches}
                        onChange={(e) => setMinBatches(e.target.value)}
                        placeholder="Minimum batches per order"
                        InputProps={{
                            endAdornment: (
                                <Tooltip title="Minimum number of batches a buyer can purchase in one transaction.">
                                    <IconButton>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Max Batches Per Order"
                        fullWidth
                        value={maxBatches}
                        onChange={(e) => setMaxBatches(e.target.value)}
                        placeholder="Maximum batches per order"
                        InputProps={{
                            endAdornment: (
                                <Tooltip title="Maximum number of batches a buyer can purchase in one transaction.">
                                    <IconButton>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Limit Batches Per Wallet"
                        fullWidth
                        value={maxBatches}
                        onChange={(e) => setMaxBatches(e.target.value)}
                        placeholder="Limit Batches Per Wallet"
                        InputProps={{
                            endAdornment: (
                                <Tooltip title="Maximum number of Mints/Batches/Purchases a single Wallet can do.">
                                    <IconButton>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Limit Batches Per Wallet"
                        fullWidth
                        value={maxBatches}
                        onChange={(e) => setMaxBatches(e.target.value)}
                        placeholder="Limit Batches Per Wallet"
                        InputProps={{
                            endAdornment: (
                                <Tooltip title="Maximum number of Mints/Batches/Purchases a single Wallet can do.">
                                    <IconButton>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Tooltip title="Enable whitelist to restrict purchases to specific wallet addresses.">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={whitelistEnabled}
                                    onChange={handleToggleWhitelist}
                                    color="primary"
                                />
                            }
                            label="Whitelist"
                            labelPlacement="start"
                        />
                    </Tooltip>
                </Grid>
                <Grid item xs={6}>
                    {whitelistEnabled && (
                        <Box sx={{ marginTop: '20px' }}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Manage Wallet Addresses
                            </Typography>
                            <Box sx={{ marginBottom: '1.3vh' }}>
                                <Typography variant="body2">Upload a CSV File:</Typography>
                                <label>
                                    <Input
                                        disabled={csvLoading || recipientList.length > 0}
                                        sx={{ display: 'none' }}
                                        inputProps={{ accept: '.csv' }}
                                        type="file"
                                        onChange={handleCSVUpload}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="span"
                                        disabled={csvLoading || recipientList.length > 0}
                                        sx={{ marginRight: '10px' }}
                                    >
                                        {csvLoading ? 'Processing Addresses...' : 'Choose File'}
                                    </Button>
                                </label>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                    onClick={handleCleanWalletList}
                                    disabled={recipientList.length === 0}
                                >
                                    Clear Wallet Address List
                                </Button>
                                <Typography variant="caption" sx={{ marginTop: '5px', display: 'block' }}>
                                    CSV format: One column header named "address" with wallet addresses in each
                                    row.
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                startIcon={<FileDownloadIconRounded />}
                                onClick={handleDownload}
                                sx={{ textTransform: 'none' }}
                            >
                                Download example CSV
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Grid>
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                sx={{ marginTop: 3 }}
                disabled={createLaunchpadMutation.isPending || !walletConnected}
                fullWidth
            >
                {!walletConnected
                    ? 'Connect Wallet to create launchpad'
                    : createLaunchpadMutation.isPending
                      ? 'Creating Launchpad...'
                      : 'Submit'}
            </Button>
            {createLaunchpadMutation.isSuccess && (
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Success!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Launchpad created successfully! You can proceed to the "My Launchpads" tab to continue
                            the process.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default CreateLaunchpadForm;
