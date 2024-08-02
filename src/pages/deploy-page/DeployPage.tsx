import React, { useState, useCallback } from 'react';
import { Button, Container, Typography, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DeployForm, Info, Status, TextInfo } from './DeployPage.s';
import { TokenDeploy } from '../../types/Types';
import DeployDialog from '../../components/deploy-page/deploy-dialog/DeployDialog';
import debounce from 'lodash/debounce';
import { fetchTokenInfo } from '../../DAL/Krc20DAL';
import { deployKRC20Token } from '../../utils/KaswareUtils';

const DeployPage: React.FC = () => {
    const [tokenName, setTokenName] = useState('');
    const [validatedTokenName, setValidatedTokenName] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [mintLimit, setMintLimit] = useState('');
    const [preAllocation, setPreAllocation] = useState('');
    const [preAllocationPercentage, setPreAllocationPercentage] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [twitter, setTwitter] = useState('');
    const [discord, setDiscord] = useState('');
    const [telegram, setTelegram] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);
    const [showDeployDialog, setShowDeployDialog] = useState(false);
    const [tokenDetails, setTokenDetails] = useState<TokenDeploy | null>(null);
    const [tickerMessage, setTickerMessage] = useState('');
    const [statusClass, setStatusClass] = useState('');
    const [totalSupplyError, setTotalSupplyError] = useState(false);
    const [mintLimitError, setMintLimitError] = useState(false);
    const [limitSupplyError, setLimitSupplyError] = useState(false);
    const [preAllocationError, setPreAllocationError] = useState(false);
    const [reviewTokenData, setReviewTokenData] = useState<TokenDeploy>(null);

    const validateTokenFullName = (name: string) => {
        const regex = /^[A-Za-z]{4,6}$/;
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
        if (validateTokenName(event.target.value)) {
            setTokenName(event.target.value);
            debouncedValidateTokenName(event.target.value);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedValidateTokenName = useCallback(
        debounce(async (name: string) => {
            if (!validateTokenFullName(name)) {
                setTickerMessage('Token name must be 4-6 letters.');
                setStatusClass('error');
                return;
            }

            const isAvailable = await checkAvailability(name);
            if (isAvailable) {
                setValidatedTokenName(name);
                setTickerMessage('Ticker is valid and available to deploy.');
                setStatusClass('success');
            } else {
                setStatusClass('error');
            }
        }, 300),
        [],
    );

    const checkAvailability = async (ticker: string) => {
        try {
            const data = await fetchTokenInfo(ticker, false); // Set holders to false
            if (data && (data.state === 'deployed' || data.state === 'ignored')) {
                setTickerMessage('Token already exists. Please choose a different ticker.');
                setStatusClass('error');
                return false;
            } else {
                return true;
            }
        } catch (e) {
            setTickerMessage('Error checking token availability.');
            setStatusClass('error');
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
            setTickerMessage('Token name must be 4-6 letters.');
            setStatusClass('error');
            return;
        } else if (!totalSupply) {
            setTotalSupplyError(true);
            return;
        } else if (!mintLimit) {
            setMintLimitError(false);
            return;
        }

        setTickerMessage('');
        setStatusClass('');

        const tokenData: TokenDeploy = {
            tokenName: validatedTokenName,
            totalSupply,
            mintLimit,
            preAllocation,
            description,
            website,
            twitter,
            discord,
            telegram,
            logo: logo ? URL.createObjectURL(logo) : '',
            banner: banner ? URL.createObjectURL(banner) : '',
        };

        const reviewTokenData: TokenDeploy = {
            tokenName: validatedTokenName,
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
            return 'Mint limit is required';
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
            tick: tokenDetails.tokenName,
            max: tokenDetails.totalSupply,
            lim: tokenDetails.mintLimit,
            pre: tokenDetails.preAllocation,
        });

        try {
            const txid = await deployKRC20Token(inscribeJsonString);
            console.log(inscribeJsonString);
            console.log('Deployment successful, txid:', txid);
            setShowDeployDialog(false);
            // Handle successful deployment (e.g., show a success message, navigate to a different page, etc.)
        } catch (error) {
            console.error('Failed to deploy KRC20 token:', error);
            setShowDeployDialog(false);
            // Handle error (e.g., show an error message)
        }
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<File | null>>,
    ) => {
        if (event.target.files && event.target.files.length > 0) {
            setter(event.target.files[0]);
        }
    };

    const handleDrop = (
        event: React.DragEvent<HTMLElement>,
        setter: React.Dispatch<React.SetStateAction<File | null>>,
    ) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            setter(event.dataTransfer.files[0]);
            event.dataTransfer.clearData();
        }
    };

    return (
        <Container sx={{ width: '90%' }}>
            <DeployForm>
                <Typography variant="h4" gutterBottom>
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
                    />
                    <Status className={statusClass}>{tickerMessage}</Status>

                    <TextInfo
                        error={totalSupplyError}
                        helperText={totalSupplyError ? 'Total supply is required' : ''}
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
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Token description"
                    />

                    <TextInfo
                        label="Website"
                        variant="outlined"
                        fullWidth
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="Website URL"
                    />

                    <TextInfo
                        label="Twitter"
                        variant="outlined"
                        fullWidth
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="Twitter handle"
                    />

                    <TextInfo
                        label="Discord"
                        variant="outlined"
                        fullWidth
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                        placeholder="Discord link"
                    />

                    <TextInfo
                        label="Telegram"
                        variant="outlined"
                        fullWidth
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        placeholder="Telegram link"
                    />

                    <TextInfo
                        label="Token's Picture"
                        variant="outlined"
                        fullWidth
                        value={logo ? logo.name : ''}
                        onChange={(e) => handleFileChange(e, setLogo)}
                        placeholder="Link to the ticker's image"
                        InputProps={{
                            endAdornment: (
                                <Tooltip
                                    placement="left"
                                    title="Upload the token's image by dragging it here or by clicking to upload."
                                >
                                    <IconButton>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ),
                        }}
                        onDrop={(e) => handleDrop(e, setLogo)}
                    />
                    <TextInfo
                        label="Token's Banner"
                        variant="outlined"
                        fullWidth
                        value={banner ? banner.name : ''}
                        onChange={(e) => handleFileChange(e, setBanner)}
                        placeholder="Link to the project's banner for token page"
                        InputProps={{
                            endAdornment: (
                                <Tooltip
                                    placement="left"
                                    title="Upload the project's banner by dragging it here or by clicking to upload."
                                >
                                    <IconButton>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            ),
                        }}
                        onDrop={(e) => handleDrop(e, setBanner)}
                    />

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
