import { FC, useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Token } from '../../../types/Types';
import ScoreLine, { ScoreLineConfig } from '../../score-line/ScoreLine';

interface TokenRugScoreProps {
    tokenInfo: Token;
}

const TokenRugScore: FC<TokenRugScoreProps> = (props) => {
    const [score, setScore] = useState(null);

    const theme = useTheme();

    useEffect(() => {
        setTimeout(() => {
            setScore(Math.floor(Math.random() * 100));
        }, 1000);
    }, [props.tokenInfo]);

    const scoreLineRanges: ScoreLineConfig = {
        [theme.palette.error.main]: { start: 0, end: 45 },
        [theme.palette.warning.main]: { start: 45, end: 55 },
        [theme.palette.success.main]: { start: 55, end: 100 },
    };

    return (
        <Box sx={{ height: '10vh' }}>
            <Typography variant="h6" sx={{ fontWeight: '600', mb: 2 }}>
                Rug Score:
            </Typography>
            {score !== null ? <ScoreLine value={score} config={scoreLineRanges} /> : null}
        </Box>
    );
};

export default TokenRugScore;
