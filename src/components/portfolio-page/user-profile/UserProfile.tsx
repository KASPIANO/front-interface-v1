import { FC, useEffect, useRef, useState } from 'react';
import {
    Box,
    Avatar,
    Typography,
    Button,
    useTheme,
    TextField,
    alpha,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ProfileContainer, ProfileDetails } from './UserProfile.s';
import { isEmptyString, isValidWalletAddress, shortenAddress } from '../../../utils/Utils';
import { Stat, StatHelpText, StatNumber } from '@chakra-ui/react';
import { showGlobalDialog } from '../../dialog-context/DialogContext';
import { ContentCopyRounded as ContentCopyRoundedIcon } from '@mui/icons-material';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { debounce } from 'lodash';
import { UserReferral } from '../../../types/Types';
import SearchIcon from '@mui/icons-material/Search'; // Import the icon
import { checkOrderExists } from '../../../DAL/Krc20DAL';
import { cancelOrderKRC20 } from '../../../utils/KaswareUtils';
import { getUserUnlistedTransactions } from '../../../DAL/BackendP2PDAL';

interface UserProfileProps {
    walletAddress: string;
    currentWalletToCheck: string;
    portfolioValue: number;
    kasPrice: number;
    setCurrentWalletToCheck: (address: string) => void;
    connectWallet: () => void;
    updateAndGetUserReferral: (referredBy?: string) => Promise<UserReferral> | null;
    userReferral: UserReferral | null;
    isUserReferralFinishedLoading: boolean;
}

