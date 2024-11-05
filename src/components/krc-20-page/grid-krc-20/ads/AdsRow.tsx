import { FC } from 'react';
import { Stat, StatNumber } from '@chakra-ui/react';

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
    useTheme,
} from '@mui/material';

import { AdsListItemResponse, SlotPurpose, slotPurposeDisplayMapper } from '../../../../types/Types';
import { DEFAULT_TOKEN_LOGO_URL } from '../../../../utils/Constants';
import { capitalizeFirstLetter, formatPrice, formatNumberWithCommas, formatDate } from '../../../../utils/Utils';
import { useNavigate } from 'react-router-dom';

interface AdsRowProps {
    adData: AdsListItemResponse;
    handleItemClick: (adData: any) => void;
    walletConnected: boolean;
    walletBalance: number;
}

export const AdsRow: FC<AdsRowProps> = (props) => {
    const { adData, handleItemClick } = props;
    const navigate = useNavigate();

    const handleMint = (event, ticker) => {
        event.stopPropagation();
        navigate(`/token/${ticker}`);
    };

    return (
        <div>
            <ListItem onClick={() => handleItemClick(adData.telegram)} disablePadding sx={{ height: '7vh' }}>
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
                                <Typography
                                    component={'span'}
                                    variant="body1"
                                    style={{ fontSize: '0.8rem', fontWeight: 700 }}
                                >
                                    {capitalizeFirstLetter(adData.ticker)}
                                </Typography>
                            </Tooltip>
                        }
                    />

                    {/* Additional details if necessary, following similar structure */}

                    {adData.state === 'finished' ? (
                        <ListItemText
                            sx={{ width: '4rem' }}
                            primary={
                                <Button
                                    onClick={(event) => handleMint(event, adData.ticker)}
                                    variant="contained"
                                    color="primary"
                                    style={{
                                        minWidth: '1rem',
                                        width: '4rem',
                                        height: '2rem',
                                        fontSize: '0.6rem',
                                    }}
                                >
                                    Mint Now
                                </Button>
                            }
                        />
                    ) : (
                        <div style={{ width: '3vw' }} />
                    )}
                    <ListItemText
                        sx={{
                            position: 'absolute',
                            right: '5px', // Adjust this value as needed to position it precisely
                            top: '55%', // Center vertically within the ListItem
                            transform: 'translateY(-50%)', // Centering transformation
                            width: '6vw',
                            justifyContent: 'start',
                        }}
                        primary={
                            <Box
                                sx={{
                                    display: 'inline-block',
                                    padding: '1px 4px', // Padding inside the border box
                                    border: `0.5px solid rgba(111, 199, 186, 0.3)`, // Border color
                                    borderRadius: '4px', // Rounded corners
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    style={{
                                        fontSize: '0.6rem',
                                        color: 'gray',
                                        fontWeight: 'bold',
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
