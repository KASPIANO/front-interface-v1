import { Modal, Box, IconButton, Typography, TextField, Button, Collapse, Tooltip } from '@mui/material';
import { ClientSideLunchpadWithStatus, LunchpadStatusMapper, LunchpadWalletType } from '../../../types/Types';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useState } from 'react';
import { fetchWalletBalance } from '../../../DAL/KaspaApiDal';
import { formatNumberWithCommas } from '../../../utils/Utils';
import LaunchpadUsageGuide from '../guides/LaunchpadUsageGuide';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { fetchWalletKRC20Balance } from '../../../DAL/Krc20DAL';

const ExpandedView: React.FC<{
    isExpanded: boolean;
    onClose: () => void;
    expandedData: ClientSideLunchpadWithStatus;
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
    retrieveFundType: string;
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
    retrieveFundType,
    theme,
}) => {
    const [isTokensFieldOpen, setIsTokensFieldOpen] = useState(false);
    const [isGasFieldOpen, setIsGasFieldOpen] = useState(false);
    const [kasWalletBalance, setKasWalletBalance] = useState(0);
    const [raisedFunds, setRaisedFunds] = useState(0);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [ableTostart, setAbleToStart] = useState(false);
    const [krc20Balance, setKrc20Balance] = useState(expandedData.lunchpad.krc20TokensAmount || 0);
    const [availabeUnits, setAvailableUnits] = useState(expandedData.lunchpad.availabeUnits);

    useEffect(() => {
        if (expandedData && expandedData.success) {
            fetchWalletBalance(expandedData.lunchpad.walletAddress, false).then((balance) => {
                setRaisedFunds(balance);
            });
        }
    }, [expandedData, retrieveFundsMutation]);

    useEffect(() => {
        const checkStartConditions = async () => {
            if (expandedData && expandedData.success) {
                try {
                    const balalance = await fetchWalletBalance(expandedData.lunchpad.senderWalletAddress, false);
                    setKasWalletBalance(balalance);
                    const krc20BalanceReq = await fetchWalletKRC20Balance(
                        expandedData.lunchpad.senderWalletAddress,
                        expandedData.lunchpad.ticker,
                    );
                    setKrc20Balance(krc20BalanceReq);
                    setAbleToStart(krc20BalanceReq > 0 && balalance > 0);
                    const availablleNewUnits = krc20Balance / expandedData.lunchpad.tokenPerUnit;
                    setAvailableUnits(availablleNewUnits);
                } catch (error) {
                    console.error('Error fetching balance:', error);
                }
            }
        };
        checkStartConditions();

        const timeout = setTimeout(() => {
            checkStartConditions();
        }, 5000); // 7-second delay

        return () => clearTimeout(timeout); // Cleanup timeout on component unmount or dependency change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expandedData, fundTokensAmount, fundGasAmount]);

    return (
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
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                                    {expandedData.lunchpad.ticker}
                                </Typography>
                                <Button
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            fontSize: '0.8rem',
                                        },
                                        fontSize: '0.75rem',
                                    }}
                                    startIcon={<HelpOutlineIcon />}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => setIsGuideOpen(true)}
                                >
                                    How to Use Launchpad
                                </Button>

                                <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                    Raised Amount: {formatNumberWithCommas(raisedFunds)} KAS
                                </Typography>
                            </Box>
                            {/* ... (other Typography components) */}
                            <Typography sx={{ fontSize: '1rem' }}>
                                Round Number: {expandedData.lunchpad.roundNumber}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                Total Units: {expandedData.lunchpad.totalUnits}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                Available Units to sale: {availabeUnits}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                Kas per Unit: {expandedData.lunchpad.kasPerUnit}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                Tokens per Unit: {expandedData.lunchpad.tokenPerUnit}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                Status: {LunchpadStatusMapper[expandedData.lunchpad.status]}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                Min Units per Order: {expandedData.lunchpad.minUnitsPerOrder || 'N/A'}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                Max Units per Order: {expandedData.lunchpad.maxUnitsPerOrder || 'N/A'}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                KRC20 Tokens Amount in Launchpad: {krc20Balance}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                Kas Amount in Launchpad: {kasWalletBalance.toFixed(4) || 'N/A'}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                Required Kaspa: {expandedData.lunchpad.requiredKaspa || 'N/A'}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                Open Orders: {expandedData.lunchpad.openOrders || 'N/A'}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                Whitelist Status: {expandedData.lunchpad.useWhitelist ? 'Enabled' : 'Disabled'}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                <Tooltip
                                    title={
                                        krc20Balance === 0
                                            ? 'You need to have KRC20 tokens in the launchpad to start it.'
                                            : kasWalletBalance === 0
                                              ? 'You need to send gas fees (Kas) to start the launchpad.'
                                              : ''
                                    }
                                    arrow
                                >
                                    <span>
                                        <Button
                                            sx={{ fontSize: '0.75rem', minWidth: '9rem' }}
                                            variant="contained"
                                            onClick={handleStartStop}
                                            disabled={
                                                startLaunchpadMutation.isPending ||
                                                stopLaunchpadMutation.isPending ||
                                                (!ableTostart && expandedData.lunchpad.status === 'INACTIVE')
                                            }
                                        >
                                            {startLaunchpadMutation.isPending || stopLaunchpadMutation.isPending
                                                ? expandedData.lunchpad.status === 'INACTIVE'
                                                    ? 'Starting...'
                                                    : 'Stopping...'
                                                : expandedData.lunchpad.status === 'INACTIVE'
                                                  ? 'Start Launchpad'
                                                  : 'Stop Launchpad'}
                                        </Button>
                                    </span>
                                </Tooltip>

                                <Tooltip
                                    title={
                                        expandedData.lunchpad.status === 'ACTIVE'
                                            ? 'You need to stop the launchpad to withdraw funds.'
                                            : kasWalletBalance === 0
                                              ? 'You need to have Kas in the launchpad for gas to withdraw.'
                                              : ''
                                    }
                                    arrow
                                >
                                    <span>
                                        <Button
                                            sx={{ fontSize: '0.75rem', minWidth: '8rem' }}
                                            variant="contained"
                                            onClick={() => handleRetrieveFunds(LunchpadWalletType.RECEIVER)}
                                            disabled={
                                                retrieveFundType === 'receiver' ||
                                                expandedData.lunchpad.status === 'ACTIVE' ||
                                                kasWalletBalance === 0
                                            }
                                        >
                                            {retrieveFundsMutation.isPending && retrieveFundType === 'receiver'
                                                ? 'Withdrawing...'
                                                : 'Withdraw Raised Funds (Kas)'}
                                        </Button>
                                    </span>
                                </Tooltip>

                                <Tooltip
                                    title={
                                        expandedData.lunchpad.status === 'ACTIVE'
                                            ? 'You need to stop the launchpad to withdraw funds.'
                                            : kasWalletBalance === 0
                                              ? 'You need to have Kas in the launchpad for gas to withdraw.'
                                              : ''
                                    }
                                    arrow
                                >
                                    <span>
                                        <Button
                                            sx={{ fontSize: '0.75rem', minWidth: '8rem' }}
                                            variant="contained"
                                            onClick={() => handleRetrieveFunds(LunchpadWalletType.SENDER)}
                                            disabled={
                                                retrieveFundType === 'sender' ||
                                                expandedData.lunchpad.status === 'ACTIVE' ||
                                                kasWalletBalance === 0
                                            }
                                        >
                                            {retrieveFundsMutation.isPending && retrieveFundType === 'sender'
                                                ? 'Withdrawing...'
                                                : 'Withdraw Funds (Tokens & Gas Fees)'}
                                        </Button>
                                    </span>
                                </Tooltip>
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
                    {!isTokensFieldOpen ? (
                        <Button
                            sx={{ fontSize: '0.7rem', padding: '5px' }}
                            variant="contained"
                            fullWidth
                            onClick={() => setIsTokensFieldOpen(true)}
                        >
                            Fund Tokens
                        </Button>
                    ) : (
                        <Box
                            sx={{
                                flex: 1,
                                bgcolor: 'background.default',
                                borderRadius: 1,
                                p: 2,
                                boxShadow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                maxHeight: '10rem',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Fund Tokens
                                </Typography>
                                <Button variant="text" onClick={() => setIsTokensFieldOpen(false)}>
                                    Close
                                </Button>
                            </Box>
                            <Collapse in={isTokensFieldOpen}>
                                <TextField
                                    margin="dense"
                                    id="tokens-amount"
                                    label="Amount of Tokens"
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
                                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        sx={{ padding: 0.2 }}
                                        onClick={() => handleFund('tokens')}
                                        variant="contained"
                                        disabled={isTokensFunding || expandedData.lunchpad.status === 'ACTIVE'}
                                    >
                                        {isTokensFunding ? 'Funding...' : 'Fund'}
                                    </Button>
                                </Box>
                            </Collapse>
                        </Box>
                    )}
                    {!isGasFieldOpen ? (
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setIsGasFieldOpen(true)}
                            sx={{ fontSize: '0.7rem', padding: '5px' }}
                        >
                            Fund Gas Fees
                        </Button>
                    ) : (
                        <Box
                            sx={{
                                flex: 1,
                                bgcolor: 'background.default',
                                borderRadius: 1,
                                p: 2,
                                boxShadow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                maxHeight: '10rem',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Fund Gas Fees
                                </Typography>
                                <Button variant="text" onClick={() => setIsGasFieldOpen(false)}>
                                    Close
                                </Button>
                            </Box>
                            <Collapse in={isGasFieldOpen}>
                                <TextField
                                    margin="dense"
                                    id="gas-amount"
                                    label="Kas Amount for Fees"
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
                                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        sx={{ padding: 0.2 }}
                                        onClick={() => handleFund('gas')}
                                        variant="contained"
                                        disabled={isGasFunding || expandedData.lunchpad.status === 'ACTIVE'}
                                    >
                                        {isGasFunding ? 'Funding...' : 'Fund'}
                                    </Button>
                                </Box>
                            </Collapse>
                        </Box>
                    )}
                </Box>
                <LaunchpadUsageGuide open={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
            </Box>
        </Modal>
    );
};

export default ExpandedView;
