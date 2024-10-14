import { FC, useState } from 'react';
import { Box, Card, Divider, Skeleton, Typography } from '@mui/material';
import OptionSelection from '../option-selection/OptionSelection';
import { BackendTokenResponse } from '../../../types/Types';
import { useFetchFloorPrice, useFetchHolderChange, useFetchTradeStats } from '../../../DAL/UseQueriesBackend';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material'; // Import arrow icons

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

    const { data: holdersChange, isLoading: loading } = useFetchHolderChange(
        tokenInfo.ticker,
        tradingDataTimeFrame,
    );
    const { data: floorPrice, isLoading: floorPriceLoading } = useFetchFloorPrice(tokenInfo.ticker);
    const { data: tradeStats, isLoading: tradeloading } = useFetchTradeStats(
        tokenInfo.ticker,
        tradingDataTimeFrame,
    );

    const updateTradingDataTimeFrame = (value: string) => {
        setTradingDataTimeFrame(value);
    };

    const StatsDisplay = ({ label, value, secondary = null, arrow = null }) => (
        <Box>
            <Typography sx={{ fontSize: '0.7rem' }} align="center">
                {label}
            </Typography>
            <Typography align="center" sx={{ fontSize: '0.65rem', fontWeight: 'bold' }}>
                {value}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {secondary && (
                    <Typography
                        align="center"
                        sx={{
                            fontSize: '0.65rem',
                        }}
                    >
                        {secondary}
                    </Typography>
                )}
                {arrow && (
                    <Box
                        sx={{
                            color: arrow === 'positive' ? '#4CAF50' : '#F44336',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {arrow === 'positive' ? (
                            <ArrowDropUp sx={{ fontSize: '1rem' }} />
                        ) : (
                            <ArrowDropDown sx={{ fontSize: '1rem' }} />
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );

    const formatPrice = (value) => {
        const num = parseFloat(value);

        // Fix the number to 10 decimal places, then remove unnecessary trailing zeros
        return num.toFixed(10).replace(/\.?0+$/, '');
    };
    const holderChangeValue = tokenInfo.totalHolders - holdersChange?.totalHolders || 0;
    const holderChangeArrow = holderChangeValue > 0 ? 'positive' : 'negative';
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
            {loading || tradeloading ? (
                <Skeleton key={1} width={'100%'} height={'11vh'} />
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        mt: '1rem',
                        columnGap: '0.8rem',
                        justifyContent: 'center',
                    }}
                >
                    <StatsDisplay
                        label={`VOLUME (${tradingDataTimeFrame})`}
                        value={
                            tradeStats.totalVolumeKasKaspiano
                                ? `${parseFloat(tradeStats.totalVolumeKasKaspiano).toFixed(0)} KAS`
                                : null
                        }
                        secondary={
                            tradeStats.totalVolumeUsdKaspiano
                                ? `${parseFloat(tradeStats.totalVolumeUsdKaspiano).toFixed(0)}$`
                                : null
                        }
                    />

                    <Divider orientation="vertical" flexItem />

                    <StatsDisplay
                        label={`TRADES (${tradingDataTimeFrame})`}
                        value={tradeStats.totalTradesKaspiano ? tradeStats.totalTradesKaspiano : 0}
                    />
                    <Divider orientation="vertical" flexItem />
                    <StatsDisplay
                        label={'FLOOR PRICE(KAS)'}
                        value={floorPrice?.floor_price ? formatPrice(floorPrice.floor_price) : tokenInfo.price}
                    />

                    <Divider orientation="vertical" flexItem />
                    <StatsDisplay label="TOTAL MINTED" value={totalMintedDataToShow} />

                    <Divider orientation="vertical" flexItem />

                    <StatsDisplay
                        label="HOLDERS"
                        value={tokenInfo.totalHolders}
                        secondary={tradingDataTimeFrame === 'All' ? '---' : holderChangeValue.toString()}
                        arrow={holderChangeArrow}
                    />
                </Box>
            )}
        </Card>
    );
};

export default TokenStats;
