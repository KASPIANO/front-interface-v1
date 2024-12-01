import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button, Container, Grid, IconButton, Input, Tooltip, Typography } from '@mui/material';
import React, { FC, useCallback, useState } from 'react';
import { showGlobalSnackbar } from '../../components/alert-context/AlertContext';
import ReviewListTokenDialog from '../../components/dialogs/token-info/review-list-token/ReviewListTokenDialog';
import {
    BackendValidationErrorsType,
    fetchTokenByTicker,
    saveDeployData,
    sendServerRequestAndSetErrorsIfNeeded,
    updateTokenMetadata,
} from '../../DAL/BackendDAL';
import {
    clearFieldErrors,
    clearFieldErrorsAndSetFieldValue,
    clearFormErrors,
    getErrorMessage,
    hasErrors,
    setErrorToField,
} from '../../utils/BackendValidationErrorsHandler';
import { convertToProtocolFormat, doPolling, isEmptyString, isEmptyStringOrArray } from '../../utils/Utils';
import {
    DeployForm,
    ImagePreview,
    Info,
    TextInfo,
    TextInfoTicker,
    UploadButton,
    UploadContainer,
} from './DeployPage.s';
import { TokenKRC20Deploy, TokenKRC20DeployMetadata } from '../../types/Types';
import DeployDialog from '../../components/deploy-page/deploy-dialog/DeployDialog';
import debounce from 'lodash/debounce';
import { fetchTokenInfo } from '../../DAL/Krc20DAL';
import { deployKRC20Token, sendKaspaToKaspiano } from '../../utils/KaswareUtils';

import SuccessModal from '../../components/modals/sent-token-info-success/SuccessModal';

interface DeployPageProps {
    walletBalance: number;
    backgroundBlur: boolean;
    walletConnected: boolean;
    walletAddress: string | null;
}

const KASPA_TO_SOMPI = 100000000; // 1 KAS = 100,000,000 sompi
const VERIFICATION_FEE_KAS = 650;
const VERIFICATION_FEE_SOMPI = VERIFICATION_FEE_KAS * KASPA_TO_SOMPI;

