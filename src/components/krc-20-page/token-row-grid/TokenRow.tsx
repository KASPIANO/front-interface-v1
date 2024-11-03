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
import {
    capitalizeFirstLetter,
    formatDate,
    formatNumberWithCommas,
    formatPrice,
    isEmptyString,
    simplifyNumber,
} from '../../../utils/Utils';
import { showGlobalSnackbar } from '../../alert-context/AlertContext';
import { DEFAULT_TOKEN_LOGO_URL } from '../../../utils/Constants';

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
            const mint = await mintKRC20Token(inscribeJsonString, ticker);
            if (mint) {
                const { commitId, revealId } = JSON.parse(mint);
                showGlobalSnackbar({
                    message: 'Token minted successfully',
                    severity: 'success',
                    commitId,
                    revealId,
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
                                width: '2.3rem',
                                height: '2.3rem',
                                marginRight: '1vw',
                            }}
                            style={{
                                marginLeft: '0.1vw',
                                borderRadius: 7,
                            }}
                            variant="square"
                            alt={token.ticker}
                            src={isEmptyString(token.logoUrl) ? DEFAULT_TOKEN_LOGO_URL : token.logoUrl}
                        />
                    </ListItemAvatar>

                    <ListItemText
                        sx={{
                            width: '7vw',
                        }}
                        primary={
                            <Tooltip title="">
                                <Typography component={'span'} variant="body1" style={{ fontSize: '0.8rem' }}>
                                    {capitalizeFirstLetter(token.ticker)}
                                </Typography>
                            </Tooltip>
                        }
                        secondary={
                            <Typography component={'span'} variant="body2" style={{ fontSize: '0.75rem' }}>
                                {formatDate(token.creationDate)}
                            </Typography>
                        }
                    />

                    <ListItemText
                        sx={{ width: '6vw', justifyContent: 'start' }}
                        primary={
                            <Typography
                                component={'span'}
                                variant="body2"
                                style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'flex-start' }}
                            >
                                {`${moment().diff(Number(token.creationDate), 'days')} days`}
                            </Typography>
                        }
                    />
                    <ListItemText
                        sx={{ width: '9vw' }}
                        primary={
                            <Tooltip title={`${token.price} Kas`}>
                                <Stat>
                                    <StatNumber style={{ fontSize: '0.8rem' }} margin="0">
                                        {formatPrice(token.price)}
                                    </StatNumber>
                                    {token.changePrice !== null && (
                                        <StatHelpText
                                            style={{
                                                display: token.changePrice === 0 ? 'none' : '',
                                                fontSize: '0.7rem',
                                            }}
                                            margin="0"
                                        >
                                            {token.changePrice.toFixed(2)}%
                                            <StatArrow
                                                sx={{
                                                    color: token.changePrice >= 0 ? 'green' : 'red',
                                                    marginLeft: '2px',
                                                }}
                                                type={token.changePrice >= 0 ? 'increase' : 'decrease'}
                                            />
                                        </StatHelpText>
                                    )}
                                </Stat>
                            </Tooltip>
                        }
                    />
                    <ListItemText
                        sx={{ width: '8vw', justifyContent: 'start' }}
                        primary={
                            <Tooltip
                                title={`${
                                    Number.isFinite(token?.volumeUsd)
                                        ? formatNumberWithCommas(token.volumeUsd.toFixed(0))
                                        : '0'
                                } USD`}
                            >
                                <Stat>
                                    <StatNumber style={{ fontSize: '0.8rem' }} margin="0">
                                        {Number.isFinite(token?.volumeUsd)
                                            ? formatNumberWithCommas(token.volumeUsd.toFixed(0))
                                            : '0'}
                                    </StatNumber>
                                    {Number.isFinite(token?.changeVolumeUsd) && token.changeVolumeUsd !== 0 && (
                                        <StatHelpText style={{ fontSize: '0.7rem' }} margin="0">
                                            {token.changeVolumeUsd.toFixed(2)}%
                                            <StatArrow
                                                sx={{
                                                    color: token.changeVolumeUsd >= 0 ? 'green' : 'red',
                                                    marginLeft: '2px',
                                                }}
                                                type={token.changeVolumeUsd >= 0 ? 'increase' : 'decrease'}
                                            />
                                        </StatHelpText>
                                    )}
                                </Stat>
                            </Tooltip>
                        }
                    />

                    <ListItemText
                        sx={{ width: '8vw', justifyContent: 'start' }}
                        primary={
                            <Tooltip title={`${formatNumberWithCommas(token.marketCap)} USD`}>
                                <Stat>
                                    <StatNumber style={{ fontSize: '0.8rem' }} margin="0">
                                        {simplifyNumber(token.marketCap)}
                                    </StatNumber>
                                    {token.changeMarketCap !== null && (
                                        <StatHelpText
                                            style={{
                                                fontSize: '0.7rem',
                                                display: token.changeMarketCap === 0 ? 'none' : '',
                                            }}
                                            margin="0"
                                        >
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
                    <ListItemText
                        sx={{ width: '8vw' }}
                        primary={
                            <Tooltip title="This shows the percentage of tokens minted, along with the number of mints made in the selected time interval.">
                                <Stat>
                                    <StatNumber style={{ fontSize: '0.8rem' }} margin="0">
                                        {(token.totalMintedPercent * 100).toFixed(2)}%
                                    </StatNumber>
                                    <StatHelpText
                                        style={{
                                            fontSize: '0.7rem',
                                            display: token.changeTotalMints === 0 ? 'none' : '',
                                        }}
                                        margin="0"
                                    >
                                        Mints: {token.changeTotalMints}
                                        <StatArrow
                                            sx={{
                                                color: 'green',
                                                marginLeft: '2px',
                                            }}
                                            type="increase"
                                        />
                                    </StatHelpText>
                                </Stat>
                            </Tooltip>
                        }
                    />
                    <ListItemText
                        sx={{ width: '6vw', justifyContent: 'start' }}
                        primary={
                            <Tooltip title="This displays the total number of token holders and the change in the holder amount during the selected time interval.">
                                <Stat>
                                    <StatNumber style={{ fontSize: '0.8rem' }} margin="0">
                                        {token.totalHolders || 0}
                                    </StatNumber>

                                    <StatHelpText
                                        style={{
                                            fontSize: '0.7rem',
                                            display: token.changeTotalHolders === 0 ? 'none' : '',
                                        }}
                                        margin="0"
                                    >
                                        {token.changeTotalHolders}
                                        <StatArrow
                                            sx={{
                                                display: token.changeTotalHolders === 0 ? 'none' : '',
                                                color: token.changeTotalHolders >= 0 ? 'green' : 'red',
                                                marginLeft: '2px',
                                            }}
                                            type={token.changeTotalHolders >= 0 ? 'increase' : 'decrease'}
                                        />
                                    </StatHelpText>
                                </Stat>
                            </Tooltip>
                        }
                    />

                    <ListItemText
                        sx={{ width: '5vw', justifyContent: 'start' }}
                        primary={
                            <Typography component={'span'} variant="body2" style={{ fontSize: '0.8rem' }}>
                                {preMintedIcons(token.preMintedSupply, token.totalSupply)}
                            </Typography>
                        }
                    />
                    {token.state !== 'finished' ? (
                        <ListItemText
                            sx={{ width: '1.1vw' }}
                            primary={
                                <Button
                                    onClick={(event) => handleMint(event, token.ticker)}
                                    variant="contained"
                                    color="primary"
                                    style={{
                                        minWidth: '1rem',
                                        width: '1.5rem',
                                        height: '1.5rem',
                                        fontSize: '0.6rem',
                                    }}
                                >
                                    Mint
                                </Button>
                            }
                        />
                    ) : (
                        <div style={{ width: '3vw' }} />
                    )}
                </ListItemButton>
            </ListItem>
            <Divider />
        </div>
    );
};
