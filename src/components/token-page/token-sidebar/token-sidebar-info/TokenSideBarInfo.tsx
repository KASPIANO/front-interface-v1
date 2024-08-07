import { FC, useEffect, useState } from 'react';
import { Token } from '../../../../types/Types';
import { Box, Typography } from '@mui/material';
import { SentimentButton, SentimentsContainerBox, TokenProfileContainer, StatCard } from './TokenSideBarInfo.s';
import {
    RocketLaunchRounded,
    SentimentNeutralRounded,
    SvgIconComponent,
    TrendingDownRounded,
} from '@mui/icons-material';
import TokenSidebarSocialsBar, {
    TokenSidebarSocialsBarOptions,
} from './token-sidebar-socials-bar/TokenSidebarSocialsBar';
import { Stack } from '@chakra-ui/react';
import { simplifyNumber } from '../../../../utils/Utils';

export type SentimentButtonsConfig = {
    key: string;
    icon: SvgIconComponent;
};

interface TokenSideBarInfoProps {
    tokenInfo: Token;
    priceInfo: any;
}

const TokenSideBarInfo: FC<TokenSideBarInfoProps> = (props) => {
    const { tokenInfo } = props;
    const sentimentButtonsConfig: SentimentButtonsConfig[] = [
        { key: 'positive', icon: RocketLaunchRounded },
        { key: 'negative', icon: TrendingDownRounded },
        { key: 'neutral', icon: SentimentNeutralRounded },
    ];

    const [selectedSentiment, setSelectedSentiment] = useState<string>(null);
    const [sentimentValues, setSentimentValues] = useState({});
    const [socials, setSocials] = useState<TokenSidebarSocialsBarOptions>(null);

    useEffect(() => {
        setSocials({
            Telegram: 'https://t.me/kaspa',
            Website: 'https://kaspa.com',
            Twitter: 'https://twitter.com/kaspa',
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

    return (
        <Box>
            <TokenProfileContainer>
                <Box
                    component="img"
                    alt={props.tokenInfo.tick}
                    src={
                        'https://149995303.v2.pressablecdn.com/wp-content/uploads/2023/06/Kaspa-LDSP-Dark-Full-Color.png'
                    }
                    sx={{
                        height: '17vh',
                        width: '100%',
                    }}
                />
                {socials !== null && Object.keys(socials).length > 0 && (
                    <Box sx={{ position: 'absolute', bottom: -4, left: '52.3%', transform: 'translateX(-50%)' }}>
                        <TokenSidebarSocialsBar options={socials} />
                    </Box>
                )}
            </TokenProfileContainer>
            <Box padding={'10px'}>
                <Stack direction={'row'} justify={'center'}>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            PRICE USD
                        </Typography>
                        <Typography variant="body2" align="center">
                            ---
                        </Typography>
                    </StatCard>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            PRICE
                        </Typography>
                        <Typography variant="body2" align="center">
                            ---
                        </Typography>
                    </StatCard>
                </Stack>
                <Stack marginTop={8} direction={'row'} justify={'center'}>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            SUPPLY
                        </Typography>
                        <Typography variant="body2" align="center">
                            {simplifyNumber(tokenInfo.max)}
                        </Typography>
                    </StatCard>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            LIQUIDITY
                        </Typography>
                        <Typography variant="body2" align="center">
                            ---
                        </Typography>
                    </StatCard>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            MKT CAP
                        </Typography>
                        <Typography variant="body2" align="center">
                            ---
                        </Typography>
                    </StatCard>
                </Stack>
            </Box>
            <SentimentsContainerBox>
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
