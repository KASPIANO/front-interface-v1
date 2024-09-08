import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Card, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { FC, useState } from 'react';
import { fetchWalletBalance } from '../../../DAL/KaspaApiDal';
import { getCurrentAccount, sendKaspa } from '../../../utils/KaswareUtils';
import { setWalletBalanceUtil } from '../../../utils/Utils';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import ScoreLine, { ScoreLineConfig } from './score-line/ScoreLine';
import TokenInfoDialog from '../../dialogs/token-info/TokenInfoDialog';
import ReviewListTokenDialog from '../../dialogs/token-info/review-list-token/ReviewListTokenDialog';
import { TokenKRC20DeployMetadata } from '../../../types/Types';
import { useNavigate } from 'react-router-dom';
import { updateTokenMetadata } from '../../../DAL/BackendDAL';

interface RugScoreProps {
    score: number | null;
    xHandle: boolean;
    onRecalculate: () => void;
    setWalletBalance: (balance: number) => void;
    walletBalance: number;
    ticker: string;
    walletConnected: boolean;
}

const KASPA_TO_SOMPI = 100000000; // 1 KAS = 100,000,000 sompi
const VERIFICATION_FEE_KAS = 1250;
const VERIFICATION_FEE_SOMPI = VERIFICATION_FEE_KAS * KASPA_TO_SOMPI;

const RugScore: FC<RugScoreProps> = (props) => {
    const { score, xHandle, onRecalculate, setWalletBalance, walletBalance, ticker, walletConnected } = props;
    const theme = useTheme();
    const navigate = useNavigate();
    const [showInfoForm, setShowInfoForm] = useState(false);
    const [showReviewListTokenDialog, setShowReviewListTokenDialog] = useState(false);
    const [tokenMetadataDetails, setTokenMetadataDetails] = useState<TokenKRC20DeployMetadata>({});
    const [updateMetadataPaymentTransactionId, setUpdateMetadataPaymentTransactionId] = useState<string | null>(
        null,
    );
    const [isUpadteMetadataLoading, setIsUpdateMetadataLoading] = useState(false);

    const scoreLineRanges: ScoreLineConfig = {
        [theme.palette.error.main]: { start: 0, end: 30 },
        [theme.palette.warning.main]: { start: 35, end: 69 },
        [theme.palette.success.main]: { start: 72, end: 100 },
    };

    const handleOpenDialog = () => {
        setShowInfoForm(true);
    };

    const handleCloseDialog = () => {
        setShowInfoForm(false);
    };

    const onSaveTokenMetadata = async (tokenMetadata: any) => {
        setTokenMetadataDetails(tokenMetadata);
        setShowReviewListTokenDialog(true);
    };

    const handleTokenListing = async (): Promise<boolean> => {
        if (!tokenMetadataDetails) return;
        console.log('Token metadata:', tokenMetadataDetails);
        console.log('VERIFICATION_FEE_KAS', VERIFICATION_FEE_KAS);

        let currentMetadataPaymentTransactionId = updateMetadataPaymentTransactionId;

        if (!currentMetadataPaymentTransactionId) {
            if (walletBalance < VERIFICATION_FEE_KAS) {
                showGlobalSnackbar({
                    message: 'Insufficient funds to list token',
                    severity: 'error',
                });
                return false;
            }

            const metadataUpdateFeeTransactionId = await sendKaspa(
                'kaspatest:qrzsn5eu6s28evw0k26qahjn0nwwzwjgn0qp3p37zl7z5lvx64h923agfaskv',
                VERIFICATION_FEE_SOMPI,
            );

            if (metadataUpdateFeeTransactionId) {
                setUpdateMetadataPaymentTransactionId(metadataUpdateFeeTransactionId);
                currentMetadataPaymentTransactionId = metadataUpdateFeeTransactionId;

                showGlobalSnackbar({
                    message: 'Payment successful',
                    severity: 'success',
                });

                const account = await getCurrentAccount();
                const balance = await fetchWalletBalance(account);
                setWalletBalance(setWalletBalanceUtil(balance));
            } else {
                showGlobalSnackbar({
                    message: 'Payment failed',
                    severity: 'error',
                });

                return false;
            }
        }

        if (currentMetadataPaymentTransactionId) {
            setIsUpdateMetadataLoading(true);

            // Token listing request to backend
            const tokenDetailsForm = new FormData();

            tokenDetailsForm.append('ticker', ticker.toUpperCase());
            tokenDetailsForm.append('transactionHash', updateMetadataPaymentTransactionId);

            for (const [key, value] of Object.entries(tokenMetadataDetails)) {
                tokenDetailsForm.append(key, value as string);
            }

            try {
                const result = await updateTokenMetadata(tokenDetailsForm);

                if (!result) {
                    throw new Error('Failed to save token metadata');
                }

                showGlobalSnackbar({
                    message: 'Token listed successfully',
                    severity: 'success',
                });
                setShowReviewListTokenDialog(false);

                setTimeout(() => {
                    navigate(`/token/${ticker}`);
                }, 0);

                return true;
            } catch (error) {
                showGlobalSnackbar({
                    message: 'Error listing token, Please check the data or try again later',
                    severity: 'error',
                });
                console.error(error);

                return false;
            } finally {
                setIsUpdateMetadataLoading(false);
                setUpdateMetadataPaymentTransactionId(null);
                setTokenMetadataDetails({});
            }
        }

        return false;
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
            {xHandle && score === null ? (
                <Typography
                    sx={{
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'center',
                        mt: '3vh',
                    }}
                >
                    Send New Request by Clicking Refresh Button
                </Typography>
            ) : null}
            {xHandle && score !== null ? <ScoreLine value={score} config={scoreLineRanges} /> : null}

            {showInfoForm && (
                <TokenInfoDialog open={showInfoForm} onClose={handleCloseDialog} onSave={onSaveTokenMetadata} />
            )}
            {showReviewListTokenDialog && tokenMetadataDetails && (
                <ReviewListTokenDialog
                    walletConnected={walletConnected}
                    open={showReviewListTokenDialog}
                    onClose={() => setShowReviewListTokenDialog(false)}
                    onList={handleTokenListing}
                    tokenMetadata={tokenMetadataDetails}
                    isPaid={updateMetadataPaymentTransactionId !== null}
                    isSavingData={isUpadteMetadataLoading}
                />
            )}
        </Card>
    );
};

export default RugScore;
