import { FC, useEffect, useState } from 'react';
import { BackendTokenMetadata, BackendTokenResponse, TokenSentiment } from '../../../../types/Types';
import { Box, Tooltip, Typography } from '@mui/material';
import { SentimentButton, SentimentsContainerBox, TokenProfileContainer, StatCard } from './TokenSideBarInfo.s';
import { RocketLaunchRounded, SentimentNeutralRounded, TrendingDownRounded } from '@mui/icons-material';
import TokenSidebarSocialsBar, {
    TokenSidebarSocialsBarOptions,
} from './token-sidebar-socials-bar/TokenSidebarSocialsBar';
import { Stack } from '@chakra-ui/react';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import TokenInfoDialog from '../../../dialogs/token-info/TokenInfoDialog';
import { AddBanner, AddBox, AddText } from './token-sidebar-socials-bar/TokenSidebarSocialsBar.s';
import SuccessModal from '../../../modals/sent-token-info-success/SuccessModal';
import { formatNumberWithCommas, simplifyNumber } from '../../../../utils/Utils';

export type SentimentButtonsConfig = {
    key: string;
    icon: any;
};

interface TokenSideBarInfoProps {
    tokenInfo: BackendTokenResponse;
    setTokenInfo: (tokenInfo: any) => void;
    priceInfo?: any;
}

// const mockBanner =
//     'https://149995303.v2.pressablecdn.com/wp-content/uploads/2023/06/Kaspa-LDSP-Dark-Full-Color.png';

