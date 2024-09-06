import { FC, useState } from 'react';
import { Box, Card, Divider, Typography } from '@mui/material';
import OptionSelection from '../option-selection/OptionSelection';
import { BackendTokenResponse } from '../../../types/Types';

interface TokenStatsProps {
    tokenInfo: BackendTokenResponse;
}

// function calculateAgeInDays(timestamp) {
//     // Convert the timestamp to a Date object
//     const inputNumber = parseInt(timestamp);
//     const inputDate = new Date(inputNumber);

//     // Get the current date
//     const currentDate = new Date();

//     // Calculate the difference in time (milliseconds)
//     const timeDifference = currentDate.getTime() - inputDate.getTime();

//     // Convert the difference from milliseconds to days
//     const ageInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

//     return ageInDays;
// }
const TokenStats: FC<TokenStatsProps> = (props) => {
    const { tokenInfo } = props;
    const tradingDataTimeFramesToSelect = ['All', '1m', '1w', '1d'];
    const [tradingDataTimeFrame, setTradingDataTimeFrame] = useState(
        tradingDataTimeFramesToSelect[tradingDataTimeFramesToSelect.length - 1],
    );

    const updateTradingDataTimeFrame = (value: string) => {
        setTradingDataTimeFrame(value);
    };

    const totalMintedDataToShow = `${(tokenInfo.totalMintedPercent * 100).toFixed(3)}%`;
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
                    <Typography sx={{ fontSize: '1vw' }} align="center">
                        VOLUME ({tradingDataTimeFrame})
                    </Typography>
                    <Typography align="center" sx={{ fontSize: '0.9vw', fontWeight: 'bold' }}>
                        {tokenInfo.volume ? `$${tokenInfo.volume}` : '$69,420,880'}
                    </Typography>
                </Box>

                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '1vw' }} align="center">
                        PRICE PER TOKEN ({tradingDataTimeFrame})
                    </Typography>
                    <Typography align="center" sx={{ fontSize: '0.9vw', fontWeight: 'bold' }}>
                        {tokenInfo.price ? `${tokenInfo.price}/SOMPI` : '69,420/SOMPI'}
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '1vw' }} align="center">
                        TOTAL MINTED
                    </Typography>
                    <Typography align="center" sx={{ fontSize: '0.9vw', fontWeight: 'bold' }}>
                        {totalMintedDataToShow}
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '1vw' }} align="center">
                        HOLDERS
                    </Typography>
                    <Typography align="center" sx={{ fontSize: '0.9vw', fontWeight: 'bold' }}>
                        {tokenInfo.totalHolders ? tokenInfo.totalHolders : '69'}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default TokenStats;
