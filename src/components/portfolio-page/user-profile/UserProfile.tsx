import { FC, useEffect, useState } from 'react';
import { Box, Avatar, Typography, Button, useTheme, TextField, alpha } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ProfileContainer, ProfileDetails } from './UserProfile.s';
// import XIcon from '@mui/icons-material/X';
import { shortenAddress } from '../../../utils/Utils';
import { Stat, StatHelpText, StatNumber } from '@chakra-ui/react';
import { checkReferralExists, getUserReferral } from '../../../DAL/BackendDAL';
import ReferralDialog from '../../dialogs/referral/ReferralDialog';

interface UserProfileProps {
    walletAddress: string;
    portfolioValue: number;
    kasPrice: number;
    setWalletAddress: (address: string) => void;
}

const UserProfile: FC<UserProfileProps> = (props) => {
    const { walletAddress, portfolioValue, kasPrice, setWalletAddress } = props;
    const theme = useTheme();
    const [referralExists, setReferralExists] = useState<boolean | null>(null);
    const [openReferralDialog, setOpenReferralDialog] = useState<boolean>(false);
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [dialogMode, setDialogMode] = useState<'get' | 'add'>('add');

    useEffect(() => {
        const fetchReferralStatus = async () => {
            if (walletAddress) {
                const result = await checkReferralExists(walletAddress);
                if (result) {
                    setReferralExists(result.exists);
                }
            }
        };
        fetchReferralStatus();
    }, [walletAddress]);

    const handleGetReferralCode = async () => {
        if (walletAddress) {
            const result = await getUserReferral(walletAddress);
            if (result) {
                setReferralCode(result.referralCode);
                setDialogMode('get'); // Switch to "get" mode
                setOpenReferralDialog(true); // Open dialog to show referral code
            }
        }
    };

    const handleOpenReferralDialog = () => {
        setDialogMode('add'); // Switch to "add" mode
        setOpenReferralDialog(true);
    };

    const handleCloseReferralDialog = () => {
        setOpenReferralDialog(false);
    };

    const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAddress = e.target.value;
        setWalletAddress(newAddress);
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
                            onClick={handleCopy}
                            variant="outlined"
                            size="small"
                            endIcon={<ContentCopyIcon fontSize="small" />}
                            startIcon={<img style={{ height: '5vh', width: '5vh' }} src={kaspaIcon} alt="Kaspa" />}
                            sx={{
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {walletAddress ? shortenAddress(walletAddress) : 'Connect Wallet'}
                        </Button>
                        <TextField
                            label="Kaspa Wallet Address"
                            variant="outlined"
                            size="small"
                            value={walletAddress}
                            onChange={handleManualAddressChange}
                            sx={{
                                minWidth: '3rem',

                                '& .MuiOutlinedInput-root': {
                                    height: '2.4rem', // Adjust as needed

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
                            }}
                        />

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
                        {referralExists === null ? (
                            <Typography>Loading...</Typography>
                        ) : referralExists ? (
                            <Button variant="outlined" size="small" onClick={handleGetReferralCode}>
                                Get Referral Code
                            </Button>
                        ) : (
                            <Button variant="outlined" size="small" onClick={handleOpenReferralDialog}>
                                Add Referral Code
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
            <ReferralDialog
                open={openReferralDialog}
                onClose={handleCloseReferralDialog}
                walletAddress={walletAddress}
                referralCode={referralCode} // Pass referral code if exists
                mode={dialogMode} // Control dialog mode (get vs. add)
            />
        </ProfileContainer>
    );
};

export default UserProfile;
