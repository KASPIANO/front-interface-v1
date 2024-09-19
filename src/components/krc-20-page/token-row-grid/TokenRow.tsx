import { Stat, StatArrow, StatHelpText, StatNumber } from '@chakra-ui/react';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
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
import moment from 'moment';
import { FC } from 'react';
import { TokenListItemResponse } from '../../../types/Types';
import { mintKRC20Token } from '../../../utils/KaswareUtils';
import { capitalizeFirstLetter, formatDate, formatNumberWithCommas, simplifyNumber } from '../../../utils/Utils';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';

interface TokenRowProps {
    token: TokenListItemResponse;
    handleItemClick: (token: any) => void;
    tokenKey: string;
    walletBalance: number;
    walletConnected: boolean;
    walletAddress: string | null;
}

export const TokenRow: FC<TokenRowProps> = (props) => {
    const { token, handleItemClick, tokenKey, walletBalance, walletConnected } = props;

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
                    message: 'Token minted successfully',
                    severity: 'success',
                    commit,
                    reveal,
                });
            }
        } catch (error) {
            showGlobalSnackbar({
                message: 'Token minting failed',
                severity: 'error',
                details: error.message,
            });
        }
    };

    const preMintedIcons = (preMinted: number, totalSupply: number) => {
        const preMintPercentage = ((preMinted / totalSupply) * 100)?.toFixed(2);

        return (
            <ListItemText
                sx={{ display: 'flex' }}
                primary={
                    <Tooltip title={`${preMintPercentage}% Pre Minted`}>
                        {preMinted === 0 ? (
                            <CheckCircleOutlineRoundedIcon
                                style={{ color: 'green', opacity: 0.5, height: '1.5vw', width: '1.5vw' }}
                            />
                        ) : (
                            <ErrorOutlineRoundedIcon
                                style={{ color: 'red', opacity: 0.5, height: '1.5vw', width: '1.5vw' }}
                            />
                        )}
                    </Tooltip>
                }
            />
        );
    };

    return (
        <div key={tokenKey}>
            <ListItem onClick={() => handleItemClick(token)} disablePadding sx={{ height: '12vh' }}>
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
                            maxWidth: '17%',
                        }}
                        primary={
                            <Tooltip title="">
                                <Typography component={'span'} variant="body1" style={{ fontSize: '1vw' }}>
                                    {capitalizeFirstLetter(token.ticker)}
                                </Typography>
                            </Tooltip>
                        }
                        secondary={
                            <Typography component={'span'} variant="body2" style={{ fontSize: '0.9vw' }}>
                                {formatDate(token.creationDate)}
                            </Typography>
                        }
                    />

                    <ListItemText
                        sx={{ maxWidth: '13%' }}
                        primary={
                            <Typography
                                component={'span'}
                                variant="body2"
                                style={{ fontSize: '1vw', display: 'flex', justifyContent: 'flex-start' }}
                            >
                                {`${moment().diff(Number(token.creationDate), 'days')} days`}
                            </Typography>
                        }
                    />
                    <ListItemText
                        sx={{ maxWidth: '13%' }}
                        primary={
                            <Tooltip title={formatNumberWithCommas(token.marketCap)}>
                                <Stat>
                                    <StatNumber style={{ fontSize: '1vw' }} margin="0">
                                        {simplifyNumber(token.marketCap)}
                                    </StatNumber>
                                    {token.changeMarketCap !== null && (
                                        <StatHelpText style={{ fontSize: '0.8vw' }} margin="0">
                                            {token.changeMarketCap.toFixed(2)}%
                                            <StatArrow
                                                sx={{
                                                    color: token.changeMarketCap >= 0 ? 'green' : 'red',
                                                    marginLeft: '2px',
                                                }}
                                                type={token.changeMarketCap >= 0 ? 'increase' : 'decrease'}
                                            />
                                        </StatHelpText>
                                    )}
                                </Stat>
                            </Tooltip>
                        }
                    />
                    <Tooltip title="This shows the percentage of tokens minted, along with the number of mints made in the selected time interval.">
                        <Stat maxWidth="14%" display="flex" justifyContent="flex-start">
                            <StatNumber style={{ fontSize: '1vw' }} margin="0">
                                {(token.totalMintedPercent * 100).toFixed(2)}%
                            </StatNumber>
                            <StatHelpText style={{ fontSize: '0.8vw' }} margin="0">
                                Mints: {token.changeTotalMints}
                                <StatArrow sx={{ color: 'green', marginLeft: '2px' }} type="increase" />
                            </StatHelpText>
                        </Stat>
                    </Tooltip>
                    <Tooltip title="This displays the total number of token holders and the change in the holder amount during the selected time interval.">
                        <Stat maxWidth="16.5%">
                            <StatNumber style={{ fontSize: '1vw' }} margin="0">
                                {token.totalHolders || 0}
                            </StatNumber>

                            <StatHelpText style={{ fontSize: '0.8vw' }} margin="0">
                                {token.changeTotalHolders}
                                <StatArrow
                                    sx={{
                                        color: token.changeTotalHolders >= 0 ? 'green' : 'red',
                                        marginLeft: '2px',
                                    }}
                                    type={token.changeTotalHolders >= 0 ? 'increase' : 'decrease'}
                                />
                            </StatHelpText>
                        </Stat>
                    </Tooltip>

                    <ListItemText
                        sx={{ maxWidth: '13%' }}
                        primary={
                            <Typography component={'span'} variant="body2" style={{ fontSize: '1vw' }}>
                                {preMintedIcons(token.preMintedSupply, token.totalSupply)}
                            </Typography>
                        }
                    />
                    {token.state !== 'finished' ? (
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
                    ) : (
                        <div style={{ width: '10%' }} />
                    )}
                </ListItemButton>
            </ListItem>
            <Divider />
        </div>
    );
};
