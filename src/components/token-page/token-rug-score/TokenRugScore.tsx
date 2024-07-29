import { FC, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Token } from '../../../types/Types';
import { ScoreLine } from './TokenRugScore.s';

interface TokenRugScoreProps {
    tokenInfo: Token
}

const TokenRugScore: FC<TokenRugScoreProps> = props => {
    const [score, setScore] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setScore(Math.floor(Math.random() * 100));
            console.log(score);
        }, 1000)
    }, [props.tokenInfo]);

    return (
        <Box sx={{mb: 2}}>
                <Typography variant='h5' sx={{ fontWeight: '600', mb: 2 }}>
                    Rug Score
                </Typography>
                { score !== null ? <ScoreLine variant="determinate" value={score} /> : null }
        </Box>
    );
};

export default TokenRugScore