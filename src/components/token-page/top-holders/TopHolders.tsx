import { FC, useEffect, useState } from 'react';
import { Box, Card, Divider, IconButton, Snackbar, Tooltip, Typography } from '@mui/material';
import OptionSelection from '../option-selection/OptionSelection';
import { BackendTokenResponse } from '../../../types/Types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { fetchDevWalletBalance } from '../../../DAL/Krc20DAL';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

interface TopHoldersProps {
    tokenInfo: BackendTokenResponse;
}

const TopHolders: FC<TopHoldersProps> = ({ tokenInfo }) => {
    const numberOfHoldersToSelect = [5, 10, 20, 30, 40, 50];
    const [tokenHoldersToShow, setTokenHoldersToShow] = useState(numberOfHoldersToSelect[0]);
    const [topHoldersPercentage, setTopHoldersPercentage] = useState('---');
    const [devWalletPercentage, setDevWalletPercentage] = useState('---');
    const [holderTitle, setHolderTitle] = useState(numberOfHoldersToSelect[0]);
    const [copied, setCopied] = useState(false);

    const updateTokenHoldersToShow = (value: number) => {
        setTokenHoldersToShow(value);
        setHolderTitle(value);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    useEffect(() => {
        if (tokenInfo) {
            const calculatePercentages = async () => {
                const burnWalletAddress = 'kaspa:qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkx9awp4e';

                try {
                    // Filter top holders, excluding the burn wallet address
                    const holdersToCalculate = (tokenInfo.topHolders || [])
                        .filter((holder) => holder.address !== burnWalletAddress)
                        .slice(0, tokenHoldersToShow);

                    const { totalSupply } = tokenInfo;

                    // Fetch burnt wallet balance with error handling
                    // let burntWalletBalance = 0;
                    // try {
                    //     burntWalletBalance = await fetchBurntRC20Balance(tokenInfo.ticker);
                    // } catch (e) {
                    //     console.error('Error fetching burnt wallet balance:', e);
                    // }
                    // const totalSupplyAdjusted = burntWalletBalance
                    //     ? totalSupply - burntWalletBalance
                    //     : totalSupply;
                    // setTotalSupplyAfterBurn(totalSupplyAdjusted);

                    // Calculate total holding and percentage
                    const totalHolding = holdersToCalculate
                        .map((h) => h.balance)
                        .reduce((acc, curr) => acc + curr, 0);
                    const totalPercentage = (totalHolding / totalSupply) * 100;
                    const totalPercentageFixed = totalPercentage ? totalPercentage.toFixed(2) : '---';
                    const totalPercentageString =
                        totalPercentageFixed === '---' ? '---' : `${totalPercentageFixed}%`;

                    // Set state with calculated percentage
                    setTopHoldersPercentage(totalPercentageString);
                } catch (error) {
                    console.error('Error calculating percentages:', error);
                }
            };

            // Call the async function inside the useEffect
            calculatePercentages();
        }
    }, [tokenHoldersToShow, tokenInfo]);

    useEffect(() => {
        const fetchDevWalletPercentage = async () => {
            try {
                // Fetch dev wallet balance and calculate the percentage
                const devWalletBalance = await fetchDevWalletBalance(tokenInfo.ticker, tokenInfo.devWallet);
                const devWalletPercent =
                    devWalletBalance === 0 ? 0 : (devWalletBalance / tokenInfo.totalSupply) * 100;
                setDevWalletPercentage(`${devWalletPercent.toFixed(2)}%`);
            } catch (error) {
                console.error('Error fetching dev wallet percentage:', error);
            }
        };

        // Execute the async function
        if (tokenInfo) {
            fetchDevWalletPercentage();
        }
    }, [tokenInfo]);

    return (
        <Card sx={{ height: '18vh', padding: '8px 10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 'bold', mr: 1, fontSize: '0.75rem' }}
                    >
                        TOP HOLDERS {holderTitle}
                    </Typography>

                    <Tooltip title="Top holders represent the amount of tokens held by the top X holders combined. This metric helps understand token distribution, potential whale dominance, and the risk of market manipulation. A large concentration of tokens among few holders might be a red flag.">
                        <InfoOutlinedIcon
                            sx={{
                                fontSize: '0.9rem',
                            }}
                            fontSize="small"
                        />
                    </Tooltip>
                </Box>
                <OptionSelection
                    options={numberOfHoldersToSelect}
                    value={tokenHoldersToShow}
                    onChange={updateTokenHoldersToShow}
                />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '4vh',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        marginRight: '0.7rem',
                        fontSize: '1.2rem',
                    }}
                >
                    {topHoldersPercentage}
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography sx={{ marginLeft: 4, fontSize: '1rem' }}>
                    DEV WALLET HOLDS: {devWalletPercentage}
                    <IconButton size="small" onClick={() => copyToClipboard(tokenInfo.devWallet)}>
                        <ContentCopyRoundedIcon fontSize="small" />
                    </IconButton>
                </Typography>
            </Box>
            {copied && (
                <Snackbar
                    sx={{
                        backgroundColor: '#EDF7ED',
                    }}
                    open={copied}
                    autoHideDuration={2000}
                    onClose={() => setCopied(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    message="Copied to clipboard!"
                />
            )}
        </Card>
    );
};

export default TopHolders;
