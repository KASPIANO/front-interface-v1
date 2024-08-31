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
                            <Tooltip title={token.ticker}>
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
                            <Tooltip title={formatNumberWithCommas(token.totalSupply)}>
                                <Typography
                                    component={'span'}
                                    variant="body2"
                                    style={{ fontSize: '1vw', display: 'flex', justifyContent: 'flex-start' }}
                                >
                                    {simplifyNumber(token.totalSupply)}
                                </Typography>
                            </Tooltip>
                        }
                    />
                    <Stat maxWidth="14%" display="flex" justifyContent="flex-start">
                        <StatNumber style={{ fontSize: '1vw' }} margin="0">
                            {token.totalMintedPercent?.toFixed(2)}%
                        </StatNumber>
                        <StatHelpText style={{ fontSize: '0.8vw' }} margin="0">
                            <StatArrow sx={{ color: 'green', marginRight: '2px' }} type="increase" />
                            23.36%
                        </StatHelpText>
                    </Stat>

                    <Stat maxWidth="16.5%">
                        <StatNumber style={{ fontSize: '1vw' }} margin="0">
                            {token.totalHolders || 0}
                        </StatNumber>
                        <StatHelpText style={{ fontSize: '0.8vw' }} margin="0">
                            <StatArrow sx={{ color: 'green', marginRight: '2px' }} type="increase" />
                            10.36%
                        </StatHelpText>
                    </Stat>

                    {/* <ListItemText
                        sx={{ width: '9.5vw' }}
                        primary={
                            <Typography
                            component={'span'} variant="body2" style={{ fontSize: '1.1vw' }}>
                                {token.transferTotal ? token.transferTotal : 0}
                            </Typography>
                        }
                    /> */}

                    <ListItemText
                        sx={{ maxWidth: '13%' }}
                        primary={
                            <Typography component={'span'} variant="body2" style={{ fontSize: '1vw' }}>
                                {preMintedIcons(token.preMintedSupply, token.totalSupply)}
                            </Typography>
                        }
                    />
                    {token.preMintedSupply < token.totalSupply ? (
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
                                    disabled={token.preMintedSupply >= token.totalSupply}
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
