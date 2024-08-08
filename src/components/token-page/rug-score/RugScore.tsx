import { FC } from 'react';
import { Card, Typography, useTheme } from '@mui/material';
import ScoreLine, { ScoreLineConfig } from './score-line/ScoreLine';

interface RugScoreProps {
    score: number | null;
}

const RugScore: FC<RugScoreProps> = ({ score }) => {
    const theme = useTheme();
    const scoreLineRanges: ScoreLineConfig = {
        [theme.palette.error.main]: { start: 0, end: 30 },
        [theme.palette.warning.main]: { start: 35, end: 69 },
        [theme.palette.success.main]: { start: 72, end: 100 },
    };

    return (
        <Card sx={{ height: '19vh' }}>
            <Typography variant="body2" align="center" color="text.secondary">
                RUG SCORE
            </Typography>
            {score !== null ? <ScoreLine value={score} config={scoreLineRanges} /> : null}
        </Card>
    );
};

export default RugScore;
