import { FC, useEffect, useState } from 'react';
import { BackendTokenMetadata, BackendTokenResponse, TokenKRC20DeployMetadata } from '../../../types/Types';
import ReviewListTokenDialog from '../../dialogs/token-info/review-list-token/ReviewListTokenDialog';
import TokenInfoDialog from '../../dialogs/token-info/TokenInfoDialog';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { sendKaspaToKaspiano } from '../../../utils/KaswareUtils';
import { isEmptyStringOrArray } from '../../../utils/Utils';
import { sendServerRequestAndSetErrorsIfNeeded, updateTokenMetadata } from '../../../DAL/BackendDAL';
import SuccessModal from '../../modals/sent-token-info-success/SuccessModal';

interface UpdateMetadataDialogProps {
    open: boolean;
    walletBalance: number;
    ticker: string;
    walletConnected: boolean;
    walletAddress: string | null;
    setTokenInfo: (tokenInfo: any) => void;
    onClose: () => void;
}

const KASPA_TO_SOMPI = 100000000; // 1 KAS = 100,000,000 sompi
const VERIFICATION_FEE_KAS = 650;
const VERIFICATION_FEE_SOMPI = VERIFICATION_FEE_KAS * KASPA_TO_SOMPI;

export const UpdateMetadataDialog: FC<UpdateMetadataDialogProps> = (props) => {
    const { walletBalance, ticker, walletConnected, walletAddress, setTokenInfo } = props;

    const [showInfoForm, setShowInfoForm] = useState(false);
    const [showReviewListTokenDialog, setShowReviewListTokenDialog] = useState(false);
    const [tokenMetadataDetails, setTokenMetadataDetails] = useState<TokenKRC20DeployMetadata>({
        x: '',
        email: '',
    });
    const [updateMetadataPaymentTransactionId, setUpdateMetadataPaymentTransactionId] = useState<string | null>(
        null,
    );
    const [isUpadteMetadataLoading, setIsUpdateMetadataLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (props.open) {
            if (!walletConnected) {
                showGlobalSnackbar({
                    message: 'Wallet not connected, Please connect your wallet',
                    severity: 'error',
                });
                props.onClose();
            } else {
                setShowInfoForm(props.open);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open]);

    const handleTokenListing = async (): Promise<boolean> => {
        if (!tokenMetadataDetails) return;

        let currentMetadataPaymentTransactionId = updateMetadataPaymentTransactionId;

        if (walletBalance < VERIFICATION_FEE_KAS) {
            showGlobalSnackbar({
                message: 'Insufficient funds to list token',
                severity: 'error',
            });
            return false;
        }

        let metadataUpdateFeeTransactionId = null;

        try {
            const metadataFeeTransaction = await sendKaspaToKaspiano(VERIFICATION_FEE_SOMPI);

            // TODO: GET REAL TRANSACTION ID FROM RESPONSE
            metadataUpdateFeeTransactionId = metadataFeeTransaction.id;
            setUpdateMetadataPaymentTransactionId(metadataUpdateFeeTransactionId);
            currentMetadataPaymentTransactionId = metadataUpdateFeeTransactionId;

            showGlobalSnackbar({
                message: 'Payment successful',
                severity: 'success',
                txIds: [metadataUpdateFeeTransactionId],
            });
        } catch (error) {
            console.log(error);
            showGlobalSnackbar({
                message: 'Payment failed',
                severity: 'error',
            });

            return false;
        }

        if (currentMetadataPaymentTransactionId) {
            setIsUpdateMetadataLoading(true);

            // Token listing request to backend
            const tokenDetailsForm = new FormData();

            tokenDetailsForm.append('ticker', ticker.toUpperCase());
            tokenDetailsForm.append('walletAddress', walletAddress);
            tokenDetailsForm.append('transactionHash', currentMetadataPaymentTransactionId);

            for (const [key, value] of Object.entries(tokenMetadataDetails)) {
                if (value instanceof File || !isEmptyStringOrArray(value as any)) {
                    tokenDetailsForm.append(key, value as string);
                }
            }

            try {
                const result: BackendTokenMetadata | null =
                    (await sendServerRequestAndSetErrorsIfNeeded<BackendTokenMetadata>(
                        async () => updateTokenMetadata(tokenDetailsForm),
                        (errors) => console.error(errors),
                    )) as BackendTokenMetadata | null;

                if (!result) {
                    throw new Error('Failed to save token metadata');
                }

                setShowSuccessModal(true);
                setShowReviewListTokenDialog(false);
                setUpdateMetadataPaymentTransactionId(null);

                setTokenInfo((prevInfo: BackendTokenResponse) => {
                    const updatedInfo: BackendTokenResponse = {
                        ...prevInfo,
                        metadata: {
                            ...prevInfo.metadata,
                            ...result,
                        },
                    };

                    return updatedInfo;
                });

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
            }
        }

        return false;
    };

    const handleCloseShowInfoDialog = () => {
        setShowInfoForm(false);
        props.onClose();
    };

    const handleReviewListTokenCloseDialog = () => {
        setShowReviewListTokenDialog(false);
        props.onClose();
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        props.onClose();
    };

    const onSaveTokenMetadata = async (tokenMetadata: any) => {
        setTokenMetadataDetails(tokenMetadata);
        setShowInfoForm(false);
        setShowReviewListTokenDialog(true);
    };

    return (
        <>
            {showInfoForm && (
                <TokenInfoDialog
                    open={showInfoForm}
                    onClose={handleCloseShowInfoDialog}
                    onSave={onSaveTokenMetadata}
                />
            )}
            {showReviewListTokenDialog && tokenMetadataDetails && (
                <ReviewListTokenDialog
                    walletConnected={walletConnected}
                    open={showReviewListTokenDialog}
                    onClose={handleReviewListTokenCloseDialog}
                    onList={handleTokenListing}
                    tokenMetadata={tokenMetadataDetails}
                    isSavingData={isUpadteMetadataLoading}
                />
            )}

            <SuccessModal open={showSuccessModal} onClose={handleCloseSuccessModal} />
        </>
    );
};
