import { Modal, Box, IconButton, Typography, TextField, Button } from '@mui/material';
import { LunchpadWalletType } from '../../../types/Types';
import CloseIcon from '@mui/icons-material/CloseRounded';

const ExpandedView: React.FC<{
    isExpanded: boolean;
    onClose: () => void;
    expandedData: any;
    isLoading: boolean;
    error: any;
    fundTokensAmount: string;
    fundGasAmount: string;
    isTokensFunding: boolean;
    isGasFunding: boolean;
    validateNumbersOnly: (value: string) => boolean;
    setFundTokensAmount: React.Dispatch<React.SetStateAction<string>>;
    setFundGasAmount: React.Dispatch<React.SetStateAction<string>>;
    handleFund: (fundType: string) => Promise<void>;
    handleStartStop: () => void;
    handleRetrieveFunds: (walletType: LunchpadWalletType) => void;
    startLaunchpadMutation: any;
    stopLaunchpadMutation: any;
    retrieveFundsMutation: any;
    theme: any;
}> = ({
    isExpanded,
    onClose,
    expandedData,
    isLoading,
    error,
    fundTokensAmount,
    fundGasAmount,
    isTokensFunding,
    isGasFunding,
    validateNumbersOnly,
    setFundTokensAmount,
    setFundGasAmount,
    handleFund,
    handleStartStop,
    handleRetrieveFunds,
    startLaunchpadMutation,
    stopLaunchpadMutation,
    retrieveFundsMutation,

    theme,
}) => (
    <Modal
        open={isExpanded}
        onClose={onClose}
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
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
        >
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    padding: 0,
                    position: 'absolute',
                    right: 7,
                    top: 7,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ flex: 2, pr: 4 }}>
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2, // Space between the boxes
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        p: 2,
                        boxShadow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Fund Tokens
                    </Typography>
                    <TextField
                        margin="dense"
                        id="amount"
                        label={'Amount of Tokens'}
                        fullWidth
                        type="text"
                        variant="standard"
                        value={fundTokensAmount}
                        onChange={(e) => {
                            const { value } = e.target;
                            if (validateNumbersOnly(value)) {
                                setFundTokensAmount(value); // Only update if the input is valid
                            }
                        }}
                    />
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <Button
                            sx={{
                                padding: 0.2,
                            }}
                            onClick={() => handleFund('tokens')}
                            variant="contained"
                            disabled={isTokensFunding}
                        >
                            {isTokensFunding ? 'Funding...' : 'Fund'}
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        p: 2,
                        boxShadow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Fund Gas Fees
                    </Typography>
                    <TextField
                        margin="dense"
                        id="amount"
                        label={'Kas Amount for Fees'}
                        fullWidth
                        type="text"
                        variant="standard"
                        value={fundGasAmount}
                        onChange={(e) => {
                            const { value } = e.target;
                            if (validateNumbersOnly(value)) {
                                setFundGasAmount(value); // Only update if the input is valid
                            }
                        }}
                    />
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            sx={{
                                padding: 0.2,
                            }}
                            onClick={() => handleFund('gas')}
                            variant="contained"
                            disabled={isGasFunding}
                        >
                            {isGasFunding ? 'Funding...' : 'Fund'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    </Modal>
);

export default ExpandedView;
