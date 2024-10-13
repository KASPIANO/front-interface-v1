import { FC, useState } from 'react';
import { Box, Card, Divider, Skeleton, Typography } from '@mui/material';
import OptionSelection from '../option-selection/OptionSelection';
import { BackendTokenResponse } from '../../../types/Types';
import { useFetchStats, useFetchTradeStats } from '../../../DAL/UseQueriesBackend';

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
    const tradingDataTimeFramesToSelect = ['All', '1m', '1w', '1d', '6h', '1h', '15m'];
    const [tradingDataTimeFrame, setTradingDataTimeFrame] = useState(
        tradingDataTimeFramesToSelect[tradingDataTimeFramesToSelect.length - 1],
    );

    const { data: stats, isLoading: loading } = useFetchStats(tokenInfo.ticker, tradingDataTimeFrame);
    const { data: tradeStats, isLoading: tradeloading } = useFetchTradeStats(
        tokenInfo.ticker,
        tradingDataTimeFrame,
    );

    const updateTradingDataTimeFrame = (value: string) => {
        setTradingDataTimeFrame(value);
    };

    const StatsDisplay = ({ label, value }) => (
        <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.7rem' }} align="center">
                {label}
            </Typography>
            <Typography align="center" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                {value}
            </Typography>
            {/* {change !== undefined && (
                <Typography
                    align="center"
                    fontStyle={fontStyle}
                    sx={{
                        fontSize: '0.6rem',
                    }}
                >
                    {change}
                </Typography> */}
            {/* )} */}
        </Box>
    );

    //  const totalMintedDataToShow =
    //      tokenInfo.state === 'finished' ? '100%' : `${(tokenInfo.totalMintedPercent * 100).toFixed(8)}%`;
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
            {loading ? (
                <Skeleton key={1} width={'100%'} height={'11vh'} />
            ) : (
                stats && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '2vh',
                            columnGap: '1.5vw',
                            justifyContent: 'center',
                        }}
                    >
                        <StatsDisplay
                            label={`VOLUME (${tradingDataTimeFrame})`}
                            value={stats.volume ? `$${stats.volume}` : '---'}
                        />

                        <Divider orientation="vertical" flexItem />

                        <StatsDisplay
                            label={`TRADES (${tradingDataTimeFrame})`}
                            value={stats.historicalTotalMints || '---'}
                        />

                        <Divider orientation="vertical" flexItem />
                        <StatsDisplay label="TOTAL MINTED" value={stats.historicalTotalMints || '---'} />

                        <Divider orientation="vertical" flexItem />
                        <StatsDisplay
                            label={`PRICE PER TOKEN (${tradingDataTimeFrame})`}
                            value={
                                stats.historicalPrice !== undefined
                                    ? `${stats.historicalPrice.toFixed(7)} / KAS`
                                    : '---'
                            }
                            // change={
                            //     stats.changes?.priceChange
                            //         ? `${stats.changes.priceChange.toFixed(7)} / KAS`
                            //         : '---'
                            // }
                            // fontStyle={{ color: stats.changes.priceChange < 0 ? 'red' : 'green' }}
                        />

                        <Divider orientation="vertical" flexItem />

                        <StatsDisplay
                            label="HOLDERS"
                            value={stats.historicalTotalHolders}
                            // change={stats.changes.holdersChange}
                            // fontStyle={{ color: stats.changes.holdersChange < 0 ? 'red' : 'green' }}
                        />
                    </Box>
                )
            )}
        </Card>
    );
};

export default TokenStats;