const TokenSideBarInfo: FC<TokenSideBarInfoProps> = (props) => {
    const { tokenInfo, setTokenInfo, priceInfo } = props;
    const [showTokenInfoDialog, setShowTokenInfoDialog] = useState(false);
    const [selectedSentiment, setSelectedSentiment] = useState<string>(null);
    const [sentimentValues, setSentimentValues] = useState<TokenSentiment | null>(null);
    const [socials, setSocials] = useState<TokenSidebarSocialsBarOptions>(null);
    const [openModal, setOpenModal] = useState(false);

    const sentimentButtonsConfig: SentimentButtonsConfig[] = [
        { key: 'love', icon: <FavoriteBorderRoundedIcon sx={{ fontSize: '1.4vw' }} color="success" /> },
        { key: 'positive', icon: <RocketLaunchRounded sx={{ fontSize: '1.4vw' }} color="primary" /> },
        { key: 'neutral', icon: <SentimentNeutralRounded sx={{ fontSize: '1.4vw' }} color="info" /> },
        { key: 'negative', icon: <TrendingDownRounded sx={{ fontSize: '1.4vw' }} color="error" /> },
        { key: 'warning', icon: <WarningAmberRoundedIcon sx={{ fontSize: '1.4vw' }} color="warning" /> },
    ];
    useEffect(() => {
        setSocials((prevSocials) => {
            if (tokenInfo.metadata?.socials) {
                return {
                    telegram: tokenInfo.metadata.socials.telegram || '',
                    website: tokenInfo.metadata.socials.website || '',
                    x: tokenInfo.metadata.socials.x || '',
                };
            }
            return prevSocials;
        });

        setSentimentValues(
            tokenInfo.metadata?.sentiment || {
                love: 0,
                positive: 0,
                neutral: 0,
                negative: 0,
                warning: 0,
            },
        );
    }, [tokenInfo]);
    const getSentimentIconValueToDisplay = (key: string): string =>
        sentimentValues ? sentimentValues[key] || '0' : '---';

    const onSentimentButtonClick = (key: string) => {
        setSelectedSentiment(key);
        setSentimentValues({ ...sentimentValues, [key]: sentimentValues[key] + 1 });

        // TODO: Implement sentiment button click on backend
    };

    const handleShowTokenInfoDialog = () => {
        setShowTokenInfoDialog(true);
    };

    const handleSaveTokenInfo = (newTokenInfo: Partial<BackendTokenMetadata>) => {
        // Here you would typically update the token info in your backend
        console.log('New token info:', newTokenInfo);

        // Merge the new token info with the existing token info
        setTokenInfo((prevInfo: BackendTokenResponse) => {
            const updatedInfo: BackendTokenResponse = {
                ...prevInfo,
                metadata: {
                    ...prevInfo.metadata,
                    ...newTokenInfo,
                },
            };

            return updatedInfo;
        });
        setOpenModal(true);
    };

    return (
        <Box
            sx={{
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
            }}
        >
            <TokenProfileContainer>
                {tokenInfo.metadata?.bannerUrl ? (
                    <Box
                        component="img"
                        alt={props.tokenInfo.ticker}
                        src={tokenInfo.metadata?.bannerUrl}
                        sx={{
                            height: '19vh',
                            width: '100%',
                        }}
                    />
                ) : (
                    <AddBanner
                        onClick={handleShowTokenInfoDialog}
                        sx={{
                            height: '19vh',
                            width: '100%',
                            backgroundColor: 'grey',
                        }}
                    >
                        <AddText>+ List Token</AddText>
                    </AddBanner>
                )}
                {socials !== null && Object.keys(socials).length > 0 && (
                    <Box sx={{ position: 'absolute', bottom: -9, left: '52.3%', transform: 'translateX(-50%)' }}>
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
                            {priceInfo ? `$${priceInfo.priceUsd}` : '$0.0003'}
                        </Typography>
                    </StatCard>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            PRICE
                        </Typography>
                        <Typography variant="body2" align="center">
                            {priceInfo ? `${priceInfo.price}KAS` : '0.006KAS'}
                        </Typography>
                    </StatCard>
                </Stack>
                <Stack marginTop={8} direction={'row'} justify={'center'}>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            SUPPLY
                        </Typography>
                        <Tooltip title={formatNumberWithCommas(tokenInfo.totalSupply)}>
                            <Typography variant="body2" align="center">
                                {simplifyNumber(tokenInfo.totalSupply)}
                            </Typography>
                        </Tooltip>
                    </StatCard>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            LIQUIDITY
                        </Typography>
                        <Typography variant="body2" align="center">
                            {priceInfo ? priceInfo.liquidity : '90K'}
                        </Typography>
                    </StatCard>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            MKT CAP
                        </Typography>
                        <Typography variant="body2" align="center">
                            {priceInfo ? tokenInfo.totalSupply * priceInfo.liquidity : '---'}
                        </Typography>
                    </StatCard>
                </Stack>
            </Box>
            <Box padding={'10px'}>
                {tokenInfo.metadata?.description ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="body2" fontWeight={500}>
                            Description:
                        </Typography>
                        <Typography sx={{ fontSize: '1vw' }} color="text.secondary">
                            {tokenInfo.metadata?.description}
                        </Typography>
                    </Box>
                ) : (
                    <AddBox onClick={handleShowTokenInfoDialog}>
                        <AddText>+ List Token</AddText>
                    </AddBox>
                )}
            </Box>
            <Box sx={{ mt: 'auto' }}>
                <Typography variant="body2" align="center" sx={{ fontSize: '1.1vw' }} color="text.primary">
                    Community Sentiments
                </Typography>
                <SentimentsContainerBox>
                    {sentimentButtonsConfig.map((button) => (
                        <SentimentButton
                            sx={{
                                '&.MuiButton-root': {
                                    padding: '10px',
                                    minWidth: '2vw',
                                    border: 'transparent',
                                },
                            }}
                            variant="outlined"
                            key={button.key}
                            onClick={() => onSentimentButtonClick(button.key)}
                            disabled={selectedSentiment !== null}
                            className={button.key === selectedSentiment ? 'selected' : ''}
                        >
                            {button.icon}
                            <Typography
                                sx={{ fontSize: '1vw' }}
                                variant="body2"
                                align="center"
                                color="text.secondary"
                            >
                                {getSentimentIconValueToDisplay(button.key)}
                            </Typography>
                        </SentimentButton>
                    ))}
                </SentimentsContainerBox>
            </Box>

            <TokenInfoDialog
                open={showTokenInfoDialog}
                onClose={() => setShowTokenInfoDialog(false)}
                onSave={handleSaveTokenInfo}
            />
            <SuccessModal open={openModal} onClose={() => setOpenModal(false)} />
        </Box>
    );
};

export default TokenSideBarInfo;
