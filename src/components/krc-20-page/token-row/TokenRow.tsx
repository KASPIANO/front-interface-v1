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
import { formatNumberWithCommas, simplifyNumber } from '../../../utils/Utils';
import { capitalizeFirstLetter, formatDate } from '../grid-krc-20/Krc20Grid.config';
import { mintKRC20Token } from '../../../utils/KaswareUtils';

interface TokenRowProps {
    token: any;
    handleItemClick: (token: any) => void;
    tokenKey: string;
    walletBalance: number;
}

export const TokenRow: FC<TokenRowProps> = (props) => {
    const { token, handleItemClick, tokenKey, walletBalance } = props;
    const handleMint = async (event, ticker: string) => {
        event.stopPropagation();
        if (walletBalance < 1) {
            console.log('Insufficient funds');
            return;
        }
        const inscribeJsonString = JSON.stringify({
            p: 'KRC-20',
            op: 'mint',
            tick: ticker,
        });
        const mint = await mintKRC20Token(inscribeJsonString);
    };

    const preMintedIcons = (preMinted: string, totalSupply: string) => {
        const preMintedNumber = parseFloat(preMinted);
        const totalSupplyNumber = parseFloat(totalSupply);
        const preMintPercentage = ((preMintedNumber / totalSupplyNumber) * 100).toFixed(2);

        return (
            <ListItemText
                sx={{ marginLeft: '1vw' }}
                primary={
                    <Tooltip title={`${preMintPercentage}% Pre Minted`}>
                        {preMintedNumber === 0 ? (
                            <CheckCircleOutlineRoundedIcon style={{ color: 'green', opacity: 0.5 }} />
                        ) : (
                            <ErrorOutlineRoundedIcon style={{ color: 'red', opacity: 0.5 }} />
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
                            style={{
                                marginLeft: '0.1vw',
                                borderRadius: 5,
                            }}
                            variant="square"
                            alt={token.tick}
                            src="/path/to/logo" // Update with actual logo source
                        />
                    </ListItemAvatar>

                    <ListItemText
                        sx={{
                            maxWidth: '10vw',
                        }}
                        primary={
                            <Tooltip title={token.tick}>
                                <Typography variant="body1" style={{ fontSize: '1.2vw' }}>
                                    {capitalizeFirstLetter(token.tick)}
                                </Typography>
                            </Tooltip>
                        }
                        secondary={
                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                {formatDate(token.mtsAdd)}
                            </Typography>
                        }
                    />

                    <ListItemText
                        sx={{ maxWidth: '10vw' }}
                        primary={
                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                {`${moment().diff(Number(token.mtsAdd), 'days')} days`}
                            </Typography>
                        }
                    />

                    <ListItemText
                        sx={{ maxWidth: '11vw' }}
                        primary={
                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                {((token.minted / token.max) * 100).toFixed(2)}%
                            </Typography>
                        }
                    />

                    <ListItemText
                        sx={{ maxWidth: '11.5vw' }}
                        primary={
                            <Tooltip title={formatNumberWithCommas(token.max)}>
                                <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                    {simplifyNumber(token.max)}
                                </Typography>
                            </Tooltip>
                        }
                    />

                    <ListItemText
                        sx={{ maxWidth: '9.5vw' }}
                        primary={
                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                {token.holder ? token.holder.length : 0}
                            </Typography>
                        }
                    />

                    <ListItemText
                        sx={{ maxWidth: '9.5vw' }}
                        primary={
                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                {token.transferTotal ? token.transferTotal : 0}
                            </Typography>
                        }
                    />

                    <ListItemText
                        sx={{ maxWidth: '12vw' }}
                        primary={
                            <Typography variant="body2" style={{ fontSize: '0.9vw' }}>
                                {preMintedIcons(token.pre, token.max)}
                            </Typography>
                        }
                    />
                    {token.minted < token.max && (
                        <Button
                            onClick={(event) => handleMint(event, token.tick)}
                            variant="contained"
                            color="primary"
                            style={{
                                marginRight: '1vw',
                                minWidth: '2vw',
                                width: '3vw',
                                fontSize: '0.8vw',
                            }}
                            disabled={token.minted >= token.max}
                        >
                            Mint
                        </Button>
                    )}
                </ListItemButton>
            </ListItem>
            <Divider />
        </div>
    );
};
