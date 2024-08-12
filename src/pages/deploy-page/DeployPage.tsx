import React, { useState, useCallback, FC } from 'react';
import { Button, Container, Typography, Tooltip, IconButton, Input } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DeployForm, ImagePreview, Info, Status, TextInfo, UploadButton, UploadContainer } from './DeployPage.s';
import { TokenDeploy } from '../../types/Types';
import DeployDialog from '../../components/deploy-page/deploy-dialog/DeployDialog';
import debounce from 'lodash/debounce';
import { fetchTokenInfo } from '../../DAL/Krc20DAL';
import { deployKRC20Token } from '../../utils/KaswareUtils';
import {
    BackendValidationErrorsType,
    sendServerRequestAndSetErrorsIfNeeded,
    updateTokenMetadataAfterDeploy,
} from '../../DAL/BackendDAL';
import {
    setErrorToField,
    clearFieldErrors,
    clearFieldErrorsAndSetFieldValue,
    clearFormErrors,
    getErrorMessage,
    hasErrors,
} from '../../utils/BackendValidationErrorsHandler';

interface DeployPageProps {
    walletBalance: number;
    backgroundBlur: boolean;
}

const DeployPage: FC<DeployPageProps> = (props) => {
    const { walletBalance, backgroundBlur } = props;
    const [tokenName, setTokenName] = useState('');
    const [validatedTokenName, setValidatedTokenName] = useState('');
    const [totalSupply, setTotalSupply] = useState('1000');
    const [mintLimit, setMintLimit] = useState('100');
    const [preAllocation, setPreAllocation] = useState('');
    const [preAllocationPercentage, setPreAllocationPercentage] = useState('50');
    const [description, setDescription] = useState('My great token of gilad state');
    const [website, setWebsite] = useState('http://gilad.com');
    const [x, setX] = useState('https://x.com/asd');
    const [discord, setDiscord] = useState('https://discord.com/asd');
    const [telegram, setTelegram] = useState('https://t.me/asd');
    const [logo, setLogo] = useState<string | null>(null);
    const [banner, setBanner] = useState<string | null>(null);
    const [showDeployDialog, setShowDeployDialog] = useState(false);
    const [tokenDetails, setTokenDetails] = useState<TokenDeploy | null>(null);
    const [tickerMessage, setTickerMessage] = useState('');
    const [formErrors, setFormErrors] = useState<BackendValidationErrorsType>({});
    const [totalSupplyError, setTotalSupplyError] = useState(false);
    const [mintLimitError, setMintLimitError] = useState(false);
    const [limitSupplyError, setLimitSupplyError] = useState(false);
    const [preAllocationError, setPreAllocationError] = useState(false);
    const [reviewTokenData, setReviewTokenData] = useState<TokenDeploy>(null);

    const validateTokenFullName = (name: string) => {
        const regex = /^[A-Z]{4,6}$/;
        return regex.test(name);
    };

    const validateNumbersOnly = (value: string) => {
        const regex = /^[0-9]*$/;
        return regex.test(value);
    };

    const validateTokenName = (name: string) => {
        const regex = /^[A-Za-z]*$/;
        return regex.test(name);
    };

    const handleTokenNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearFieldErrors(formErrors, setFormErrors, 'ticker');
        setTickerMessage('');

        if (validateTokenName(event.target.value)) {
            setTokenName(event.target.value);
            debouncedValidateTokenName(event.target.value);
        }
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        if (value.length > 100) {
            setDescription(value.slice(0, 100));
            setErrorToField(
                formErrors,
                setFormErrors,
                'description',
                'Description must be less than 100 characters.',
            )
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
        }, 300),
        [],
    );

    const checkAvailability = async (ticker: string) => {
        try {
            const data = await fetchTokenInfo(ticker, false); // Set holders to false
            if (data && (data.state === 'deployed' || data.state === 'ignored')) {
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
            setMintLimit(event.target.value);
            if (parseInt(event.target.value) > parseInt(totalSupply)) {
                setLimitSupplyError(true);
            } else {
                setLimitSupplyError(false);
            }
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!validatedTokenName) {
            setErrorToField(
                formErrors,
                setFormErrors,
                'ticker',
                'Token name must be 4-6 letters and big letters only.',
            );
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

        const tokenData: TokenDeploy = {
            ticker: validatedTokenName,
            totalSupply,
            mintLimit,
            preAllocation,
            description,
            website,
            x,
            discord,
            telegram,
            logo: logo || '',
            banner: banner || '',
        };
        console.log('Token Data:', tokenData);

        const reviewTokenData: TokenDeploy = {
            ticker: validatedTokenName,
            totalSupply,
            mintLimit,
            preAllocation: `${preAllocation} (${preAllocationPercentage}%)`,
        };

        setReviewTokenData(reviewTokenData);
        setTokenDetails(tokenData);
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

    const handleTotalSupplyChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (validateNumbersOnly(event.target.value)) {
            setTotalSupply(event.target.value);
            if (parseInt(preAllocationPercentage) > 0) {
                const preAllocationTokens =
                    (parseInt(event.target.value) * parseInt(preAllocationPercentage)) / 100;
                setPreAllocation(preAllocationTokens.toString());
            }
        }
    };

    const handleDeploy = async () => {
        if (!tokenDetails) return;

        const inscribeJsonString = JSON.stringify({
            p: 'KRC-20',
            op: 'deploy',
            tick: tokenDetails.ticker,
            max: tokenDetails.totalSupply,
            lim: tokenDetails.mintLimit,
            pre: tokenDetails.preAllocation,
        });

        const tokenDetailsForm = new FormData();

        for (const [key, value] of Object.entries(tokenDetails)) {
            tokenDetailsForm.append(key, value as string);
        }

        try {
            // if (walletBalance >= 1000) {
            // const txid = await deployKRC20Token(inscribeJsonString);
            const txid = 'a599f03ac54d8efa98681b97fab4a90cc74bd55477967a54f7ffb76414bcf6f8';
            console.log(inscribeJsonString);
            console.log('Deployment successful, txid:', txid);
            tokenDetailsForm.append('transactionHash', txid);

            const result = await sendServerRequestAndSetErrorsIfNeeded<boolean>(
                () => updateTokenMetadataAfterDeploy(tokenDetailsForm),
                setFormErrors,
            );

            console.log(formErrors);

            if (!result) {
                // TODO: Show error to the user
                throw new Error('Failed to save token metadata');
            } else {
                // TODO: Show success to the user
            }

            setShowDeployDialog(false);
            // } else {
            //     console.error('Insufficient funds to deploy KRC20 token');
            // }
            // Handle successful deployment (e.g., show a success message, navigate to a different page, etc.)
        } catch (error) {
            console.error('Failed to deploy KRC20 token:', error);
            setShowDeployDialog(false);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <Container
            sx={{
                width: '90%',
                filter: backgroundBlur ? 'blur(6px)' : 'none',
                transition: 'backdrop-filter 0.3s ease',
            }}
        >
            <DeployForm>
                <Typography sx={{ fontSize: '2.2vw', fontWeight: '500' }} variant="h4" gutterBottom>
                    KRC-20 Token Information
                </Typography>
                <form id="tokenForm" onSubmit={handleSubmit}>
                    <TextInfo
                        sx={{ marginBottom: 0 }}
                        label="Name of the token"
                        variant="outlined"
                        fullWidth
                        value={tokenName}
                        onChange={handleTokenNameChange}
                        placeholder="e.g. KASP"
                        InputProps={{
                            endAdornment: (
                                <Tooltip placement="left" title="Token name must be 4-6 letters.">
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
                        focused
                        helperText={getErrorMessage(formErrors, 'ticker') || tickerMessage}
                    />

                    <TextInfo
                        error={totalSupplyError}
                        helperText={totalSupplyError ? 'Total supply is required it has to be more than 0.' : ''}
                        sx={{ marginTop: '1vh' }}
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

                    <TextInfo
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={description}
                        onChange={(e) =>
                            clearFieldErrorsAndSetFieldValue(formErrors, setFormErrors, 'description', () =>
                                handleDescriptionChange(e.target.value),
                            )
                        }
                        placeholder="Token description"
                        error={hasErrors(formErrors, 'description')}
                        helperText={getErrorMessage(formErrors, 'description')}
                    />

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

                    <TextInfo
                        label="X"
                        variant="outlined"
                        fullWidth
                        value={x}
                        onChange={(e) =>
                            clearFieldErrorsAndSetFieldValue(formErrors, setFormErrors, 'x', () =>
                                setX(e.target.value),
                            )
                        }
                        placeholder="X handle"
                        error={hasErrors(formErrors, 'x')}
                        helperText={getErrorMessage(formErrors, 'x')}
                    />

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
                                    setLogo(inputElement.files[0]);
                                }}
                            />
                            <Button variant="text" color="primary" component="span">
                                Choose File or Drag
                            </Button>
                        </UploadButton>
                        <Button
                            sx={{ width: '1vw', height: '2vw' }}
                            onClick={() => {
                                setLogo(null);
                            }}
                            disabled={!logo}
                            color="primary"
                            variant="contained"
                        >
                            Clear
                        </Button>
                    </UploadContainer>

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
                                    setBanner(inputElement.files[0]);
                                }}
                            />
                            <Button variant="text" color="primary" component="span">
                                Choose File or Drag
                            </Button>
                            <Button
                                sx={{ width: '1vw', height: '2vw' }}
                                onClick={() => {
                                    setBanner(null);
                                }}
                                disabled={!banner}
                                color="primary"
                                variant="contained"
                            >
                                Clear
                            </Button>
                        </UploadButton>
                    </UploadContainer>

                    <Button
                        sx={{
                            width: '100%',
                            marginTop: '1vh',
                        }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="button"
                    >
                        Review
                    </Button>
                </form>
                <Info>
                    Note: Each deployment costs 1000 $KAS. This cannot be undone, check the ticker properly and
                    make sure you understand your actions.
                </Info>
            </DeployForm>
            {showDeployDialog && tokenDetails && (
                <DeployDialog
                    open={showDeployDialog}
                    onClose={() => setShowDeployDialog(false)}
                    onDeploy={() => handleDeploy()}
                    tokenData={reviewTokenData}
                />
            )}
        </Container>
    );
};

export default DeployPage;

/* 
{
    "ticker": "GILAD",
    "totalSupply": "1000",
    "mintLimit": "1",
    "preAllocation": "500",
    "description": "Gilad Coin",
    "website": "",
    "x": "",
    "discord": "",
    "telegram": "",
    "logo": "",
    "banner": ""
}

{
  "p": "KRC-20",
  "op": "deploy",
  "tick": "GILAD",
  "max": "1000",
  "lim": "1",
  "pre": "500"
}


*/
