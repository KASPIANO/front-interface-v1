import { FC } from 'react';
import { Stat, StatArrow, StatHelpText, StatNumber } from '@chakra-ui/react';

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

import { TokenListItemResponse } from '../../../../types/Types';
import { DEFAULT_TOKEN_LOGO_URL } from '../../../../utils/Constants';
import { capitalizeFirstLetter, formatPrice, formatNumberWithCommas, formatDate } from '../../../../utils/Utils';

interface AdsRowProps {
    adData: TokenListItemResponse;
    handleItemClick: (adData: any) => void;
}

export const AdsRow: FC<AdsRowProps> = ({ adData, handleItemClick }) => (
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
                        src={adData.logoUrl || DEFAULT_TOKEN_LOGO_URL}
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
                    sx={{ width: '6vw', justifyContent: 'start' }}
                    primary={
                        <Typography
                            component={'span'}
                            variant="body2"
                            style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'flex-start' }}
                        >
                            {`${moment().diff(Number(adData.creationDate), 'days')} days`}
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
                                {adData.changePrice !== null && (
                                    <StatHelpText
                                        style={{
                                            display: adData.changePrice === 0 ? 'none' : '',
                                            fontSize: '0.7rem',
                                        }}
                                        margin="0"
                                    >
                                        {adData.changePrice.toFixed(2)}%
                                        <StatArrow
                                            sx={{
                                                color: adData.changePrice >= 0 ? 'green' : 'red',
                                                marginLeft: '2px',
                                            }}
                                            type={adData.changePrice >= 0 ? 'increase' : 'decrease'}
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
                                {Number.isFinite(adData?.changeVolumeUsd) && adData.changeVolumeUsd !== 0 && (
                                    <StatHelpText style={{ fontSize: '0.7rem' }} margin="0">
                                        {adData.changeVolumeUsd.toFixed(2)}%
                                        <StatArrow
                                            sx={{
                                                color: adData.changeVolumeUsd >= 0 ? 'green' : 'red',
                                                marginLeft: '2px',
                                            }}
                                            type={adData.changeVolumeUsd >= 0 ? 'increase' : 'decrease'}
                                        />
                                    </StatHelpText>
                                )}
                            </Stat>
                        </Tooltip>
                    }
                />

                {/* Additional details if necessary, following similar structure */}

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
                            Sponsored
                        </Typography>
                    }
                />
            </ListItemButton>
        </ListItem>
        <Divider />
    </div>
);
