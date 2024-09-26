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

    const tokenKasPrice = tokenInfo.price ? `${tokenInfo.price.toFixed(7)} / KAS` : '---';

    const totalMintedDataToShow =
        tokenInfo.state === 'finished' ? '100%' : `${(tokenInfo.totalMintedPercent * 100).toFixed(8)}%`;
    return (
        <Card sx={{ height: '20vh', padding: '8px 10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 'bold', mr: 1, fontSize: '0.75rem' }}
                    >
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
                    <Typography sx={{ fontSize: '0.8rem' }} align="center">
                        VOLUME ({tradingDataTimeFrame})
                    </Typography>
                    <Typography align="center" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {tokenInfo.volume ? `$${tokenInfo.volume}` : '---'}
                    </Typography>
                </Box>

                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.8rem' }} align="center">
                        PRICE PER TOKEN ({tradingDataTimeFrame})
                    </Typography>
                    <Typography align="center" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {tokenKasPrice}
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.8rem' }} align="center">
                        TOTAL MINTED
                    </Typography>
                    <Typography align="center" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {totalMintedDataToShow}
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.8rem' }} align="center">
                        HOLDERS
                    </Typography>
                    <Typography align="center" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {tokenInfo.totalHolders}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default TokenStats;
