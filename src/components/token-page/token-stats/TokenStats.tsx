import { FC, useState } from 'react';
import { Box, Card, Divider, Typography } from '@mui/material';
import OptionSelection from '../option-selection/OptionSelection';
import { Token } from '../../../types/Types';

interface TokenStatsProps {
    tokenInfo: Token;
}

function calculateAgeInDays(timestamp) {
    // Convert the timestamp to a Date object
    const inputNumber = parseInt(timestamp);
    const inputDate = new Date(inputNumber);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in time (milliseconds)
    const timeDifference = currentDate.getTime() - inputDate.getTime();

    // Convert the difference from milliseconds to days
    const ageInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return ageInDays;
}
const TokenStats: FC<TokenStatsProps> = (props) => {
    const { tokenInfo } = props;
    const tradingDataTimeFramesToSelect = ['All', '1m', '1w', '1d'];
    const [tradingDataTimeFrame, setTradingDataTimeFrame] = useState(
        tradingDataTimeFramesToSelect[tradingDataTimeFramesToSelect.length - 1],
    );

    const updateTradingDataTimeFrame = (value: string) => {
        setTradingDataTimeFrame(value);
    };

    const tokenPreMinted = tokenInfo.pre ? parseInt(tokenInfo.pre) / 1e8 : '39420';
    const preMintedPercentage =
        tokenInfo.pre !== '0' ? ((parseInt(tokenInfo.pre) / parseInt(tokenInfo.max)) * 100).toFixed(2) : '';
    const preMintedDataToShow = tokenInfo.pre !== '0' ? `${tokenPreMinted} (${preMintedPercentage}%)` : '0';
    const age = tokenInfo.mtsAdd;
    return (
        <Card sx={{ height: '20vh', padding: '8px 10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>
                        STATS
                    </Typography>
                </Box>
                <OptionSelection
                    options={tradingDataTimeFramesToSelect}
                    value={tradingDataTimeFrame}
                    onChange={updateTradingDataTimeFrame}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '3vh',
                    columnGap: '2vw',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" align="center">
                        VOLUME ({tradingDataTimeFrame})
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ fontWeight: 'bold' }}>
                        {tokenInfo.volume ? `$${tokenInfo.volume}` : '$69,420,880'}
                    </Typography>
                </Box>

                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" align="center">
                        PRICE PER TOKEN ({tradingDataTimeFrame})
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ fontWeight: 'bold' }}>
                        {tokenInfo.price ? `${tokenInfo.price}/SOMPI` : '69,420/SOMPI'}
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" align="center">
                        PRE MINTED
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ fontWeight: 'bold' }}>
                        {preMintedDataToShow}
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" align="center">
                        AGE
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ fontWeight: 'bold' }}>
                        {calculateAgeInDays(age)} days
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default TokenStats;
