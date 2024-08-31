import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Card, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { FC, useCallback, useState } from 'react';
import { fetchWalletBalance } from '../../../DAL/KaspaApiDal';
import { getCurrentAccount, sendKaspa } from '../../../utils/KaswareUtils';
import { setWalletBalanceUtil } from '../../../utils/Utils';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import RugScoreDialog from './dialog/RugScoreDialog';
import ScoreLine, { ScoreLineConfig } from './score-line/ScoreLine';

interface RugScoreProps {
    score: number | null;
    xHandle: boolean;
    onRecalculate: () => void;
    setWalletBalance: (balance: number) => void;
}

const KASPA_TO_SOMPI = 100000000; // 1 KAS = 100,000,000 sompi
const VERIFICATION_FEE_KAS = 20;
const VERIFICATION_FEE_SOMPI = VERIFICATION_FEE_KAS * KASPA_TO_SOMPI;

const RugScore: FC<RugScoreProps> = (props) => {
    const { score, xHandle, onRecalculate, setWalletBalance } = props;
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);

    const scoreLineRanges: ScoreLineConfig = {
        [theme.palette.error.main]: { start: 0, end: 30 },
        [theme.palette.warning.main]: { start: 35, end: 69 },
        [theme.palette.success.main]: { start: 72, end: 100 },
    };

    const onAddTwitterHandle = useCallback(
        async (twitterHandle: string, instantVerification: boolean) => {
            try {
                if (instantVerification) {
                    // Replace 'YOUR_KASPA_ADDRESS' with the actual address to receive the verification fee
                    const txid = await sendKaspa(
                        'kaspatest:qrzsn5eu6s28evw0k26qahjn0nwwzwjgn0qp3p37zl7z5lvx64h923agfaskv',
                        VERIFICATION_FEE_SOMPI,
                    );

                    // Get the current account's address
                    const account = await getCurrentAccount();

                    showGlobalSnackbar({ message: 'Instant verification successful', severity: 'success' });
                    setTimeout(() => {
                        fetchWalletBalance(account).then((balance) =>
                            setWalletBalance(setWalletBalanceUtil(balance)),
                        );
                        console.log('Sending to backend:', { twitterHandle, instantVerification: true, txid });
                    }, 5000);
                } else {
                    // For manual verification, just log the information
                    console.log('Sending to backend:', { twitterHandle, instantVerification: false });

                    showGlobalSnackbar({
                        message: 'Twitter handle submitted for manual review',
                        severity: 'success',
                    });
                }

                // Update the xHandle state or other relevant states here
                console.log('Twitter handle added successfully');
            } catch (error) {
                console.error('Error processing Twitter handle:', error);
                showGlobalSnackbar({
                    message: 'Failed to process Twitter handle',
                    severity: 'error',
                    details: error.message,
                });
            }
        },
        [setWalletBalance],
    );

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAddTwitterHandle = (twitterHandle: string, instantVerification: boolean) => {
        onAddTwitterHandle(twitterHandle, instantVerification);
        handleCloseDialog();
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
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>
                        RUG SCORE
                    </Typography>
                    <Tooltip title="The Rug Score is an algorithm based on token collection metrics and social media footprints. The score ranges from 1 to 100, with 100 being the best. It represents the collection's transparency and trustworthiness. If you find the score unsatisfactory, you can send a request to review it with the 'Send Request' button near the token header.">
                        <InfoOutlinedIcon fontSize="small" />
                    </Tooltip>
                </Box>
                {xHandle && (
                    <Tooltip title="Click to recalculate the Rug Score.">
                        <IconButton onClick={onRecalculate} aria-label="recalculate score" sx={{ padding: 0 }}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            {!xHandle && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: '3vh' }}>
                    <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleOpenDialog}>
                        List Project to show score
                    </Button>
                </Box>
            )}
            {xHandle && score !== null ? <ScoreLine value={score} config={scoreLineRanges} /> : null}

            <RugScoreDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onAddTwitterHandle={handleAddTwitterHandle}
            />
        </Card>
    );
};

export default RugScore;
