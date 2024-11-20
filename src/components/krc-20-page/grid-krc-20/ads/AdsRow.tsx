import { FC, useEffect, useState } from 'react';

import {
    Avatar,
    Box,
    Button,
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
    useTheme,
} from '@mui/material';

import { AdsListItemResponse, SlotPurpose, slotPurposeDisplayMapper } from '../../../../types/Types';
import { DEFAULT_TOKEN_LOGO_URL } from '../../../../utils/Constants';
import { capitalizeFirstLetter, isEmptyString } from '../../../../utils/Utils';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga';
import { getFyiLogo } from '../../../../DAL/KaspaApiDal';

interface AdsRowProps {
    adData: AdsListItemResponse;
    handleItemClick: (telegram: string, ticker: string) => void;
}

export const AdsRow: FC<AdsRowProps> = (props) => {
    const { adData, handleItemClick } = props;
    const [fyiLogo, setFyiLogo] = useState<any>(null);

    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (!adData.logo) {
            getFyiLogo(adData.ticker)
                .then((response) => {
                    const imageUrl = URL.createObjectURL(response); // Use the blob data here
                    setFyiLogo(imageUrl);
                })
                .catch(() => {
                    setFyiLogo(DEFAULT_TOKEN_LOGO_URL); // Fallback if there's an error
                });
        }
    }, [adData]);

    const handleMint = (event, ticker) => {
        event.stopPropagation();
        ReactGA.event({
            category: 'Link', // Event category (e.g., 'Link' for all external links)
            action: 'Click', // Event action (e.g., 'Click')
            label: `Token Page - ${ticker}`, // Event label (e.g., 'Telegram - MyAdName')
        });
        navigate(`/token/${ticker}`);
    };

    return (
        <div>
            <ListItem
                onClick={() => handleItemClick(adData.telegram, adData.ticker)}
                disablePadding
                sx={{ height: '7vh' }}
            >
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                width: '1.8rem',
                                height: '1.8rem',
                                marginRight: '1vw',
                            }}
                            style={{
                                marginLeft: '0.5rem',
                                borderRadius: 14,
                            }}
                            variant="square"
                            alt={adData.ticker}
                            src={isEmptyString(adData.logo) ? fyiLogo : adData.logo}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        sx={{
                            maxWidth: '11rem',
                        }}
                        primary={
                            <Typography
                                style={{
                                    minWidth: '1vw',
                                    width: '2vw',
                                    fontSize: '1rem',
                                    fontWeight: 530,
                                    color: theme.palette.text.primary,
                                    letterSpacing: '0.1rem', // Add spacing between letters
                                }}
                            >
                                {capitalizeFirstLetter(adData.ticker)}
                            </Typography>
                        }
                    />
                    {/* 36 chars max */}
                    <ListItemText
                        sx={{
                            maxWidth: '40rem',
                            display: 'flex', // Use flex display
                            justifyContent: 'center',
                        }}
                        primary={
                            <Typography
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 350,
                                    color: theme.palette.text.primary,
                                    letterSpacing: '0.1rem', // Add spacing between letters
                                }}
                            >
                                {adData.message}
                            </Typography>
                        }
                    />
                    {/* Additional details if necessary, following similar structure */}
                    <ListItemText
                        sx={{
                            maxWidth: '7rem',
                            transform: 'translateY(12%)',
                        }}
                        primary={
                            <Button
                                onClick={(event) => handleMint(event, adData.ticker)}
                                color="primary"
                                style={{
                                    fontWeight: 600,
                                    fontSize: '0.65rem',
                                    color: theme.palette.primary.main,
                                }}
                            >
                                {adData.state === 'finished' ? 'Buy Now' : 'Mint Now'}
                            </Button>
                        }
                    />
                    <ListItemText
                        sx={{
                            position: 'absolute',
                            right: '19%', // Adjust this value as needed to ensure it stays within bounds
                            top: '47%',
                            transform: 'translateY(-50%)',
                            width: '6vw',
                            justifyContent: 'start',
                        }}
                        primary={
                            <Box
                                sx={{
                                    display: 'inline-block',
                                    padding: '2px 6px', // Adjust padding for a consistent look
                                    border: `0.5px solid rgba(111, 199, 186, 0.3)`,
                                    borderRadius: '4px',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    style={{
                                        fontSize: '0.6rem',
                                        color: 'gray',
                                        fontWeight: 700,
                                    }}
                                >
                                    {slotPurposeDisplayMapper[
                                        adData.purpose as unknown as keyof typeof SlotPurpose
                                    ] || 'Featured'}
                                </Typography>
                            </Box>
                        }
                    />
                </ListItemButton>
            </ListItem>
            <Divider />
        </div>
    );
};
