import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Card, CircularProgress, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { FC, useState } from 'react';
import ScoreLine, { ScoreLineConfig } from './score-line/ScoreLine';
import { UpdateMetadataDialog } from '../update-metadata-dialog/UpdateMetadataDialog';

interface RugScoreProps {
    score: number | null;
    xHandle: boolean;
    onRecalculate: () => void;
    walletBalance: number;
    ticker: string;
    walletConnected: boolean;
    walletAddress: string | null;
    setTokenInfo: (tokenInfo: any) => void;
    isLoadingRugScore: boolean;
}

const RugScore: FC<RugScoreProps> = (props) => {
    const {
        score,
        xHandle,
        onRecalculate,
        walletBalance,
        ticker,
        walletConnected,
        walletAddress,
        setTokenInfo,
        isLoadingRugScore,
    } = props;
    const theme = useTheme();
    const [showInfoForm, setShowInfoForm] = useState(false);

    const scoreLineRanges: ScoreLineConfig = {
        [theme.palette.error.main]: { start: 0, end: 34 },
        [theme.palette.warning.main]: { start: 35, end: 69 },
        [theme.palette.success.main]: { start: 70, end: 100 },
    };

    const handleOpenDialog = () => {
        setShowInfoForm(true);
    };

    return (
        <Card
            sx={{
                height: '18vh',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 'bold', mr: 1, fontSize: '0.75rem' }}
                    >
                        RUG SCORE
                    </Typography>
                    <Tooltip title="The Rug Score is an algorithm based on token collection metrics and social media footprints. The score ranges from 1 to 100, with 100 being the best. It represents the collection's transparency and trustworthiness. If you find the score unsatisfactory, you can send a request to review it with the 'Send Request' button near the token header.">
                        <InfoOutlinedIcon
                            sx={{
                                fontSize: '0.9rem',
                            }}
                            fontSize="small"
                        />
                    </Tooltip>
                </Box>
                {xHandle && (
                    <Tooltip title="Click to recalculate the Rug Score.">
                        {isLoadingRugScore ? (
                            <CircularProgress
                                size={24}
                                thickness={5}
                                sx={{
                                    padding: 0,
                                }}
                            />
                        ) : (
                            <IconButton
                                onClick={onRecalculate}
                                aria-label="recalculate score"
                                sx={{
                                    padding: 0,
                                }}
                            >
                                <RefreshIcon
                                    sx={{
                                        fontSize: '1rem',
                                    }}
                                />
                            </IconButton>
                        )}
                    </Tooltip>
                )}
            </Box>
            {!xHandle && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: '3vh' }}>
                    <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenDialog}>
                        Add Rug Score
                    </Button>
                </Box>
            )}
            {xHandle && score === null ? (
                <Typography
                    sx={{
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'center',
                        mt: '3vh',
                        fontSize: '0.8rem',
                    }}
                >
                    NO SCORE - Send New Request
                </Typography>
            ) : null}
            {xHandle && score !== null ? <ScoreLine value={score} config={scoreLineRanges} /> : null}

            <UpdateMetadataDialog
                open={showInfoForm}
                onClose={() => setShowInfoForm(false)}
                walletConnected={walletConnected}
                setTokenInfo={setTokenInfo}
                walletBalance={walletBalance}
                walletAddress={walletAddress}
                ticker={ticker}
            />
        </Card>
    );
};

export default RugScore;
