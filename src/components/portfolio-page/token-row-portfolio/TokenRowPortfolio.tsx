import {
    Avatar,
    Box,
    Button,
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { mintKRC20Token, transferKRC20Token } from '../../../utils/KaswareUtils';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { TokenRowPortfolioItem } from '../../../types/Types';
import { capitalizeFirstLetter } from '../../../utils/Utils';

interface TokenRowPortfolioProps {
    token: TokenRowPortfolioItem;
    walletConnected: boolean;
    kasPrice: number;
    walletBalance: number;
}

const TokenRowPortfolio: FC<TokenRowPortfolioProps> = (props) => {
    const { token, walletConnected, walletBalance } = props;
    const [destAddress] = useState<string>('');

    const handleTranfer = async (event, ticker: string) => {
        event.stopPropagation();
        if (!walletConnected) {
            showGlobalSnackbar({
                message: 'Please connect your wallet to transfer a token',
                severity: 'error',
            });

            return;
        }
        if (destAddress === '') {
            showGlobalSnackbar({
                message: 'Please enter destination address',
                severity: 'error',
            });
            return;
        }
        const inscribeJsonString = JSON.stringify({
            p: 'KRC-20',
            op: 'transfer',
            tick: ticker,
        });
        try {
            const mint = await transferKRC20Token(inscribeJsonString, destAddress);
            if (mint) {
                const { commit, reveal } = JSON.parse(mint);
                showGlobalSnackbar({
                    message: 'Token transfered successfully',
                    severity: 'success',
                    commit,
                    reveal,
                });
            }
        } catch (error) {
            showGlobalSnackbar({
                message: 'Failed to Transfer Token',
                severity: 'error',
                details: error.message,
            });
        }
    };

    const handleMint = async (event, ticker: string) => {
        event.stopPropagation();
        if (!walletConnected) {
            showGlobalSnackbar({
                message: 'Please connect your wallet to mint a token',
                severity: 'error',
            });

            return;
        }
        if (walletBalance < 1) {
            showGlobalSnackbar({
                message: 'You need at least 1 KAS to mint a token',
                severity: 'error',
            });
            return;
        }
        const inscribeJsonString = JSON.stringify({
            p: 'KRC-20',
            op: 'mint',
            tick: ticker,
        });
        try {
            const mint = await mintKRC20Token(inscribeJsonString);
            if (mint) {
                const { commit, reveal } = JSON.parse(mint);
                showGlobalSnackbar({
                    message: 'Token Mint successfully',
                    severity: 'success',
                    commit,
                    reveal,
                });
            }
        } catch (error) {
            showGlobalSnackbar({
                message: 'Failed to Mint Token',
                severity: 'error',
                details: error.message,
            });
        }
    };

    return (
        <div key={token.ticker}>
            <ListItem disablePadding sx={{ height: '12vh' }}>
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                width: '7vh',
                                height: '7vh',
                            }}
                            style={{
                                marginLeft: '0.1vw',
                                borderRadius: 5,
                            }}
                            variant="square"
                            alt={token.ticker}
                            src={token.logoUrl}
                        />
                    </ListItemAvatar>

                    <ListItemText
                        sx={{
                            width: '16vw',
                        }}
                        primary={
                            <Tooltip title={token.ticker}>
                                <Typography variant="body1" sx={{ fontSize: '1.2vw' }}>
                                    {capitalizeFirstLetter(token.ticker)}
                                </Typography>
                            </Tooltip>
                        }
                    />

                    <ListItemText
                        sx={{ width: '15vw' }}
                        primary={
                            <Typography
                                variant="body1"
                                style={{
                                    fontSize: '1.2vw',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'start',
                                }}
                            >
                                {token.balance}
                            </Typography>
                        }
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2vw', width: '30vw' }}>
                        <Button
                            onClick={(event) => handleTranfer(event, token.ticker)}
                            variant="contained"
                            color="primary"
                            sx={{
                                minWidth: '2vw',
                                width: '4vw',
                                fontSize: '0.8vw',
                            }}
                        >
                            Transfer
                        </Button>
                        {true && (
                            <Button
                                onClick={(event) => handleMint(event, token.ticker)}
                                variant="contained"
                                color="primary"
                                sx={{
                                    minWidth: '2vw',
                                    width: '3vw',
                                    fontSize: '0.8vw',
                                }}
                            >
                                Mint
                            </Button>
                        )}
                    </Box>
                    {/* {token.state !== 'finished' && (
                        <ListItemText
                            sx={{ maxWidth: '10%', display: 'flex', justifyContent: 'center' }}
                            primary={
                                <Button
                                    onClick={(event) => handleMint(event, token.ticker)}
                                    variant="contained"
                                    color="primary"
                                    style={{
                                        minWidth: '2vw',
                                        width: '3vw',
                                        fontSize: '0.8vw',
                                    }}
                                >
                                    Mint
                                </Button>
                            }
                        />
                    )} */}
                </ListItemButton>
            </ListItem>
            <Divider />
        </div>
    );
};

export default TokenRowPortfolio;
