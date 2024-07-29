import React, { useState, useCallback } from 'react';
import { Button, Container, Typography, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DeployForm, Info, Status, TextInfo } from './DeployPage.s';
import { TokenDeploy } from '../../types/Types';
import DeployDialog from '../../components/deploy-page/deploy-dialog/DeployDialog';
import debounce from 'lodash/debounce';
import { fetchTokenInfo } from '../../DAL/Krc20DAL';

const DeployPage: React.FC = () => {
    const [tokenName, setTokenName] = useState('');
    const [validatedTokenName, setValidatedTokenName] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [mintLimit, setMintLimit] = useState('');
    const [preAllocation, setPreAllocation] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [twitter, setTwitter] = useState('');
    const [discord, setDiscord] = useState('');
    const [telegram, setTelegram] = useState('');
    const [picture, setPicture] = useState('');
    const [showDeployDialog, setShowDeployDialog] = useState(false);
    const [tokenDetails, setTokenDetails] = useState<TokenDeploy | null>(null);
    const [tickerMessage, setTickerMessage] = useState('');
    const [statusClass, setStatusClass] = useState('');
    const [totalSupplyError, setTotalSupplyError] = useState(false);
    const [mintLimitError, setMintLimitError] = useState(false);

    const validateTokenName = (name: string) => {
        const regex = /^[A-Za-z]{4,6}$/;
        return regex.test(name);
    };

    const handleTokenNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTokenName(event.target.value);
        debouncedValidateTokenName(event.target.value);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedValidateTokenName = useCallback(
        debounce(async (name: string) => {
            if (!validateTokenName(name)) {
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
            picture,
        };

        setTokenDetails(tokenData);
        setShowDeployDialog(true);
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
                        required
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
                        required
                        error={totalSupplyError}
                        helperText={totalSupplyError ? 'Total supply is required' : ''}
                        sx={{ marginTop: '1vh' }}
                        label="Total Supply"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={totalSupply}
                        onChange={(e) => setTotalSupply(e.target.value)}
                        placeholder="Enter total supply"
                        InputProps={{
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
                        required
                        error={mintLimitError}
                        helperText={mintLimitError ? 'Mint limit is required' : ''}
                        label="Mint Limit"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={mintLimit}
                        onChange={(e) => setMintLimit(e.target.value)}
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
                        type="number"
                        value={preAllocation}
                        onChange={(e) => setPreAllocation(e.target.value)}
                        placeholder="e.g. 300000"
                        InputProps={{
                            endAdornment: (
                                <Tooltip
                                    placement="left"
                                    title="The amount of tokens allocated to the deployer's address after deployment, including fractional values."
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
                        value={picture}
                        onChange={(e) => setPicture(e.target.value)}
                        placeholder="Link to the ticker's image"
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
                    onDeploy={() => {}}
                    tokenData={tokenDetails}
                />
            )}
        </Container>
    );
};

export default DeployPage;
