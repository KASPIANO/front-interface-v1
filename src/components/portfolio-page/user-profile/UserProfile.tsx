import { FC, useEffect, useRef, useState } from 'react';
import { Box, Avatar, Typography, Button, useTheme, TextField, alpha } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ProfileContainer, ProfileDetails } from './UserProfile.s';
import { isEmptyString, isValidWalletAddress, shortenAddress } from '../../../utils/Utils';
import { Stat, StatHelpText, StatNumber } from '@chakra-ui/react';
import { showGlobalDialog } from '../../dialog-context/DialogContext';
import { ContentCopyRounded as ContentCopyRoundedIcon } from '@mui/icons-material';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { debounce } from 'lodash';
import { UserReferral } from '../../../types/Types';

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
                                    fontSize: '0.8rem',
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
                                <Button variant="outlined" size="medium" onClick={handleOpenReferralDialog}>
                                    Apply Referral Code
                                </Button>
                            )}
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
            {/* <Dialog
                PaperProps={{
                    sx: {
                        width: '40vw',
                    },
                }}
                open={openXDialog}
                onClose={() => setOpenXDialog(false)}
            >
                <DialogTitle>Add X/Twitter URL</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Url"
                        label="X/Twitter URL"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={xUrl}
                        onChange={(e) => setXUrl(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenXDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddXUrl}>Save</Button>
                </DialogActions>
            </Dialog> */}
        </ProfileContainer>
    );
};

export default UserProfile;
