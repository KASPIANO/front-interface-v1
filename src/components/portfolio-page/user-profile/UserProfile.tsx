import { FC, useEffect, useRef, useState } from 'react';
import { Box, Avatar, Typography, Button, useTheme, TextField, alpha } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ProfileContainer, ProfileDetails } from './UserProfile.s';
// import XIcon from '@mui/icons-material/X';
import { isEmptyString, isValidWalletAddress, shortenAddress } from '../../../utils/Utils';
import { Stat, StatHelpText, StatNumber } from '@chakra-ui/react';
import { getUserReferral } from '../../../DAL/BackendDAL';
import { showGlobalDialog } from '../../dialog-context/DialogContext';
import { ContentCopyRounded as ContentCopyRoundedIcon } from '@mui/icons-material';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { debounce } from 'lodash';

interface UserProfileProps {
    walletAddress: string;
    currentWalletToCheck: string;
    portfolioValue: number;
    kasPrice: number;
    setCurrentWalletToCheck: (address: string) => void;
    connectWallet: () => void;
}

const UserProfile: FC<UserProfileProps> = (props) => {
    const {
        walletAddress,
        portfolioValue,
        kasPrice,
        setCurrentWalletToCheck,
        currentWalletToCheck,
        connectWallet,
    } = props;
    const theme = useTheme();
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [referredBy, setReferredBy] = useState<string | null>(null);
    const [isReferralCodeLoaded, setIsReferralCodeLoaded] = useState<boolean>(false);
    const [, setCopied] = useState(false);
    const [walletAddressError, setWalletAddressError] = useState<string | null>(null);
    const [walletInputValue, setWalletInputValue] = useState<string>(walletAddress);
    const debouncedSetCurrentWalletRef = useRef(null);

    useEffect(() => {
        debouncedSetCurrentWalletRef.current = debounce((value) => {
            setCurrentWalletToCheck(value);
        }, 500);

        return () => {
            debouncedSetCurrentWalletRef.current.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchReferralStatus = async () => {
            if (walletAddress) {
                setReferralCode(null);
                setWalletInputValue(currentWalletToCheck);
                const result = await getUserReferral(walletAddress);
                if (result.referralCode) {
                    setReferralCode(result.referralCode);
                    setReferredBy(result.refferedBy);
                }

                setIsReferralCodeLoaded(true);
            }
        };
        fetchReferralStatus();
    }, [walletAddress, currentWalletToCheck]);

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

    const handleOpenReferralDialog = () => {
        if (walletAddress) {
            showGlobalDialog({
                dialogType: 'referral',
                dialogProps: {
                    walletAddress,
                    mode: 'add',
                    setReferralCode: setReferredBy,
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
                        {!isEmptyString(referralCode) && (
                            <Button
                                variant="outlined"
                                size="medium"
                                endIcon={<ContentCopyRoundedIcon fontSize="small" />}
                                onClick={() => copyToClipboard(referralCode)}
                            >
                                Your Referral Code : {referralCode}
                            </Button>
                        )}
                        {!isEmptyString(referralCode) && (
                            <Button
                                variant="outlined"
                                size="medium"
                                endIcon={<ContentCopyRoundedIcon fontSize="small" />}
                                onClick={() => copyToClipboard(createReferralLink(referralCode))}
                            >
                                Copy Your Referral Link
                            </Button>
                        )}
                        {isEmptyString(referredBy) && !isEmptyString(walletAddress) && isReferralCodeLoaded && (
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
        </ProfileContainer>
    );
};

export default UserProfile;
