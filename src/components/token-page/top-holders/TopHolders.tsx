import { FC, useEffect, useState } from 'react';
import { Box, Card, Divider, Tooltip, Typography } from '@mui/material';
import OptionSelection from '../option-selection/OptionSelection';
import { Token } from '../../../types/Types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { fetchDevWalletBalance } from '../../../DAL/Krc20DAL';

interface TopHoldersProps {
    tokenInfo: Token;
}

const TopHolders: FC<TopHoldersProps> = ({ tokenInfo }) => {
    const numberOfHoldersToSelect = [5, 10, 20, 30, 40, 50];
    const [tokenHoldersToShow, setTokenHoldersToShow] = useState(numberOfHoldersToSelect[0]);
    const [topHoldersPercentage, setTopHoldersPercentage] = useState('---');
    const [devWalletPercentage, setDevWalletPercentage] = useState('---');
    const [tokenHolders] = useState(tokenInfo.holder || []);

    const updateTokenHoldersToShow = (value: number) => {
        setTokenHoldersToShow(value);
    };

    useEffect(() => {
        const calculatePercentages = async () => {
            const holdersToCalculate = tokenHolders.slice(0, tokenHoldersToShow);

            // Fetch dev wallet balance
            const devWalletBalance = await fetchDevWalletBalance(tokenInfo.tick, tokenInfo.to);
            const devWalletBalanceKAS = parseFloat(devWalletBalance) / 1e8;

            const totalSupply = parseFloat(tokenInfo?.max) / 1e8;
            const devWalletPercent = devWalletBalanceKAS === 0 ? 0 : (devWalletBalanceKAS / totalSupply) * 100;
            setDevWalletPercentage(`${devWalletPercent.toFixed(2)}%`);

            // Calculate top holders percentage
            const totalHolding = holdersToCalculate
                .map((h) => parseFloat(h.amount) / 1e8)
                .reduce((acc, curr) => acc + curr, 0);

            const totalPercentage = (totalHolding / totalSupply) * 100;
            const totalPercentageFixed = totalPercentage ? totalPercentage.toFixed(2) : '---';
            const totalPercentageString = totalPercentageFixed === '---' ? '---' : `${totalPercentageFixed}%`;
            setTopHoldersPercentage(totalPercentageString);
        };

        calculatePercentages();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenHoldersToShow, tokenInfo]);

    return (
        <Card sx={{ height: '19vh', padding: '8px 10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>
                        TOP HOLDERS
                    </Typography>

                    <Tooltip title="Top holders represent the amount of tokens held by the top X holders combined. This metric helps understand token distribution, potential whale dominance, and the risk of market manipulation. A large concentration of tokens among few holders might be a red flag.">
                        <InfoOutlinedIcon fontSize="small" />
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
                        marginRight: 4,
                    }}
                >
                    {topHoldersPercentage}
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography sx={{ marginLeft: 4, fontSize: '1.3vw' }}>
                    DEV WALLET HOLDS: {devWalletPercentage}
                </Typography>
            </Box>
        </Card>
    );
};

export default TopHolders;
