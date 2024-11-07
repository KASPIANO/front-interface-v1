import { FC } from 'react';

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
import { capitalizeFirstLetter } from '../../../../utils/Utils';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';

interface AdsRowProps {
    adData: AdsListItemResponse;
    handleItemClick: (adData: any) => void;
    walletConnected: boolean;
    walletBalance: number;
}

const blink = keyframes`
  0%, 100% { color: inherit; }    // Default color
  50% { color: red; }             // Blinking color
`;

export const AdsRow: FC<AdsRowProps> = (props) => {
    const { adData, handleItemClick } = props;
    const theme = useTheme();
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
                                    style={{
                                        fontSize: '1.4rem',
                                        fontWeight: 550,
                                        color: theme.palette.text.primary,
                                        letterSpacing: '0.1rem', // Add spacing between letters
                                        display: 'inline-flex', // Allows inline display with emoji
                                        alignItems: 'center',
                                    }}
                                >
                                    {capitalizeFirstLetter(adData.ticker)}
                                </Typography>
                            </Tooltip>
                        }
                    />
                    <ListItemText
                        sx={{
                            width: '7vw',
                        }}
                        primary={
                            <Tooltip title="">
                                <Typography
                                    variant="body1"
                                    style={{
                                        fontSize: '1rem',
                                        fontWeight: 350,
                                        color: theme.palette.text.primary,
                                        letterSpacing: '0.1rem', // Add spacing between letters
                                    }}
                                >
                                    {adData.message}
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
                                    color="primary"
                                    style={{
                                        fontWeight: 450,
                                        width: '7rem',
                                        height: '2rem',
                                        fontSize: '1rem',
                                        color: theme.palette.primary.main,
                                        animation: `${blink} 2s infinite`, // Apply animation
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