const UserProfile: FC<UserProfileProps> = (props) => {
    const {
        walletAddress,
        portfolioValue,
        kasPrice,
        setCurrentWalletToCheck,
        currentWalletToCheck,
        connectWallet,
        updateAndGetUserReferral,
        userReferral,
        isUserReferralFinishedLoading,
    } = props;
    const theme = useTheme();
    const [, setCopied] = useState(false);
    const [walletAddressError, setWalletAddressError] = useState<string | null>(null);
    const [walletInputValue, setWalletInputValue] = useState<string>(walletAddress);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [ticker, setTicker] = useState('');
    const [orders, setOrders] = useState([]);
    const [psktTxId, setPsktTxId] = useState(null);
    const [fetchingLostOrders, setFetchingLostORders] = useState(false);
    const [recovering, setRecovering] = useState(false);
    // const [openXDialog, setOpenXDialog] = useState(false);
    // const [xUrl, setXUrl] = useState('');
    const debouncedSetCurrentWalletRef = useRef(null);

    useEffect(() => {
        setCurrentWalletToCheck(walletAddress);
        debouncedSetCurrentWalletRef.current = debounce((value) => {
            setCurrentWalletToCheck(value);
        }, 500);

        return () => {
            debouncedSetCurrentWalletRef.current.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (walletInputValue !== currentWalletToCheck) {
            setWalletInputValue(currentWalletToCheck);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWalletToCheck]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopied(true);
                showGlobalSnackbar({
                    message: 'Copied to clipboard',
                    severity: 'success',
                });
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    // const handleAddXUrl = () => {
    //     // todo
    // };

    const handleOpenReferralDialog = () => {
        if (walletAddress) {
            showGlobalDialog({
                dialogType: 'referral',
                dialogProps: {
                    walletAddress,
                    mode: 'add',
                    updateAndGetUserReferral,
                    userReferral,
                },
            });
        }
    };

    const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAddress = e.target.value;

        setWalletInputValue(newAddress);

        if (isValidWalletAddress(newAddress)) {
            setWalletAddressError(null);
            debouncedSetCurrentWalletRef.current(newAddress);
        } else {
            setWalletAddressError('Please enter a valid wallet address');
        }
    };

    const createReferralLink = (code) => {
        const url = new URL(window.location.href);
        return `${url.origin}/?ref=${code}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress);
    };

    const porfolioUSDValue = (portfolioValue * kasPrice).toFixed(2);
    // const arrowColor = portfolioValue.changeDirection === 'increase' ? 'green' : 'red';

    const profileSourceLink = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${walletAddress}`;
    const darkKaspaIcon =
        'https://149995303.v2.pressablecdn.com/wp-content/uploads/2023/06/Kaspa-Icon-Dark-Green-on-Black.png';
    const lightKaspaIcon =
        'https://149995303.v2.pressablecdn.com/wp-content/uploads/2023/06/Kaspa-Icon-Dark-Green-on-White.png';
    const kaspaIcon = theme.palette.mode === 'dark' ? lightKaspaIcon : darkKaspaIcon;

    const handlePsktRecovery = async () => {
        try {
            setFetchingLostORders(true); // Indicate fetching started

            // Fetch orders
            const result = await checkOrderExists(ticker, walletAddress);

            // Extract uTxid array
            const uTxidArray = result.map((item) => item.uTxid);
            // Fetch lost orders
            const lostOrders = await getUserUnlistedTransactions(uTxidArray);
            if (lostOrders.length === 0) {
                showGlobalSnackbar({ message: 'No Lost Orders', severity: 'warning' });
            }
            const matchingOrders = result.filter((item) => lostOrders.includes(item.uTxid));
            setOrders(matchingOrders || []); // Update state with lost orders
        } catch (error) {
            console.error('Error during PSKT recovery:', error); // Log any error
        } finally {
            setFetchingLostORders(false); // Indicate fetching ended
        }
    };

    const handleRecovery = async () => {
        if (psktTxId) {
            try {
                setRecovering(true);
                const result = await cancelOrderKRC20(ticker, psktTxId);

                if (result) {
                    showGlobalSnackbar({
                        message: 'Order recovered successfully',
                        severity: 'success',
                    });
                } else {
                    showGlobalSnackbar({
                        message: 'Failed to recover order',
                        severity: 'error',
                    });
                }
            } catch (error) {
                showGlobalSnackbar({
                    message: 'An error occurred while recovering the order. Please try again.',
                    severity: 'error',
                });
                console.error('Recovery Error:', error); // Log error for debugging
            } finally {
                // Always close the dialog, even if there's an error
                handleCloseDialog();
            }
        } else {
            showGlobalSnackbar({
                message: 'No transaction ID provided for recovery.',
                severity: 'warning',
            });
            handleCloseDialog(); // Close the dialog even if no transaction ID is provided
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setRecovering(false);
        setFetchingLostORders(false);
        setTicker('');
        setPsktTxId('');
    };

    return (
        <ProfileContainer>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={profileSourceLink} alt="Profile Picture" sx={{ width: '10vh', height: '10vh' }} />
                <ProfileDetails>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            onClick={walletAddress ? handleCopy : connectWallet}
                            variant="outlined"
                            size="small"
                            endIcon={walletAddress ? <ContentCopyIcon fontSize="small" /> : <></>}
                            startIcon={<img style={{ height: '5vh', width: '5vh' }} src={kaspaIcon} alt="Kaspa" />}
                            sx={{
                                color: theme.palette.text.secondary,
                                fontSize: '0.75rem',
                            }}
                        >
                            {walletAddress ? shortenAddress(walletAddress) : 'Connect Wallet'}
                        </Button>
                        {isEmptyString(walletAddress) && (
                            <TextField
                                label="Kaspa Wallet Address"
                                variant="outlined"
                                size="small"
                                value={walletInputValue}
                                onChange={handleManualAddressChange}
                                error={!!walletAddressError}
                                helperText={walletAddressError}
                                sx={{
                                    minWidth: '3rem',
                                    fontSize: '0.75rem',
                                    position: 'relative',

                                    '& .MuiOutlinedInput-root': {
                                        height: '2.2rem', // Adjust as needed

                                        '& fieldset': {
                                            borderColor: alpha(theme.palette.primary.main, 0.7),
                                        },
                                        '&:hover fieldset': {
                                            borderColor: alpha(theme.palette.primary.main, 0.7),
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: alpha(theme.palette.primary.main, 0.7),
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: theme.palette.text.secondary,
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: alpha(theme.palette.primary.main, 0.7),
                                    },
                                    '& .MuiFormHelperText-root': {
                                        position: 'absolute',
                                        bottom: '-20px',
                                    },
                                }}
                            />
                        )}

                        {/* <Button variant="outlined" endIcon={<XIcon />}>
                            Add
                        </Button> */}
                        {/* <Button
                            variant="outlined"
                            size="small"
                            startIcon={<img src="/path/to/discord-icon.png" alt="Discord" />}
                        >
                            Add
                        </Button> */}
                        {!isEmptyString(userReferral?.code) && (
                            <Button
                                sx={{ fontSize: '0.75rem' }}
                                variant="outlined"
                                size="medium"
                                endIcon={<ContentCopyRoundedIcon fontSize="small" />}
                                onClick={() => copyToClipboard(userReferral?.code)}
                            >
                                Your Referral Code : {userReferral?.code}
                            </Button>
                        )}
                        {!isEmptyString(userReferral?.code) && (
                            <Button
                                sx={{ fontSize: '0.75rem' }}
                                variant="outlined"
                                size="medium"
                                endIcon={<ContentCopyRoundedIcon fontSize="small" />}
                                onClick={() => copyToClipboard(createReferralLink(userReferral?.code))}
                            >
                                Copy Your Referral Link
                            </Button>
                        )}
                        {isEmptyString(userReferral?.referredBy) &&
                            !isEmptyString(walletAddress) &&
                            isUserReferralFinishedLoading && (
                                <Button
                                    sx={{ fontSize: '0.75rem' }}
                                    variant="outlined"
                                    size="medium"
                                    onClick={handleOpenReferralDialog}
                                >
                                    Apply Referral Code
                                </Button>
                            )}

                        <Button
                            sx={{ fontSize: '0.75rem' }}
                            variant="outlined"
                            size="medium"
                            onClick={() => setDialogOpen(true)}
                            startIcon={<SearchIcon />} // Add the icon
                        >
                            Get Lost Orders
                        </Button>
                    </Box>
                </ProfileDetails>
            </Box>
            <Stat sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <StatHelpText sx={{ fontSize: '1rem', fontWeight: 400 }}>Portfolio Value</StatHelpText>
                <StatNumber sx={{ fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    {portfolioValue.toFixed(2)}
                    <Typography sx={{ marginLeft: '0.2vw', fontSize: '2rem', fontWeight: 400, opacity: 0.5 }}>
                        KAS
                    </Typography>
                </StatNumber>
                <StatHelpText sx={{ fontSize: '1rem' }}>
                    ${porfolioUSDValue}
                    {/* <StatArrow
                        sx={{ color: arrowColor, marginLeft: '4px' }}
                        type={portfolioValue.changeDirection}
                    />
                    {portfolioValue.change}% */}
                </StatHelpText>
            </Stat>
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
                <DialogTitle
                    sx={{
                        paddingBottom: '0.5rem',
                    }}
                >
                    Retrieve Lost Orders
                </DialogTitle>
                <DialogContent
                    sx={{
                        padding: '1rem',
                        paddingBottom: 0,
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Enter Ticker to see lost orders"
                        fullWidth
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        sx={{ marginBottom: '0.7rem' }}
                    />
                    <Button variant="contained" onClick={handlePsktRecovery}>
                        {fetchingLostOrders ? 'Fetching..' : 'Fetch Orders'}
                    </Button>
                    <Box sx={{ marginTop: '1rem' }}>
                        {orders.map((order, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    margin: '0.5rem 0',
                                    padding: '0.5rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    borderColor: psktTxId === order.uTxid ? theme.palette.primary.main : '#ccc', // Border color for selected order
                                    transition: 'background-color 0.3s, border-color 0.3s', // Smooth transition for better UI
                                }}
                                onClick={() => setPsktTxId(order.uTxid)}
                            >
                                <Typography>Ticker: {order.tick}</Typography>
                                <Typography>Amount: {(order.amount / 1e8).toFixed(2)}</Typography>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        paddingTop: 0,
                    }}
                >
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleRecovery} disabled={!psktTxId}>
                        {recovering ? 'Recovering..' : 'Recover'}
                    </Button>
                </DialogActions>
            </Dialog>
        </ProfileContainer>
    );
};

export default UserProfile;
