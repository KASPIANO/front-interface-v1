import { FC, useState } from 'react';
import { Box, Card, Divider, Typography } from '@mui/material';
import OptionSelection from '../option-selection/OptionSelection';

const TokenStats: FC = () => {
    const tradingDataTimeFramesToSelect = ['All', '1m', '1w', '1d'];
    const [tradingDataTimeFrame, setTradingDataTimeFrame] = useState(
        tradingDataTimeFramesToSelect[tradingDataTimeFramesToSelect.length - 1],
    );

    const updateTradingDataTimeFrame = (value: string) => {
        setTradingDataTimeFrame(value);
    };

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
                    columnGap: '3vw',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" align="center">
                        TRADES ({tradingDataTimeFrame})
                    </Typography>
                    <Typography variant="body2" align="center">
                        -
                    </Typography>
                </Box>

                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" align="center">
                        VOLUME ({tradingDataTimeFrame})
                    </Typography>
                    <Typography variant="body2" align="center">
                        -
                    </Typography>
                </Box>

                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" align="center">
                        PENDING BUYS
                    </Typography>
                    <Typography variant="body2" align="center">
                        -
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default TokenStats;
