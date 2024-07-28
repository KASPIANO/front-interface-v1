import React, { useState } from 'react';
import { Button, Container, Typography, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DeployForm, Info, TextInfo } from './DeployPage.s';
import { TokenDeploy } from '../../types/Types';
import DeployDialog from '../../components/deploy-page/deploy-dialog/DeployDialog';

const DeployPage: React.FC = () => {
    const [tokenName, setTokenName] = useState('');
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

    // const handleConfirmDeployment = () => setShowConfirmation(true);

    const validateTokenName = (name: string) => {
        const regex = /^[A-Za-z]{4,6}$/;
        return regex.test(name);
    };

    const handleTokenNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTokenName(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (validateTokenName(tokenName)) {
            alert('Token name must be 4-6 letters.');
            return;
        }
        if (!tokenName || !totalSupply || !mintLimit) {
            // Handle the error accordingly
            return;
        }

        const tokenData: TokenDeploy = {
            tokenName,
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
                <form id="tokenForm" method="POST" onSubmit={handleSubmit}>
                    <TextInfo
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

                    <TextInfo
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
                        label="Pre-allocation Quantity"
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
            {showDeployDialog && (
                <DeployDialog
                    open={showDeployDialog}
                    onClose={() => setShowDeployDialog(false)}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onDeploy={() => {}}
                    tokenData={tokenDetails}
                />
            )}
        </Container>
    );
};

export default DeployPage;

// let kasware;
// let walletAddress;

// function validateTokenName(input) {
//     input.value = input.value.replace(/[^a-zA-Z]/g, '');
//     const statusElement = document.getElementById('tokenStatus');
//     const reviewButton = document.getElementById('reviewButton');

//     if (input.value.length < 4 || input.value.length > 6) {
//         statusElement.innerText = 'Ticker must be between 4 to 6 characters.';
//         statusElement.className = 'status error';
//         reviewButton.disabled = true;
//     } else {
//         statusElement.innerText = '';
//         statusElement.className = 'status';
//         reviewButton.disabled = false;
//     }

//     checkDeployConditions();
// }

// async function connectWallet() {
//     const connectButton = document.getElementById('connectButton');
//     connectButton.disabled = true;
//     try {
//         let accounts = await window.kasware.requestAccounts();
//         walletAddress = accounts[0];
//         console.log('Wallet connected:', walletAddress);
//         const messageElement = document.getElementById('message');
//         messageElement.innerText = 'Wallet connected: ' + walletAddress;
//         kasware = window.kasware;

//         // Change the button text to "Wallet Connected"
//         connectButton.innerText = 'Wallet Connected';

//         // Show the deploy button
//         document.getElementById('deployButton').style.display = 'block';

//         // Remove the message after 10 seconds
//         setTimeout(() => {
//             messageElement.innerText = '';
//         }, 10000);
//     } catch (e) {
//         console.error('Failed to connect wallet:', e);
//         const messageElement = document.getElementById('message');
//         messageElement.innerText = 'Failed to connect wallet: ' + e.message;

//         // Remove the message after 10 seconds
//         setTimeout(() => {
//             messageElement.innerText = '';
//         }, 10000);
//     } finally {
//         connectButton.disabled = false;
//     }
// }

// function showDeployForm() {
//     document.getElementById('deployForm').style.display = 'block';
// }

// async function checkTokenAvailability(ticker) {
//     const statusElement = document.getElementById('tokenStatus');
//     const reviewButton = document.getElementById('reviewButton');

//     // First, check if the ticker length is valid
//     if (!ticker || ticker.length < 4 || ticker.length > 6) {
//         statusElement.innerText = 'Ticker must be between 4 to 6 characters.';
//         statusElement.className = 'status error';
//         reviewButton.disabled = true;
//         return;
//     }

//     try {
//         const response = await fetch(`https://tn11api.kasplex.org/v1/krc20/token/${ticker}`);
//         const data = await response.json();

//         if (data.message === "tick invalid") {
//             statusElement.innerText = 'Ticker is invalid.';
//             statusElement.className = 'status error';
//             reviewButton.disabled = true;
//         } else if (data.message === "successful" && (data.result[0].state === "deployed" || data.result[0].state === "ignored")) {
//             statusElement.innerText = 'Token already exists. Please choose a different ticker.';
//             statusElement.className = 'status error';
//             reviewButton.disabled = true;
//         } else {
//             statusElement.innerText = 'Token is available to deploy.';
//             statusElement.className = 'status success';
//             reviewButton.disabled = false;
//         }
//     } catch (e) {
//         statusElement.innerText = 'Error checking token availability.';
//         statusElement.className = 'status error';
//         reviewButton.disabled = true;
//     }

//     checkDeployConditions();
// }

// function checkDeployConditions() {
//     const totalSupply = document.getElementById('totalSupply').value;
//     const mintLimit = document.getElementById('lim').value;
//     const reviewButton = document.getElementById('reviewButton');

//     if (totalSupply > 0 && mintLimit > 0) {
//         reviewButton.disabled = false;
//     } else {
//         reviewButton.disabled = true;
//     }
// }

// async function confirmDeployment() {
//     const tokenName = document.getElementById('tokenName').value;
//     const totalSupply = document.getElementById('totalSupply').value;
//     const mintLimit = document.getElementById('lim').value;
//     const preMint = document.getElementById('pre').value;
//     const description = document.getElementById('description').value;
//     const website = document.getElementById('website').value;
//     const twitter = document.getElementById('twitter').value;
//     const discord = document.getElementById('discord').value;
//     const telegram = document.getElementById('telegram').value;
//     const picture = document.getElementById('picture').value;

//     if (!tokenName || !totalSupply || !mintLimit || totalSupply <= 0 || mintLimit <= 0) {
//         document.getElementById('message').innerText = 'Token name, total supply, and mint limit are required and must be greater than zero.';
//         setTimeout(() => {
//             document.getElementById('message').innerText = '';
//         }, 10000);
//         return;
//     }

//     // Convert pre-mint value to the smallest unit
//     const maxAllowedValue = 2900000000000000000;
//     const preMintValue = preMint ? (preMint * Math.pow(10, 8)) : 0;

//     if (preMintValue > maxAllowedValue) {
//         document.getElementById('message').innerText = 'Pre-mint value exceeds the maximum allowed value.';
//         setTimeout(() => {
//             document.getElementById('message').innerText = '';
//         }, 10000);
//         return;
//     }

//     const inscribeJsonObject = {
//         p: 'KRC-20',
//         op: 'deploy',
//         tick: tokenName,
//         max: (totalSupply * Math.pow(10, 8)).toString(),
//         lim: (mintLimit * Math.pow(10, 8)).toString(),
//         pre: preMint ? preMintValue.toString() : undefined,
//         dec: '8',
//         desc: description,
//         website: website,
//         twitter: twitter,
//         discord: discord,
//         telegram: telegram,
//         daas: '0',
//         daae: '0'
//     };

//     document.getElementById('confirmationText').innerText = `
//         Deploying token: ${tokenName}
//         Total Supply: ${Number(totalSupply).toLocaleString()}
//         Mint Limit: ${Number(mintLimit).toLocaleString()}
//         Pre-mint Quantity: ${Number(preMint).toLocaleString()}
//         Description: ${description}
//         Website: ${website}
//         Twitter: ${twitter}
//         Discord: ${discord}
//         Telegram: ${telegram}
//     `;
//     document.getElementById('confirmationBox').style.display = 'block';

//     window.inscribeJsonObject = inscribeJsonObject;

//     // Send data to PHP script
//     const formData = new FormData();
//     formData.append('tokenName', tokenName);
//     formData.append('totalSupply', totalSupply);
//     formData.append('lim', mintLimit);
//     formData.append('pre', preMint);
//     formData.append('description', description);
//     formData.append('website', website);
//     formData.append('twitter', twitter);
//     formData.append('discord', discord);
//     formData.append('telegram', telegram);
//     formData.append('picture', picture);

//     fetch('store_token_info.php', {
//         method: 'POST',
//         body: formData
//     }).then(response => response.text())
//       .then(result => {
//           console.log('PHP Response:', result);
//       }).catch(error => {
//           console.error('Error:', error);
//       });
// }

// async function deployToken() {
//     try {
//         // Transfer 100 KAS fee
//         let feeTransferTxid = await kasware.sendKaspa("kaspa:qypqkwl2g36hae62lhdnx7t8n4lq47qmdvjge673f4g0rh8gxtetjmswdf7y9f2", 10000000000); // 100 KAS in smallest unit
//         console.log('Fee Transfer TxID:', feeTransferTxid);

//         // Check if the fee transfer was successful
//         if (!feeTransferTxid) {
//             throw new Error('Failed to transfer the deployment fee');
//         }

//         // Proceed with deployment
//         if (!window.inscribeJsonObject) {
//             throw new Error('Inscribe JSON object is not defined');
//         }

//         const inscribeJsonString = JSON.stringify(window.inscribeJsonObject);
//         if (!inscribeJsonString) {
//             throw new Error('Failed to stringify inscribe JSON object');
//         }

//         console.log('Inscribe JSON String:', inscribeJsonString);

//         const deployTransactionParams = {
//             p: 'KRC-20',
//             op: 'deploy',
//             tick: window.inscribeJsonObject.tick,
//             max: window.inscribeJsonObject.max,
//             lim: window.inscribeJsonObject.lim,
//             pre: window.inscribeJsonObject.pre,
//             dec: window.inscribeJsonObject.dec,
//             daas: window.inscribeJsonObject.daas,
//             daae: window.inscribeJsonObject.daae
//         };

//         console.log('Deploy Transaction Params:', deployTransactionParams);

//         const deployTransactionParamsString = JSON.stringify(deployTransactionParams);
//         console.log('Deploy Transaction Params String:', deployTransactionParamsString);

//         const response = await kasware.signKRC20Transaction(
//             deployTransactionParamsString,
//             2,  // SIGN_KRC20_DEPLOY
//             walletAddress
//         );

//         console.log('Sign KRC20 Transaction response:', response);

//         const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;

//         const commit = parsedResponse.commit;
//         const reveal = parsedResponse.reveal;

//         if (!commit || !reveal) {
//             throw new Error(`Invalid response: commit=${commit}, reveal=${reveal}`);
//         }

//         console.log('Commit ID:', commit);
//         console.log('Reveal ID:', reveal);

//         const revealTransactionParams = {
//             p: 'KRC-20',
//             op: 'reveal',
//             commit: commit,
//             reveal: reveal
//         };

//         const revealTransactionParamsString = JSON.stringify(revealTransactionParams);
//         console.log('Reveal Transaction Params String:', revealTransactionParamsString);

//         const revealResponse = await kasware.signKRC20Transaction(
//             revealTransactionParamsString,
//             2,  // SIGN_KRC20_DEPLOY for reveal step
//             walletAddress
//         );

//         console.log('Reveal Transaction response:', revealResponse);

//         const parsedRevealResponse = typeof revealResponse === 'string' ? JSON.parse(revealResponse) : revealResponse;

//         const revealTxid = parsedRevealResponse.txid || parsedRevealResponse.commit || parsedRevealResponse.reveal;
//         console.log('Parsed Reveal Response:', parsedRevealResponse);

//         if (!revealTxid) {
//             throw new Error('Failed to get transaction ID from reveal response');
//         }

//         console.log('Reveal Transaction ID:', revealTxid);

//         const messageElement = document.getElementById('message');
//         messageElement.innerText = 'Token deployed successfully! TxID: ' + revealTxid;
//         setTimeout(() => {
//             messageElement.innerText = '';
//         }, 10000);
//     } catch (e) {
//         console.error('Token deployment failed:', e);
//         const messageElement = document.getElementById('message');
//         messageElement.innerText = 'Token deployment failed: ' + e.message;

//         if (e.data && e.data.originalError) {
//             console.error('Original error:', e.data.originalError.message);
//             console.error('Stack trace:', e.data.originalError.stack);
//         }

//         setTimeout(() => {
//             messageElement.innerText = '';
//         }, 10000);
//     }
// }
