import {
    Avatar,
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
import { transferKRC20Token } from '../../../utils/KaswareUtils';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { TokenRowPortfolioItem } from '../../../types/Types';
import { capitalizeFirstLetter } from '../../../utils/Utils';

interface TokenRowPortfolioProps {
    token: TokenRowPortfolioItem;
    walletConnected: boolean;
    kasPrice: number;
}

const TokenRowPortfolio: FC<TokenRowPortfolioProps> = (props) => {
    const { token, walletConnected, kasPrice } = props;
    const [destAddress] = useState<string>('');

    const handleTranfer = async (event, ticker: string) => {
        event.stopPropagation();
        if (!walletConnected) {
            showGlobalSnackbar({
                message: 'Please connect your wallet to mint a token',
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
            op: 'trasnfer',
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

    return (
        <div key={token.ticker}>
            <ListItem disablePadding sx={{ height: '12vh' }}>
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                width: '6vh',
                                height: '6vh',
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
                            maxWidth: '11vw',
                        }}
                        primary={
                            <Tooltip title={token.ticker}>
                                <Typography variant="body1" style={{ fontSize: '1.2vw' }}>
                                    {capitalizeFirstLetter(token.ticker)}
                                </Typography>
                            </Tooltip>
                        }
                    />

                    <ListItemText
                        sx={{ maxWidth: '12vw' }}
                        primary={
                            <Typography
                                variant="body2"
                                style={{ fontSize: '1.1vw', display: 'flex', justifyContent: 'center' }}
                            >
                                {token.price}/Sompi
                            </Typography>
                        }
                        secondary={
                            <Typography
                                variant="body2"
                                style={{ fontSize: '0.8vw', display: 'flex', justifyContent: 'center' }}
                            >
                                ${parseInt(token.price) * kasPrice}
                            </Typography>
                        }
                    />
                    <ListItemText
                        sx={{ maxWidth: '12vw' }}
                        primary={
                            <Typography
                                variant="body2"
                                style={{ fontSize: '1.1vw', display: 'flex', justifyContent: 'center' }}
                            >
                                {token.totalValue} KAS
                            </Typography>
                        }
                        secondary={
                            <Typography
                                variant="body2"
                                style={{ fontSize: '0.8vw', display: 'flex', justifyContent: 'center' }}
                            >
                                ${parseInt(token.totalValue) * kasPrice}
                            </Typography>
                        }
                    />
                    <ListItemText
                        sx={{ maxWidth: '11vw', display: 'flex', justifyContent: 'center' }}
                        primary={
                            <Button
                                onClick={(event) => handleTranfer(event, token.ticker)}
                                variant="contained"
                                color="primary"
                                style={{
                                    minWidth: '2vw',
                                    width: '3vw',
                                    fontSize: '0.8vw',
                                }}
                            >
                                Transfer
                            </Button>
                        }
                    />
                </ListItemButton>
            </ListItem>
            <Divider />
        </div>
    );
};

export default TokenRowPortfolio;
