import { FC, useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Token } from '../../../types/Types';
import ScoreLine, { ScoreLineConfig } from '../../score-line/ScoreLine';
import { DataPaper, DataRowContainer, TitleTypography, ValueTypography } from './TokenStats.s';
import OptionSelection from '../option-selection/OptionSelection';
import _ from 'lodash';

interface TokenStatsProps {
    tokenInfo: Token;
}

const TokenStats: FC<TokenStatsProps> = (props) => {
    const numberOfHoldersToSelect = [10, 20, 30, 40, 50];
    const tradingDataTimeFramesToSelect = ['All', '1m', '1w', '1d'];

    const [score, setScore] = useState(null);
    const [tokenHolders, setTokenHolders] = useState(props.tokenInfo?.holder || []);
    const [tokenHoldersToShow, setTokenHoldersToShow] = useState(numberOfHoldersToSelect[0]);
    const [topHoldersPercantage, setTopHoldersPercantage] = useState('---');
    const [tradingDataTimeFrame, setTradingDataTimeFrame] = useState(tradingDataTimeFramesToSelect[tradingDataTimeFramesToSelect.length - 1]);
    const theme = useTheme();
    const scoreLineRanges: ScoreLineConfig = {
        [theme.palette.error.main]: { start: 0, end: 45 },
        [theme.palette.warning.main]: { start: 45, end: 55 },
        [theme.palette.success.main]: { start: 55, end: 100 },
    };

    const updateTokenHoldersToShow = (value: number) => {
        setTokenHoldersToShow(value);
    };

    const updateTradingDataTimeFrame = (value: string) => {
        setTradingDataTimeFrame(value);
    };

    useEffect(() => {
        setTimeout(() => {
            setTokenHolders(props.tokenInfo?.holder || []);
            setScore(Math.floor(Math.random() * 100));
        }, 1000);
    }, [props.tokenInfo]);

    useEffect(() => {
        const holdersToCalaulate = tokenHolders.slice(0, tokenHoldersToShow);

        const totalHolding = _.sum(_.map(holdersToCalaulate, (h) => parseFloat(h.amount)));

        if (props.tokenInfo?.minted && props.tokenInfo?.minted !== '0') {
            const totalPercentage = (totalHolding / parseFloat(props.tokenInfo?.minted || '0')) * 100;

            setTopHoldersPercantage(`${totalPercentage.toFixed(2)}%`);
        } else {
            setTopHoldersPercantage('---');
        }
    }, [tokenHoldersToShow, tokenHolders, props.tokenInfo?.minted]);



    return (
        <Box>
            <DataRowContainer gap={1}>
                <DataPaper elevation={1} sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2" align="center" color="text.secondary">
                        RUG SCORE
                    </Typography>
                    {score !== null ? <ScoreLine value={score} config={scoreLineRanges} /> : null}
                </DataPaper>
                <DataPaper elevation={1} sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ mr: 1 }} color="text.secondary">
                        TOP HOLDERS
                    </Typography>
                    <OptionSelection
                        options={numberOfHoldersToSelect}
                        value={tokenHoldersToShow}
                        onChange={updateTokenHoldersToShow}
                    />
                    <Typography variant="h5" sx={{ mr: 1 }}>
                        {topHoldersPercantage}
                    </Typography>
                </DataPaper>
            </DataRowContainer>
            <Box mt={1}>
            <OptionSelection
                        options={tradingDataTimeFramesToSelect}
                        value={tradingDataTimeFrame}
                        onChange={updateTradingDataTimeFrame}
                    />
            </Box>
            <DataRowContainer mt={1} gap={1}>
                <DataPaper elevation={1}>
                    <TitleTypography variant="body2" align="center">
                        TRADES ({tradingDataTimeFrame})
                    </TitleTypography>
                    <ValueTypography variant="body2" align="center">
                        -
                    </ValueTypography>
                </DataPaper>
                <DataPaper elevation={1}>
                    <TitleTypography variant="body2" align="center">
                        VOLUME ({tradingDataTimeFrame})
                    </TitleTypography>
                    <ValueTypography variant="body2" align="center">
                        -
                    </ValueTypography>
                </DataPaper>
                <DataPaper elevation={1}>
                    <TitleTypography variant="body2" align="center">
                        PENDING BUYS
                    </TitleTypography>
                    <ValueTypography variant="body2" align="center">
                        -
                    </ValueTypography>
                </DataPaper>
            </DataRowContainer>
        </Box>
    );
};

export default TokenStats;
