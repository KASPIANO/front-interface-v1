import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Modal,
    IconButton,
    useTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import {
    useLaunchpadOwnerInfo,
    useRetrieveFunds,
    useStartLaunchpad,
    useStopLaunchpad,
} from '../../../DAL/LaunchPadQueries';
import OpenWithRoundedIcon from '@mui/icons-material/OpenWithRounded';
import { LunchpadWalletType, TransferObj } from '../../../types/Types';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { fetchWalletKRC20Balance } from '../../../DAL/Krc20DAL';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { sendKaspa, transferKRC20Token } from '../../../utils/KaswareUtils';
import { fetchWalletBalance } from '../../../DAL/KaspaApiDal';

type LaunchpadCardProps = {
    ticker: string;
    availabeUnits: number;
    kasPerUnit: number;
    tokenPerUnit: number;
    status: string;
    walletAddress: string;
};

const KASPA_TO_SOMPI = 100000000;

type FundType = 'tokens' | 'gas';

const LaunchpadCard: React.FC<LaunchpadCardProps> = ({
    ticker,
    availabeUnits,
    kasPerUnit,
    tokenPerUnit,
    status,
    walletAddress,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
    const [fundType, setFundType] = useState<FundType>('tokens');
    const [fundAmount, setFundAmount] = useState('');
    const [isFunding, setIsFunding] = useState(false);
    const { data: expandedData, isLoading, error } = useLaunchpadOwnerInfo(ticker);
    const theme = useTheme();
    const startLaunchpadMutation = useStartLaunchpad(ticker);
    const stopLaunchpadMutation = useStopLaunchpad(ticker);
    const retrieveFundsMutation = useRetrieveFunds(ticker);

    const handleStartStop = () => {
        if (expandedData?.lunchpad.status === 'INACTIVE') {
            startLaunchpadMutation.mutate(expandedData.lunchpad.id);
        } else {
            stopLaunchpadMutation.mutate(expandedData.lunchpad.id);
        }
    };

    const handleRetrieveFunds = (walletType: LunchpadWalletType) => {
        retrieveFundsMutation.mutate({ id: expandedData.lunchpad.id, walletType });
    };

    const handleExpand = () => {
        setIsExpanded(true);
    };

    const handleClose = () => {
        setIsExpanded(false);
    };

    const handleOpenFundDialog = (type: FundType) => {
        setFundType(type);
        setIsFundDialogOpen(true);
    };

    const handleCloseFundDialog = () => {
        if (isFunding) return;

        setIsFundDialogOpen(false);
        setFundAmount('');
    };

    const handleFund = async () => {
        if (fundType === 'tokens') {
            handleFundTokens();
        } else {
            handleFundGas();
        }
    };

    const handleFundTokens = async () => {
        const balance = await fetchWalletKRC20Balance(walletAddress, ticker);
        if (Number(fundAmount) > balance) {
            showGlobalSnackbar({ message: 'Insufficient balance', severity: 'error' });
            return;
        }

        setIsFunding(true);
        try {
            const inscribeJsonString: TransferObj = {
                p: 'KRC-20',
                op: 'transfer',
                tick: ticker,
                amt: (parseInt(fundAmount) * KASPA_TO_SOMPI).toString(),
                to: expandedData.lunchpad.senderWalletAddress,
            };
            const jsonStringified = JSON.stringify(inscribeJsonString);
            await transferKRC20Token(jsonStringified);
            showGlobalSnackbar({ message: 'Tokens funded successfully', severity: 'success' });
        } catch (error) {
            console.error('Error funding tokens:', error);
            // Handle error (e.g., show an error message)
        } finally {
            setIsFunding(false);
            handleCloseFundDialog();
        }
    };

    const handleFundGas = async () => {
        const balance = await fetchWalletBalance(walletAddress);
        if (Number(fundAmount) > balance) {
            showGlobalSnackbar({ message: 'Insufficient balance', severity: 'error' });
            return;
        }

        setIsFunding(true);
        try {
            const sompiAmount = parseInt(fundAmount) * KASPA_TO_SOMPI;
            await sendKaspa(expandedData.lunchpad.senderWalletAddress, sompiAmount);
            showGlobalSnackbar({ message: 'Tokens funded successfully', severity: 'success' });
        } catch (error) {
            console.error('Error funding tokens:', error);
            // Handle error (e.g., show an error message)
        } finally {
            setIsFunding(false);
            handleCloseFundDialog();
        }
    };

    const ExpandedView = () => (
        <Modal
            open={isExpanded}
            onClose={handleClose}
            aria-labelledby="expanded-launchpad-modal"
            aria-describedby="expanded-launchpad-description"
        >
            <Box
                sx={{
                    borderRadius: 2,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 900,
                    bgcolor: 'background.paper',
                    border: '1px solid #000',
                    boxShadow: 15,
                    p: 4,
                    borderColor: theme.palette.primary.main,
                    position: 'relative',
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                {isLoading && <Typography>Loading additional details...</Typography>}
                {error && <Typography color="error">Error loading details: {error.message}</Typography>}
                {expandedData && expandedData.success && (
                    <>
                        <Typography variant="h5" component="h2">
                            {expandedData.lunchpad.ticker}
                        </Typography>
                        {/* ... (other Typography components) */}
                        <Typography sx={{ fontSize: '1rem' }}>
                            Round Number: {expandedData.lunchpad.roundNumber}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem' }}>
                            Total Units: {expandedData.lunchpad.totalUnits}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem' }}>
                            Available Units: {expandedData.lunchpad.availabeUnits}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem' }}>
                            KAS per Unit: {expandedData.lunchpad.kasPerUnit}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem' }}>
                            Tokens per Unit: {expandedData.lunchpad.tokenPerUnit}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem' }}>Status: {expandedData.lunchpad.status}</Typography>
                        <Typography sx={{ fontSize: '1rem' }}>
                            Min Units per Order: {expandedData.lunchpad.minUnitsPerOrder || 'N/A'}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem' }}>
                            Max Units per Order: {expandedData.lunchpad.maxUnitsPerOrder || 'N/A'}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem' }}>
                            KRC20 Tokens Amount: {expandedData.lunchpad.krc20TokensAmount || 'N/A'}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem' }}>
                            Required Kaspa: {expandedData.lunchpad.requiredKaspa || 'N/A'}
                        </Typography>
                        <Typography sx={{ fontSize: '1rem' }}>
                            Open Orders: {expandedData.lunchpad.openOrders || 'N/A'}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button
                                sx={{ fontSize: '0.75rem', minWidth: '9rem' }}
                                variant="contained"
                                onClick={handleStartStop}
                                disabled={startLaunchpadMutation.isPending || stopLaunchpadMutation.isPending}
                            >
                                {startLaunchpadMutation.isPending || stopLaunchpadMutation.isPending
                                    ? expandedData.lunchpad.status === 'INACTIVE'
                                        ? 'Starting...'
                                        : 'Stopping...'
                                    : expandedData.lunchpad.status === 'INACTIVE'
                                      ? 'Start Launchpad'
                                      : 'Stop Launchpad'}
                            </Button>
                            <Button
                                onClick={() => handleOpenFundDialog('tokens')}
                                variant="contained"
                                sx={{ fontSize: '0.75rem', minWidth: '8rem' }}
                            >
                                Fund Tokens
                            </Button>
                            <Button
                                onClick={() => handleOpenFundDialog('gas')}
                                variant="contained"
                                sx={{ fontSize: '0.75rem', minWidth: '8rem' }}
                            >
                                Fund Gas
                            </Button>
                            <Button
                                sx={{ fontSize: '0.75rem', minWidth: '8rem' }}
                                variant="contained"
                                onClick={() => handleRetrieveFunds(LunchpadWalletType.RECEIVER)}
                                disabled={retrieveFundsMutation.isPending}
                            >
                                {retrieveFundsMutation.isPending ? 'Retrieving...' : 'Retrieve Funds (Receiver)'}
                            </Button>
                            <Button
                                sx={{ fontSize: '0.75rem', minWidth: '8rem' }}
                                variant="contained"
                                onClick={() => handleRetrieveFunds(LunchpadWalletType.SENDER)}
                                disabled={retrieveFundsMutation.isPending}
                            >
                                {retrieveFundsMutation.isPending ? 'Retrieving...' : 'Retrieve Funds (Sender)'}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );

    return (
        <>
            <Card
                sx={{
                    width: 300,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                    cursor: 'pointer',
                }}
                onClick={handleExpand}
            >
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="h6" component="div">
                            {ticker}
                        </Typography>
                        <IconButton
                            aria-label="expand"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click event
                                handleExpand();
                            }}
                            sx={{
                                padding: 0,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                },
                            }}
                        >
                            <OpenWithRoundedIcon />
                        </IconButton>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        Available Units: {availabeUnits}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        KAS per Unit: {kasPerUnit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Tokens per Unit: {tokenPerUnit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Status: {status}
                    </Typography>
                </CardContent>
            </Card>
            {isExpanded && <ExpandedView />}
            <Dialog open={isFundDialogOpen} onClose={handleCloseFundDialog}>
                <DialogTitle>Fund {fundType === 'tokens' ? 'Tokens' : 'Gas'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="amount"
                        label={`Amount of ${fundType === 'tokens' ? 'Tokens' : 'Gas'}`}
                        type="number"
                        fullWidth
                        variant="standard"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFundDialog}>Cancel</Button>
                    <Button onClick={handleFund} disabled={isFunding}>
                        {isFunding ? 'Funding...' : 'Fund'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LaunchpadCard;
