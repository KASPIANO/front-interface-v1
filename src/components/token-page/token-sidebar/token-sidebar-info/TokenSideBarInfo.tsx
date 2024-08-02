import { FC, useEffect, useState } from 'react';
import { Token } from '../../../../types/Types';
import { Box, Typography, useTheme } from '@mui/material';
import {
    DataPaper,
    DataRowContainer,
    ImageAndSocialsBarContainer,
    SentimentButton,
    SentimentsContainerBox,
} from './TokenSideBarInfo.s';
import {
    RocketLaunchRounded,
    SentimentNeutralRounded,
    SvgIconComponent,
    ThumbsUpDownRounded,
    TrendingDownRounded,
} from '@mui/icons-material';
import TokenSidebarSocialsBar, {
    TokenSidebarSocialsBarOptions,
} from './token-sidebar-socials-bar/TokenSidebarSocialsBar';

export type SentimentButtonsConfig = {
    key: string;
    icon: SvgIconComponent;
};

interface TokenSideBarInfoProps {
    tokenInfo: Token;
    priceInfo: any;
}

const TokenSideBarInfo: FC<TokenSideBarInfoProps> = (props) => {
    const sentimentButtonsConfig: SentimentButtonsConfig[] = [
        { key: 'positive', icon: RocketLaunchRounded },
        { key: 'negative', icon: TrendingDownRounded },
        { key: 'neutral', icon: SentimentNeutralRounded },
        { key: 'mixed', icon: ThumbsUpDownRounded },
    ];

    const theme = useTheme();
    const [selectedSentiment, setSelectedSentiment] = useState<string>(null);
    const [sentimentValues, setSentimentValues] = useState({});
    const [socials, setSocials] = useState<TokenSidebarSocialsBarOptions>(null);

    useEffect(() => {
        setSocials({
            Telegram: 'https://t.me',
            Website: `http://localhost:5173/token/${props.tokenInfo?.tick}`,
        });

        // Set sentiment values
        const newSentimentValues = {};
        sentimentButtonsConfig.forEach((config) => {
            newSentimentValues[config.key] = Math.floor(Math.random() * 1000);
        });
        setSentimentValues(newSentimentValues);
    }, [props]);

    const getSentimentIconValueToDisplay = (key: string): string =>
        sentimentValues[key] ? sentimentValues[key] : '---';

    const onSentimentButtonClick = (key: string) => {
        setSelectedSentiment(key);
        setSentimentValues({ ...sentimentValues, [key]: sentimentValues[key] + 1 });

        // TODO: Implement sentiment button click on backend
    };

    const getImage = (): string => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const primaryColor = theme.palette.common.black; // Primary color for the rectangle
        const textColor = theme.palette.primary.main; // Text color
        const canvasWidth = 300 * 5; // Canvas width
        const canvasHeight = 90 * 5; // Canvas height
        const text = props.tokenInfo.tick; // Text to display
        const borderRadius = 200; // Radius for rounded corners
        const lineColor = theme.palette.secondary.main; // Color for the curly lines
        const lineWidth = 5; // Width of the curly lines
        const margin = 10; // Margin around the rectangle
    
        // Adjust canvas size
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    
        if (!ctx) return '';
    
        // Draw diagonal curly lines background
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        
        // Set up for diagonal curly lines
        const waveHeight = 20; // Height of the wave
        const waveSpacing = 50; // Distance between waves
    
        // Draw diagonal curly lines
        for (let i = -Math.ceil(canvasWidth / waveSpacing); i < Math.ceil(canvasWidth / waveSpacing); i++) {
            const startX = i * waveSpacing;
            const startY = 0;
            const endX = startX + canvasWidth;
            const endY = canvasHeight;
            
            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(startX + waveSpacing / 4, waveHeight, endX - waveSpacing / 4, endY - waveHeight);
            ctx.lineTo(endX, endY);
            ctx.lineTo(startX, startY);
            ctx.closePath();
        }
        ctx.stroke();
    
        // Calculate rectangle dimensions and position
        const rectWidth = canvasWidth - 2 * margin; // Width of the rectangle considering margin
        const rectHeight = canvasHeight - 2 * margin; // Height of the rectangle considering margin
        const rectX = margin; // X position of the rectangle
        const rectY = margin; // Y position of the rectangle
    
        // Draw the rounded rectangle with primary color
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
    
        // Draw top-left corner
        ctx.moveTo(rectX + borderRadius, rectY);
        ctx.lineTo(rectX + rectWidth - borderRadius, rectY);
        ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + rectHeight - borderRadius, borderRadius);
    
        // Draw bottom-right corner
        ctx.lineTo(rectX + rectWidth, rectY + rectHeight - borderRadius);
        ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - borderRadius, rectY + rectHeight, borderRadius);
    
        // Draw bottom-left corner
        ctx.lineTo(rectX + borderRadius, rectY + rectHeight);
        ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - borderRadius, borderRadius);
    
        // Draw top-right corner
        ctx.lineTo(rectX, rectY + borderRadius);
        ctx.arcTo(rectX, rectY, rectX + borderRadius, rectY, borderRadius);
    
        ctx.closePath();
        ctx.fill();
    
        // Add text inside the rectangle
        ctx.font = `bold 300px ${theme.typography.fontFamily}`; // Font size and style
        ctx.textAlign = 'center'; // Center text horizontally
        ctx.textBaseline = 'middle'; // Center text vertically
    
        ctx.fillStyle = textColor; // Set text color
    
        // Draw the text inside the rectangle
        ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
    
        // Convert canvas to Base64
        const base64String = canvas.toDataURL('image/png');
    
        return base64String;
    };
    
  

    return (
        <Box>
            <ImageAndSocialsBarContainer>
                <Box sx={{ overflow: 'hidden' }}>
                    <Box
                        component="img"
                        alt={props.tokenInfo.tick}
                        src={getImage()}
                        sx={{
                            width: '100%',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '15vh',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05, 1.05)',
                            },
                        }}
                    />
                </Box>
                {socials !== null && Object.keys(socials).length > 0}
                {socials !== null && Object.keys(socials).length > 0 && <Box className="SocialsBar"><TokenSidebarSocialsBar options={socials} /></Box>}
            </ImageAndSocialsBarContainer>
            <Box mt={2}>
                <DataRowContainer gap={1}>
                    <DataPaper elevation={0}>
                        <Typography variant="body2" align="center" color="text.secondary">
                            PRICE USD
                        </Typography>
                        <Typography variant="body2" align="center">
                            ---
                        </Typography>
                    </DataPaper>
                    <DataPaper elevation={0}>
                        <Typography variant="body2" align="center" color="text.secondary">
                            PRICE
                        </Typography>
                        <Typography variant="body2" align="center">
                            ---
                        </Typography>
                    </DataPaper>
                    <DataPaper elevation={0}>
                        <Typography variant="body2" align="center" color="text.secondary">
                            SUPPLY
                        </Typography>
                        <Typography variant="body2" align="center">
                            ---
                        </Typography>
                    </DataPaper>
                </DataRowContainer>
                <DataRowContainer mt={1} gap={1}>
                    <DataPaper elevation={0}>
                        <Typography variant="body2" align="center" color="text.secondary">
                            LIQUIDITY
                        </Typography>
                        <Typography variant="body2" align="center">
                            ---
                        </Typography>
                    </DataPaper>
                    <DataPaper elevation={0}>
                        <Typography variant="body2" align="center" color="text.secondary">
                            FDV
                        </Typography>
                        <Typography variant="body2" align="center">
                            ---
                        </Typography>
                    </DataPaper>
                    <DataPaper elevation={0}>
                        <Typography variant="body2" align="center" color="text.secondary">
                            MKT CAP
                        </Typography>
                        <Typography variant="body2" align="center">
                            ---
                        </Typography>
                    </DataPaper>
                </DataRowContainer>
            </Box>
            <SentimentsContainerBox mt={2}>
                {sentimentButtonsConfig.map((button) => (
                    <SentimentButton
                        variant="outlined"
                        key={button.key}
                        onClick={() => onSentimentButtonClick(button.key)}
                        disabled={selectedSentiment !== null}
                        className={button.key === selectedSentiment ? 'selected' : ''}
                    >
                        <button.icon />
                        <Typography variant="body2" align="center">
                            {getSentimentIconValueToDisplay(button.key)}
                        </Typography>
                    </SentimentButton>
                ))}
            </SentimentsContainerBox>
        </Box>
    );
};

export default TokenSideBarInfo;
