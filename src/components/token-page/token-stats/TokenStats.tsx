import { FC, useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
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
        <Card sx={{ height: '20vh' }}>
            <OptionSelection
                options={tradingDataTimeFramesToSelect}
                value={tradingDataTimeFrame}
                onChange={updateTradingDataTimeFrame}
            />
            <Box>
                <Typography variant="body2" align="center">
                    TRADES ({tradingDataTimeFrame})
                </Typography>
                <Typography variant="body2" align="center">
                    -
                </Typography>
            </Box>
            <Box>
                <Typography variant="body2" align="center">
                    VOLUME ({tradingDataTimeFrame})
                </Typography>
                <Typography variant="body2" align="center">
                    -
                </Typography>
            </Box>
            <Box>
                <Typography variant="body2" align="center">
                    PENDING BUYS
                </Typography>
                <Typography variant="body2" align="center">
                    -
                </Typography>
            </Box>
        </Card>
    );
};

export default TokenStats;
