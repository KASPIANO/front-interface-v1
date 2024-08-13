import { FC } from 'react';
import { Card, Typography, useTheme, IconButton, Tooltip, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScoreLine, { ScoreLineConfig } from './score-line/ScoreLine';

interface RugScoreProps {
    score: number | null;
    onRecalculate: () => void;
}

const RugScore: FC<RugScoreProps> = ({ score, onRecalculate }) => {
    const theme = useTheme();
    const scoreLineRanges: ScoreLineConfig = {
        [theme.palette.error.main]: { start: 0, end: 30 },
        [theme.palette.warning.main]: { start: 35, end: 69 },
        [theme.palette.success.main]: { start: 72, end: 100 },
    };

    return (
        <Card sx={{ height: '19vh', padding: '0px 10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>
                        RUG SCORE
                    </Typography>
                    <Tooltip title="The Rug Score is an algorithm based on token collection metrics and social media footprints. The score ranges from 1 to 100, with 100 being the best. It represents the collection's transparency and trustworthiness. If you find the score unsatisfactory, you can send a request to review it with the 'Send Request' button near the token header.">
                        <InfoOutlinedIcon fontSize="small" />
                    </Tooltip>
                </Box>
                <Tooltip title="Click to recalculate the Rug Score.">
                    <IconButton onClick={onRecalculate} aria-label="recalculate score">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            {score !== null ? <ScoreLine value={score} config={scoreLineRanges} /> : null}
        </Card>
    );
};

export default RugScore;