const DeployPage: FC<DeployPageProps> = (props) => {
    const { walletBalance, backgroundBlur, walletConnected, walletAddress } = props;
    const [tokenName, setTokenName] = useState('');
    const [validatedTokenName, setValidatedTokenName] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [mintLimit, setMintLimit] = useState('');
    const [preAllocation, setPreAllocation] = useState('');
    const [preAllocationPercentage, setPreAllocationPercentage] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [x, setX] = useState('');
    const [discord, setDiscord] = useState('');
    const [telegram, setTelegram] = useState('');
    const [whitepaper, setWhitepaper] = useState('');
    const [medium, setMedium] = useState('');
    const [github, setGithub] = useState('');
    const [audit, setAudit] = useState('');
    const [foundersHandles, setFoundersHandles] = useState('');
    const [contacts, setContacts] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);
    const [showDeployDialog, setShowDeployDialog] = useState(false);
    const [tokenKRC20Details, setTokenKRC20Details] = useState<TokenKRC20Deploy | null>();
    const [tokenMetadataDetails, setTokenMetadataDetails] = useState<TokenKRC20DeployMetadata | null>(null);
    const [tickerMessage, setTickerMessage] = useState('');
    const [formErrors, setFormErrors] = useState<BackendValidationErrorsType>({});
    const [totalSupplyError, setTotalSupplyError] = useState(false);
    const [mintLimitError, setMintLimitError] = useState(false);
    const [limitSupplyError, setLimitSupplyError] = useState(false);
    const [preAllocationError, setPreAllocationError] = useState(false);
    const [reviewTokenData, setReviewTokenData] = useState<TokenKRC20Deploy>(null);
    const [showReviewListTokenDialog, setShowReviewListTokenDialog] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [waitingForTokenConfirmation, setWaitingForTokenConfirmation] = useState(false);
    const [isTokenDeployed, setIsTokenDeployed] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [updateMetadataPaymentTransactionId, setUpdateMetadataPaymentTransactionId] = useState<string | null>(
        null,
    );
    const [isUpadteMetadataLoading, setIsUpdateMetadataLoading] = useState(false);

    const validateTokenFullName = (name: string) => {
        const regex = /^[A-Za-z]{4,6}$/;
        return regex.test(name);
    };

    const validateNumbersOnly = (value: string) => {
        const regex = /^(?!0+\.?0*$)((\d+\.?\d*|\.\d+)|)$/;
        return regex.test(value);
    };

    const validateTokenName = (name: string) => {
        const regex = /^[A-Za-z]*$/;
        return regex.test(name);
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        if (value.length > 200) {
            setDescription(value.slice(0, 200));
            setErrorToField(
                formErrors,
                setFormErrors,
                'description',
                'Description must be less than 200 characters.',
            );
        }
    };

    const handleTokenNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearFieldErrors(formErrors, setFormErrors, 'ticker');
        setTickerMessage('');
        if (validateTokenName(event.target.value)) {
            setTokenName(event.target.value);
            debouncedValidateTokenName(event.target.value);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedValidateTokenName = useCallback(
        debounce(async (name: string) => {
            if (!validateTokenFullName(name)) {
                setErrorToField(
                    formErrors,
                    setFormErrors,
                    'ticker',
                    'Token name must be 4-6 letters and big letters only.',
                );

                return;
            }

            const isAvailable = await checkAvailability(name);
            if (isAvailable) {
                setValidatedTokenName(name);
                setTickerMessage('Ticker is valid and available to deploy.');
            }
        }, 400),
        [],
    );

    const checkAvailability = async (ticker: string) => {
        try {
            const data = await fetchTokenInfo(ticker, false); // Set holders to false
            console.log(data);
            if (data && (data.state === 'deployed' || data.state === 'ignored' || data.state === 'finished')) {
                setErrorToField(
                    formErrors,
                    setFormErrors,
                    'ticker',
                    'Token already exists. Please choose a different ticker.',
                );

                return false;
            } else {
                return true;
            }
        } catch (e) {
            setErrorToField(formErrors, setFormErrors, 'ticker', 'Error checking token availability.');
            return false;
        }
    };

    const handleMintLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (validateNumbersOnly(event.target.value)) {
            setMintLimit(event.target.value); // Convert to protocol format
            if (parseInt(event.target.value) > parseInt(totalSupply)) {
                setLimitSupplyError(true);
            } else {
                setLimitSupplyError(false);
            }
        }
    };

    const handleTotalSupplyChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (validateNumbersOnly(event.target.value)) {
            setTotalSupplyError(false);
            setTotalSupply(event.target.value); // Convert to protocol format
            if (parseInt(preAllocationPercentage) > 0) {
                const preAllocationTokens =
                    (parseInt(event.target.value) * parseInt(preAllocationPercentage)) / 100;
                setPreAllocation(preAllocationTokens.toString());
            }
        }
    };

    const handlePreAllocation = (value: string) => {
        if (validateNumbersOnly(value)) {
            if (value !== '') {
                setPreAllocationPercentage(value);
                if (parseInt(value) < 0) {
                    setPreAllocationError(true);
                    setPreAllocationPercentage('0');
                } else if (parseInt(value) > 100) {
                    setPreAllocationError(true);
                    setPreAllocationPercentage('100');
                } else {
                    setPreAllocationError(false);
                    const preAllocationTokens = (parseInt(totalSupply) * parseInt(value)) / 100;
                    setPreAllocation(preAllocationTokens.toString());
                }
            } else {
                setPreAllocationPercentage('');
                setPreAllocation('');
            }
        }
    };

    const checkIfEmailExists = (email: string): boolean => {
        if (!email) {
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        return emailPattern.test(email);
    };

    const handleSubmitTokenMetadata = (event: React.FormEvent) => {
        event.preventDefault();
        const twitterUrlPattern = /^(https?:\/\/)?(www\.)?x\.com\/[a-zA-Z0-9_]{1,15}$/;

        if (!x || !twitterUrlPattern.test(x)) {
            setErrorToField(
                formErrors,
                setFormErrors,
                'x',
                'Please enter a valid X/Twitter URL (e.g., https://x.com/username, x.com/username)',
            );
            return;
        }

        if (!checkIfEmailExists(email)) {
            setEmailError('At least one valid email is required.');
            return;
        }
        setFormErrors({});
        setEmailError('');

        const tokenMetadata: TokenKRC20DeployMetadata = {
            description,
            website,
            x,
            discord,
            telegram,
            logo,
            banner,
            whitepaper,
            medium,
            github,
            audit,
            email,
            contacts: isEmptyString(contacts) ? [] : contacts.split(',').map((contact) => contact.trim()),
            founders: isEmptyString(foundersHandles)
                ? []
                : foundersHandles.split(',').map((handle) => handle.trim()),
        };

        setTokenMetadataDetails(tokenMetadata);
        console.log('Token metadata:', tokenMetadata);
        setShowReviewListTokenDialog(true);
    };

    const handleCleanAllFields = () => {
        setValidatedTokenName('');
        setTotalSupply('');
        setMintLimit('');
        setPreAllocation('');
        setPreAllocationPercentage('');
        setDescription('');
        setWebsite('');
        setX('');
        setDiscord('');
        setTelegram('');
        setWhitepaper('');
        setMedium('');
        setGithub('');
        setAudit('');
        setFoundersHandles('');
        setContacts('');
        setLogo(null);
        setBanner(null);
        setFormErrors({});
        setTotalSupplyError(false);
        setMintLimitError(false);
        setPreAllocationError(false);
        setPreAllocationPercentage('');
        setTickerMessage('');
    };

    const handleTokenListing = async (): Promise<boolean> => {
        if (!tokenMetadataDetails) return;
        console.log('Token metadata:', tokenMetadataDetails);
        console.log('VERIFICATION_FEE_KAS', VERIFICATION_FEE_KAS);

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

        console.log('metadataUpdateFeeTransactionId', metadataUpdateFeeTransactionId);

        if (currentMetadataPaymentTransactionId) {
            setIsUpdateMetadataLoading(true);

            // Token listing request to backend
            const tokenDetailsForm = new FormData();

            tokenDetailsForm.append('ticker', tokenKRC20Details.ticker.toUpperCase());
            tokenDetailsForm.append('walletAddress', walletAddress);
            tokenDetailsForm.append('transactionHash', currentMetadataPaymentTransactionId);
            for (const [key, value] of Object.entries(tokenMetadataDetails)) {
                if (value instanceof File || !isEmptyStringOrArray(value as any)) {
                    tokenDetailsForm.append(key, value as string);
                }
            }

            try {
                const result = await sendServerRequestAndSetErrorsIfNeeded<boolean>(
                    async () => updateTokenMetadata(tokenDetailsForm),
                    setFormErrors,
                );

                if (!result) {
                    throw new Error('Failed to save token metadata');
                }

                setShowReviewListTokenDialog(false);
                setUpdateMetadataPaymentTransactionId(null);

                setIsTokenDeployed(false);

                setShowSuccessModal(true);
                setIsTokenDeployed(false);
                handleCleanAllFields();
                setTokenMetadataDetails(null);
                setReviewTokenData(null);
                setTokenKRC20Details(null);
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

    const handleSubmitKRC20 = (event: React.FormEvent) => {
        event.preventDefault();

        if (!validatedTokenName) {
            setErrorToField(formErrors, setFormErrors, 'ticker', 'Token name must be 4-6 letters.');
            return;
        } else if (!totalSupply || /^0+$/.test(totalSupply)) {
            setTotalSupplyError(true);
            return;
        } else if (!mintLimit || /^0+$/.test(mintLimit)) {
            setMintLimitError(true);
            return;
        }

        setTickerMessage('');
        clearFormErrors(setFormErrors);

        const tokenData: TokenKRC20Deploy = {
            ticker: validatedTokenName,
            totalSupply: convertToProtocolFormat(totalSupply),
            mintLimit: convertToProtocolFormat(mintLimit),
            preAllocation: preAllocation ? convertToProtocolFormat(preAllocation) : '',
        };
        const preAllocationChecker = preAllocation ? preAllocation : '0';
        const reviewTokenData: TokenKRC20Deploy = {
            ticker: validatedTokenName,
            totalSupply,
            mintLimit,
            preAllocation: `${preAllocationChecker} (${preAllocationPercentage}%)`,
        };

        setReviewTokenData(reviewTokenData);
        setTokenKRC20Details(tokenData);
        setShowDeployDialog(true);
    };

    const mintLimiErrorText = () => {
        if (mintLimitError) {
            return 'Mint limit is required, it has to be more than 0.';
        } else if (limitSupplyError) {
            return 'Mint limit cannot be greater than total supply';
        } else {
            return '';
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const pollFetchTokenByTicker = async (ticker: string, walletAddress?: string) => {
        try {
            const result = await doPolling(
                // The function to fetch the token
                async () => {
                    try {
                        const response = await fetchTokenByTicker(ticker, walletAddress, true);
                        return response; // Return the response object
                    } catch (error: any) {
                        // Handle errors from the fetchTokenByTicker
                        console.error('Error fetching token:', error);
                        return { httpStatus: error?.response?.status || 500 }; // Simulate a failed response
                    }
                },
                // End condition: Stop polling if the HTTP status is 200
                (result) => result?.state === 'deployed' || result?.state === 'finished', // Replace with actual success condition based on your API response
                3000, // Polling interval: 3 seconds
                10, // Max retries: Poll up to 10 times
            );

            console.log('Polling completed successfully:', result);
            return result;
        } catch (error) {
            console.error('Polling failed after retries:', error);
            throw error;
        }
    };

    const handleDeploy = async (priorityFee?: number) => {
        if (!tokenKRC20Details) return;

        if (walletBalance < 1000) {
            showGlobalSnackbar({
                message: 'Insufficient funds to deploy token, you need 1000 KAS',
                severity: 'error',
            });
            return;
        }

        const inscribeJsonString = JSON.stringify({
            p: 'KRC-20',
            op: 'deploy',
            tick: tokenKRC20Details.ticker,
            max: tokenKRC20Details.totalSupply,
            lim: tokenKRC20Details.mintLimit,
            pre: tokenKRC20Details.preAllocation,
        });

        // const tokenDetailsForm = new FormData();

        // for (const [key, value] of Object.entries(tokenKRC20Details)) {
        //     tokenDetailsForm.append(key, value as string);
        // }

        try {
            setIsDeploying(true);
            const txid = await deployKRC20Token(inscribeJsonString, priorityFee);

            if (txid) {
                saveDeployData(tokenKRC20Details.ticker, walletAddress);
                setIsDeploying(false);
                setWaitingForTokenConfirmation(true);

                pollFetchTokenByTicker(tokenKRC20Details.ticker, walletAddress);

                setWaitingForTokenConfirmation(false);
                setShowDeployDialog(false);
                setIsDeploying(false);
                setIsTokenDeployed(true);
                showGlobalSnackbar({
                    message: 'Token deployed successfully',
                    severity: 'success',
                });

                console.log(inscribeJsonString);
                console.log('Deployment successful, txid:', txid);
            }
        } catch (error) {
            console.error('Failed to deploy KRC20 token:', error);
            setShowDeployDialog(false);
            setIsDeploying(false);
            setWaitingForTokenConfirmation(false);
            showGlobalSnackbar({
                message: 'Failed to deploy token',
                severity: 'error',
                // Handle error (e.g., show an error message)
            });
        }
    };

    const validateImageSize = (file: File | null, maxSizeMB: number) => {
        if (file) {
            const fileSizeMB = file.size / (1024 * 1024);
            return fileSizeMB <= maxSizeMB;
        }
        return true;
    };

    const setLogoHandler = (file: File | null) => {
        if (validateImageSize(file, 50)) {
            setLogo(file);
            clearFieldErrors(formErrors, setFormErrors, 'logo');
        }
    };

    // Handler for setting banner with validation
    const setBannerHandler = (file: File | null) => {
        if (validateImageSize(file, 50)) {
            setBanner(file);
            clearFieldErrors(formErrors, setFormErrors, 'banner');
        }
    };

    return (
        <Container
            sx={{
                width: '90%',
                filter: backgroundBlur ? 'blur(6px)' : 'none',
                transition: 'backdrop-filter 0.3s ease',
                marginBottom: '5vh',
            }}
        >
            <DeployForm>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: '500' }} variant="h4" gutterBottom>
                    KRC-20 Token Information
                </Typography>
                <form id="tokenKrc20Form" onSubmit={handleSubmitKRC20}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextInfoTicker
                                label="Token Name"
                                variant="outlined"
                                fullWidth
                                value={tokenName}
                                onChange={handleTokenNameChange}
                                placeholder="e.g. KASP"
                                InputProps={{
                                    endAdornment: (
                                        <Tooltip
                                            placement="left"
                                            title="Ticker or Token Name must be 4-6 letters."
                                        >
                                            <IconButton>
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }}
                                error={hasErrors(formErrors, 'ticker')}
                                color={
                                    !hasErrors(formErrors, 'ticker') && tickerMessage && tickerMessage.length > 0
                                        ? 'success'
                                        : null
                                }
                                helperText={getErrorMessage(formErrors, 'ticker') || tickerMessage}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                error={totalSupplyError}
                                helperText={
                                    totalSupplyError ? 'Total supply is required it has to be more than 0.' : ''
                                }
                                label="Total Supply"
                                variant="outlined"
                                fullWidth
                                value={totalSupply}
                                onChange={(e) => handleTotalSupplyChange(e)}
                                placeholder="Enter total supply"
                                InputProps={{
                                    inputProps: { min: 0, step: 'any', pattern: '[0-9]*' },
                                    endAdornment: (
                                        <Tooltip
                                            placement="left"
                                            title="Max supply of the KRC-20 token, including fractional values."
                                        >
                                            <IconButton>
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                error={mintLimitError || limitSupplyError}
                                helperText={mintLimiErrorText()}
                                label="Mint Limit"
                                variant="outlined"
                                fullWidth
                                value={mintLimit}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                    handleMintLimitChange(e)
                                }
                                placeholder="Enter mint limit"
                                InputProps={{
                                    endAdornment: (
                                        <Tooltip
                                            placement="left"
                                            title="The balance obtained for each mint, including fractional values."
                                        >
                                            <IconButton>
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                label="Pre-allocation %"
                                variant="outlined"
                                fullWidth
                                error={preAllocationError}
                                helperText={preAllocationError ? 'Pre-allocation must be % between 0 and 100' : ''}
                                value={preAllocationPercentage}
                                onChange={(e) => handlePreAllocation(e.target.value)}
                                placeholder="e.g. 15"
                                InputProps={{
                                    endAdornment: (
                                        <Tooltip
                                            placement="left"
                                            title="The percentage of tokens allocated to the deployer's address after deployment."
                                        >
                                            <IconButton>
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </form>

                <Typography
                    sx={{ fontSize: '1.5rem', fontWeight: '500', marginTop: '2vh' }}
                    variant="h4"
                    gutterBottom
                >
                    Token Metadata
                    <Tooltip title="This metadata is used for listing your project and generating insights on the token's page.">
                        <InfoOutlinedIcon sx={{ marginLeft: '1vh' }} fontSize="small" />
                    </Tooltip>
                </Typography>
                <form id="tokenMetadataForm" onSubmit={handleSubmitTokenMetadata}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextInfo
                                label="Description"
                                variant="outlined"
                                fullWidth
                                multiline // Enables multiline input
                                minRows={1} // Minimum number of rows when the input is not filled
                                maxRows={6} //
                                value={description}
                                onChange={(e) =>
                                    clearFieldErrorsAndSetFieldValue(
                                        formErrors,
                                        setFormErrors,
                                        'description',
                                        () => handleDescriptionChange(e.target.value),
                                    )
                                }
                                placeholder="Token description"
                                error={hasErrors(formErrors, 'description')}
                                helperText={getErrorMessage(formErrors, 'description')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                label="Website"
                                variant="outlined"
                                fullWidth
                                value={website}
                                onChange={(e) =>
                                    clearFieldErrorsAndSetFieldValue(formErrors, setFormErrors, 'website', () =>
                                        setWebsite(e.target.value),
                                    )
                                }
                                placeholder="Website URL"
                                error={hasErrors(formErrors, 'website')}
                                helperText={getErrorMessage(formErrors, 'website')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                label="X (Twitter) URL"
                                variant="outlined"
                                fullWidth
                                value={x}
                                onChange={(e) => setX(e.target.value)}
                                placeholder="X handle"
                                error={hasErrors(formErrors, 'x')}
                                helperText={getErrorMessage(formErrors, 'x')}
                                InputProps={{
                                    endAdornment: (
                                        <Tooltip placement="left" title="Profile Twitter/X URL.">
                                            <IconButton>
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                label="Email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email"
                                helperText={
                                    emailError ? emailError : 'Email is required to send the listing confirmation'
                                }
                                error={!!emailError}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextInfo
                                label="Telegram"
                                variant="outlined"
                                fullWidth
                                value={telegram}
                                onChange={(e) =>
                                    clearFieldErrorsAndSetFieldValue(formErrors, setFormErrors, 'telegram', () =>
                                        setTelegram(e.target.value),
                                    )
                                }
                                placeholder="Telegram link"
                                error={hasErrors(formErrors, 'telegram')}
                                helperText={getErrorMessage(formErrors, 'telegram')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                label="Discord"
                                variant="outlined"
                                fullWidth
                                value={discord}
                                onChange={(e) =>
                                    clearFieldErrorsAndSetFieldValue(formErrors, setFormErrors, 'discord', () =>
                                        setDiscord(e.target.value),
                                    )
                                }
                                placeholder="Discord link"
                                error={hasErrors(formErrors, 'discord')}
                                helperText={getErrorMessage(formErrors, 'discord')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                label="Whitepaper"
                                variant="outlined"
                                fullWidth
                                value={whitepaper}
                                onChange={(e) => setWhitepaper(e.target.value)}
                                placeholder="Whitepaper URL"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                label="Medium"
                                variant="outlined"
                                fullWidth
                                value={medium}
                                onChange={(e) => setMedium(e.target.value)}
                                placeholder="Medium link"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                label="GitHub Repository"
                                variant="outlined"
                                fullWidth
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                placeholder="GitHub Repository link"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                label="Audit"
                                variant="outlined"
                                fullWidth
                                value={audit}
                                onChange={(e) => setAudit(e.target.value)}
                                placeholder="Audit report link"
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextInfo
                                label="Founders X Handles"
                                variant="outlined"
                                fullWidth
                                multiline // Enables multiline input
                                minRows={1} // Minimum number of rows when the input is not filled
                                maxRows={6}
                                value={foundersHandles}
                                onChange={(e) => setFoundersHandles(e.target.value)}
                                placeholder="Founder handles"
                                helperText="Separate multiple handles with a comma (e.g., @founder1, @founder2)"
                                InputProps={{
                                    endAdornment: (
                                        <Tooltip
                                            placement="left"
                                            title="List founder's X/Twitter handles. Separate multiple handles using commas."
                                        >
                                            <IconButton
                                                sx={{
                                                    '&.MuiIconButton-root': {
                                                        padding: '0px',
                                                    },
                                                }}
                                            >
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextInfo
                                label="Contacts"
                                variant="outlined"
                                fullWidth
                                multiline // Enables multiline input
                                minRows={1} // Minimum number of rows when the input is not filled
                                maxRows={6}
                                value={contacts}
                                onChange={(e) => setContacts(e.target.value)}
                                placeholder="Contacts information (e.g., email, Twitter handle)"
                                helperText="Example: @twitter_handle, email@example.com, @telegram_handle (separate with commas)"
                                FormHelperTextProps={{
                                    sx: {
                                        color: 'text.secondary', // This will use the default text color defined by the theme
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <Tooltip
                                            placement="left"
                                            title="Provide multiple Contacts methods separated by commas, such as Twitter handles, emails, or Telegram handles."
                                        >
                                            <IconButton
                                                sx={{
                                                    '&.MuiIconButton-root': {
                                                        padding: '0px',
                                                    },
                                                }}
                                            >
                                                <InfoOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <UploadContainer>
                        {logo ? (
                            <ImagePreview src={URL.createObjectURL(logo)} alt="Token Logo" />
                        ) : (
                            <Typography>Upload Token's Logo</Typography>
                        )}
                        <UploadButton htmlFor="logo-upload">
                            <Input
                                inputProps={{ accept: 'image/*' }}
                                sx={{ display: 'none' }}
                                id="logo-upload"
                                type="file"
                                onChange={(event) => {
                                    const inputElement = event.target as HTMLInputElement;
                                    setLogoHandler(inputElement.files[0]);
                                }}
                            />
                            <Button variant="text" color="primary" component="span">
                                Choose File or Drag
                            </Button>
                        </UploadButton>
                        <Typography variant="caption" color="text.secondary">
                            Recommended size: 400x400 pixels. Max file size: 50MB.
                        </Typography>
                        <Button
                            sx={{ width: '1vw', height: '2vw' }}
                            onClick={() => {
                                setLogo(null);
                                clearFieldErrors(formErrors, setFormErrors, 'logo');
                            }}
                            disabled={!logo}
                            color="primary"
                            variant="contained"
                        >
                            Clear
                        </Button>
                    </UploadContainer>
                    {hasErrors(formErrors, 'logo') && (
                        <Info className="error">{'File type must be image and size must be less than 50MB'}</Info>
                    )}

                    <UploadContainer>
                        {banner ? (
                            <ImagePreview src={URL.createObjectURL(banner)} alt="Token Banner" />
                        ) : (
                            <Typography>Upload Token's Banner</Typography>
                        )}
                        <UploadButton htmlFor="banner-upload">
                            <Input
                                sx={{ display: 'none' }}
                                inputProps={{ accept: 'image/*' }}
                                id="banner-upload"
                                type="file"
                                onChange={(event) => {
                                    const inputElement = event.target as HTMLInputElement;
                                    setBannerHandler(inputElement.files[0]);
                                }}
                            />
                            <Button variant="text" color="primary" component="span">
                                Choose File or Drag
                            </Button>
                        </UploadButton>
                        <Typography variant="caption" color="text.secondary">
                            Recommended size: 9:5 ratio. Max file size: 50MB.
                        </Typography>
                        <Button
                            sx={{ width: '1vw', height: '2vw' }}
                            onClick={() => {
                                setBanner(null);
                                clearFieldErrors(formErrors, setFormErrors, 'banner');
                            }}
                            disabled={!banner}
                            color="primary"
                            variant="contained"
                        >
                            Clear
                        </Button>
                    </UploadContainer>
                    {hasErrors(formErrors, 'banner') && (
                        <Info className="error">{'File type must be image and size must be less than 50MB'}</Info>
                    )}
                </form>

                <Grid container spacing={2} sx={{ marginTop: '1vh' }}>
                    <Grid item xs={6}>
                        <Tooltip title={!walletConnected ? 'Please connect your wallet to mint a token' : ''}>
                            <span>
                                <Button
                                    type="submit"
                                    form="tokenKrc20Form"
                                    variant="contained"
                                    color="primary"
                                    className="button"
                                    fullWidth
                                    disabled={!walletConnected || isTokenDeployed}
                                >
                                    Review Token
                                </Button>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            type="submit"
                            form="tokenMetadataForm"
                            variant="contained"
                            color="primary"
                            className="button"
                            fullWidth
                            disabled={!isTokenDeployed} // isTokenDeployed should be set to true after deployment
                        >
                            Add Token Metadata
                        </Button>
                    </Grid>
                </Grid>
                <Info>
                    Note: Each deployment costs 1000 $KAS. This cannot be undone, check the ticker and the details
                    before you deploy.
                </Info>
            </DeployForm>
            {showDeployDialog && tokenKRC20Details && (
                <DeployDialog
                    open={showDeployDialog}
                    onClose={() => setShowDeployDialog(false)}
                    onDeploy={handleDeploy}
                    tokenData={reviewTokenData}
                    isDeploying={isDeploying}
                    waitingForTokenConfirmation={waitingForTokenConfirmation}
                />
            )}
            {showReviewListTokenDialog && tokenMetadataDetails && (
                <ReviewListTokenDialog
                    walletConnected={walletConnected}
                    open={showReviewListTokenDialog}
                    onClose={() => setShowReviewListTokenDialog(false)}
                    onList={handleTokenListing}
                    tokenMetadata={tokenMetadataDetails}
                    isSavingData={isUpadteMetadataLoading}
                />
            )}
            {showSuccessModal && (
                <SuccessModal
                    open={showSuccessModal}
                    onClose={handleCloseSuccessModal}
                    ticker={tokenName}
                    setTicker={setTokenName}
                />
            )}
        </Container>
    );
};

export default DeployPage;
