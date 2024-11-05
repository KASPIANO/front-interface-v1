import { FC } from 'react';
import { Stat, StatNumber } from '@chakra-ui/react';

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

import { AdsListItemResponse, SlotPurpose } from '../../../../types/Types';
import { DEFAULT_TOKEN_LOGO_URL } from '../../../../utils/Constants';
import { capitalizeFirstLetter, formatPrice, formatNumberWithCommas, formatDate } from '../../../../utils/Utils';
import { mintKRC20Token } from '../../../../utils/KaswareUtils';
import { showGlobalSnackbar } from '../../../alert-context/AlertContext';

interface AdsRowProps {
    adData: AdsListItemResponse;
    handleItemClick: (adData: any) => void;
    walletConnected: boolean;
    walletBalance: number;
}

export const AdsRow: FC<AdsRowProps> = (props) => {
    const { adData, handleItemClick, walletConnected, walletBalance } = props;

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

    return (
        <div>
            <ListItem onClick={() => handleItemClick(adData)} disablePadding sx={{ height: '12vh' }}>
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
                            alt={adData.ticker}
                            src={adData.logo || DEFAULT_TOKEN_LOGO_URL}
                        />
                    </ListItemAvatar>

                    <ListItemText
                        sx={{
                            width: '7vw',
                        }}
                        primary={
                            <Tooltip title="">
                                <Typography component={'span'} variant="body1" style={{ fontSize: '0.8rem' }}>
                                    {capitalizeFirstLetter(adData.ticker)}
                                </Typography>
                            </Tooltip>
                        }
                        secondary={
                            <Typography component={'span'} variant="body2" style={{ fontSize: '0.75rem' }}>
                                {formatDate(adData.creationDate)}
                            </Typography>
                        }
                    />

                    <ListItemText
                        sx={{ width: '9vw' }}
                        primary={
                            <Tooltip title={`${adData.price} Kas`}>
                                <Stat>
                                    <StatNumber style={{ fontSize: '0.8rem' }} margin="0">
                                        {formatPrice(adData.price)}
                                    </StatNumber>
                                </Stat>
                            </Tooltip>
                        }
                    />

                    <ListItemText
                        sx={{ width: '8vw', justifyContent: 'start' }}
                        primary={
                            <Tooltip
                                title={`${
                                    Number.isFinite(adData?.volumeUsd)
                                        ? formatNumberWithCommas(adData.volumeUsd.toFixed(0))
                                        : '0'
                                } USD`}
                            >
                                <Stat>
                                    <StatNumber style={{ fontSize: '0.8rem' }} margin="0">
                                        {Number.isFinite(adData?.volumeUsd)
                                            ? formatNumberWithCommas(adData.volumeUsd.toFixed(0))
                                            : '0'}
                                    </StatNumber>
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
                                        {(adData.totalMintedPercent * 100).toFixed(2)}%
                                    </StatNumber>
                                </Stat>
                            </Tooltip>
                        }
                    />

                    {/* Additional details if necessary, following similar structure */}

                    {adData.state !== 'finished' ? (
                        <ListItemText
                            sx={{ width: '1.1vw' }}
                            primary={
                                <Button
                                    onClick={(event) => handleMint(event, adData.ticker)}
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
                    <ListItemText
                        sx={{ width: '6vw', justifyContent: 'start' }}
                        primary={
                            <Typography
                                component="span"
                                variant="body2"
                                style={{
                                    fontSize: '0.7rem',
                                    color: 'gray',
                                    fontWeight: 'bold',
                                    textAlign: 'right',
                                    width: '100%',
                                }}
                            >
                                {SlotPurpose[adData.purpose as unknown as keyof typeof SlotPurpose] || 'Sponsored'}
                            </Typography>
                        }
                    />
                </ListItemButton>
            </ListItem>
            <Divider />
        </div>
    );
};
