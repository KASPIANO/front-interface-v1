import { FC, useEffect, useState } from 'react';
import { Box, Card, Divider, Skeleton, Tooltip, Typography } from '@mui/material';
import OptionSelection from '../option-selection/OptionSelection';
import { BackendTokenResponse } from '../../../types/Types';
import { useFetchFloorPrice, useFetchHolderChange, useFetchTradeStats } from '../../../DAL/UseQueriesBackend';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material'; // Import arrow icons
import { formatNumberWithCommas } from '../../../utils/Utils';

interface TokenStatsProps {
    tokenInfo: BackendTokenResponse;
    tradingDataTimeFrame: string;
    setTradingDataTimeFrame: (value: string) => void;
    tradingDataTimeFramesToSelect;
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
    const { tokenInfo, setTradingDataTimeFrame, tradingDataTimeFrame, tradingDataTimeFramesToSelect } = props;
    const [totalVolumeUsd, setTotalVolumeUsd] = useState(0);

    const { data: holdersChange, isLoading: loading } = useFetchHolderChange(
        tokenInfo.ticker,
        tradingDataTimeFrame,
    );
    const { data: floorPrice } = useFetchFloorPrice(tokenInfo.ticker);
    const { data: tradeStats, isLoading: tradeloading } = useFetchTradeStats(
        tokenInfo.ticker,
        tradingDataTimeFrame,
    );
    const { data: tradeStats24, isLoading: tradeloading24 } = useFetchTradeStats(tokenInfo.ticker, '1d');

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
        return num.toFixed(7).replace(/\.?0+$/, '');
    };
    const holderChangeValue = tokenInfo.totalHolders - holdersChange?.totalHolders || 0;
    const holderChangeArrow = holderChangeValue > 0 ? 'positive' : 'negative';
    const totalMintedDataToShow =
        tokenInfo.state === 'finished' ? '100%' : `${(tokenInfo.totalMintedPercent * 100).toFixed(8)}%`;

    const displayPrice = floorPrice?.floor_price
        ? formatPrice(Math.min(floorPrice.floor_price, tokenInfo.price))
        : 0;

    useEffect(() => {
        if (!tradeloading24 && tradeStats24) {
            // Parse and calculate totalVolumeUsd
            const volumeUsdKaspiano = tradeStats24?.totalVolumeUsdKaspiano
                ? parseFloat(tradeStats24.totalVolumeUsdKaspiano)
                : 0;
            const volumeUsdTokenInfo = Number.isFinite(tokenInfo?.volumeUsd) ? tokenInfo.volumeUsd : 0;

            const calculatedVolumeUsd = volumeUsdKaspiano + volumeUsdTokenInfo;

            // Update the state with the calculated value
            setTotalVolumeUsd(calculatedVolumeUsd);
        }
    }, [tradeloading24, tradeStats24, tokenInfo?.volumeUsd, tokenInfo?.volumeKas]);

    // Format the total volume for display
    const formattedTotalVolumeUsd =
        totalVolumeUsd > 0 ? `${formatNumberWithCommas(totalVolumeUsd.toFixed(0))}$` : '0$';

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
            {loading || tradeloading || tradeloading24 ? (
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
                    <Tooltip title="Total trading volume across all markets in the last 24 hours, displayed in USD">
                        <span>
                            <StatsDisplay label={`VOLUME (1d)`} value={formattedTotalVolumeUsd} />
                        </span>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem />

                    <StatsDisplay
                        label={`TRADES (${tradingDataTimeFrame})`}
                        value={tradeStats.totalTradesKaspiano ? tradeStats.totalTradesKaspiano : 0}
                    />
                    <Divider orientation="vertical" flexItem />
                    <StatsDisplay label={'FLOOR PRICE(KAS)'} value={displayPrice} />

                    <Divider orientation="vertical" flexItem />
                    <StatsDisplay label="TOTAL MINTED" value={totalMintedDataToShow} />

                    <Divider orientation="vertical" flexItem />
                    <Tooltip title="Total number of unique addresses holding this token. The secondary number shows the change in holders during the selected timeframe.">
                        <span>
                            <StatsDisplay
                                label="HOLDERS"
                                value={tokenInfo.totalHolders}
                                secondary={tradingDataTimeFrame === 'All' ? '---' : holderChangeValue.toString()}
                                arrow={tradingDataTimeFrame === 'All' ? null : holderChangeArrow}
                            />
                        </span>
                    </Tooltip>
                </Box>
            )}
        </Card>
    );
};

export default TokenStats;
