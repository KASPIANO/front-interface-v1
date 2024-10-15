import { FC, useEffect, useState } from 'react';
import { BackendTokenResponse, TokenSentiment } from '../../../../types/Types';
import { Box, Tooltip, Typography } from '@mui/material';
import {
    SentimentButton,
    SentimentsContainerBox,
    TokenProfileContainer,
    StatCard,
    SentimentLoader,
} from './TokenSideBarInfo.s';
import { RocketLaunchRounded, SentimentNeutralRounded, TrendingDownRounded } from '@mui/icons-material';
import TokenSidebarSocialsBar, {
    TokenSidebarSocialsBarOptions,
} from './token-sidebar-socials-bar/TokenSidebarSocialsBar';
import { Stack } from '@chakra-ui/react';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { AddBanner, AddBox, AddText } from './token-sidebar-socials-bar/TokenSidebarSocialsBar.s';
import { formatNumberWithCommas, simplifyNumber } from '../../../../utils/Utils';
import { updateWalletSentiment } from '../../../../DAL/BackendDAL';
import { UpdateMetadataDialog } from '../../update-metadata-dialog/UpdateMetadataDialog';
import { fetchBurntRC20Balance } from '../../../../DAL/Krc20DAL';
import { useFetchFloorPrice } from '../../../../DAL/UseQueriesBackend';

export type SentimentButtonsConfig = {
    key: keyof TokenSentiment;
    icon: any;
};

interface TokenSideBarInfoProps {
    tokenInfo: BackendTokenResponse;
    setTokenInfo: (tokenInfo: any) => void;
    priceInfo?: any;
    walletAddress: string | null;
    walletConnected: boolean;
    walletBalance: number;
    kasPrice: number;
}

// const mockBanner =
//     'https://149995303.v2.pressablecdn.com/wp-content/uploads/2023/06/Kaspa-LDSP-Dark-Full-Color.png';

const TokenSideBarInfo: FC<TokenSideBarInfoProps> = (props) => {
    const { tokenInfo, setTokenInfo, walletAddress, walletConnected, walletBalance, kasPrice } = props;
    const [showTokenInfoDialog, setShowTokenInfoDialog] = useState(false);
    const [showSentimentLoader, setShowSentimentLoader] = useState(false);
    const [selectedSentiment, setSelectedSentiment] = useState<string>(null);
    const [sentimentValues, setSentimentValues] = useState<TokenSentiment | null>(null);
    const [socials, setSocials] = useState<TokenSidebarSocialsBarOptions>(null);
    const [totalSupplyAfterBurn, setTotalSupplyAfterBurn] = useState<number>(0);

    const sentimentButtonsConfig: SentimentButtonsConfig[] = [
        { key: 'love', icon: <FavoriteBorderRoundedIcon sx={{ fontSize: '1.1rem' }} color="success" /> },
        { key: 'positive', icon: <RocketLaunchRounded sx={{ fontSize: '1.1rem' }} color="primary" /> },
        { key: 'neutral', icon: <SentimentNeutralRounded sx={{ fontSize: '1.1rem' }} color="info" /> },
        { key: 'negative', icon: <TrendingDownRounded sx={{ fontSize: '1.1rem' }} color="error" /> },
        { key: 'warning', icon: <WarningAmberRoundedIcon sx={{ fontSize: '1.1rem' }} color="warning" /> },
    ];
    const { data: floorPrice } = useFetchFloorPrice(tokenInfo.ticker);
    useEffect(() => {
        const fetchAndSetSupplyAfterBurn = async () => {
            const { totalSupply, ticker } = tokenInfo;
            const burntWalletBalance = await fetchBurntRC20Balance(ticker); // Fetch burnt balance
            const newSupplyAfterBurn = burntWalletBalance ? totalSupply - burntWalletBalance : totalSupply;
            setTotalSupplyAfterBurn(newSupplyAfterBurn);
        };

        if (tokenInfo && tokenInfo.totalSupply && tokenInfo.ticker) {
            fetchAndSetSupplyAfterBurn();
        }
    }, [tokenInfo]);

    useEffect(() => {
        setSocials((prevSocials) => {
            if (tokenInfo?.metadata?.socials) {
                return {
                    telegram: tokenInfo?.metadata?.socials?.telegram || '',
                    website: tokenInfo?.metadata?.socials?.website || '',
                    x: tokenInfo?.metadata?.socials?.x || '',
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

        setSelectedSentiment(tokenInfo.metadata?.selectedSentiment);
    }, [tokenInfo]);

    const getSentimentIconValueToDisplay = (key: string): string =>
        sentimentValues ? sentimentValues[key] || '0' : '---';

    const onSentimentButtonClick = async (key: keyof TokenSentiment) => {
        if (!walletConnected) {
            return;
        }

        setShowSentimentLoader(true);

        try {
            const sentimentToSet = tokenInfo.metadata?.selectedSentiment === key ? null : key;
            const result = await updateWalletSentiment(tokenInfo.ticker, walletAddress, sentimentToSet);

            setTokenInfo({
                ...tokenInfo,
                metadata: {
                    ...tokenInfo.metadata,
                    ...result,
                },
            });
        } catch (error) {
            console.error('Error updating sentiment:', error);
        } finally {
            // For smother change
            await new Promise((resolve) => setTimeout(resolve, 0));
            setShowSentimentLoader(false);
        }
    };

    const handleShowTokenInfoDialog = () => {
        setShowTokenInfoDialog(true);
    };

    const preMintedSupplyPercentage = (tokenInfo.preMintedSupply / tokenInfo.totalSupply) * 100;
    const tokenPrice = floorPrice?.floor_price
        ? `${floorPrice.floor_price.toFixed(7)} KAS`
        : `${tokenInfo.price.toFixed(7)} KAS`;
    const tokenPriceDollars = floorPrice?.floor_price
        ? (floorPrice.floor_price * kasPrice).toFixed(7)
        : (tokenInfo.price * kasPrice).toFixed(7);

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
                {tokenInfo?.metadata?.bannerUrl || tokenInfo?.metadata?.socials?.x ? (
                    tokenInfo.metadata?.bannerUrl ? (
                        <Box
                            component="img"
                            alt={tokenInfo.ticker}
                            src={tokenInfo.metadata?.bannerUrl}
                            sx={{
                                height: '9rem',
                                width: '100%',
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                height: '19vh',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="body1" color="textSecondary">
                                No banner
                            </Typography>
                        </Box>
                    )
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
                            {tokenPriceDollars ? `$${tokenPriceDollars}` : '---'}
                        </Typography>
                    </StatCard>
                    <StatCard>
                        <Tooltip title={'Kaspiano FP'}>
                            <span>
                                <Typography variant="body2" align="center" color="text.secondary">
                                    PRICE
                                </Typography>
                                <Typography variant="body2" align="center">
                                    {tokenPrice}
                                </Typography>
                            </span>
                        </Tooltip>
                    </StatCard>
                </Stack>
                <Stack marginTop={8} direction={'row'} justify={'center'}>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            SUPPLY
                        </Typography>
                        <Tooltip title={formatNumberWithCommas(totalSupplyAfterBurn)}>
                            <Typography variant="body2" align="center">
                                {simplifyNumber(totalSupplyAfterBurn)}
                            </Typography>
                        </Tooltip>
                    </StatCard>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            PREMINTED
                        </Typography>
                        <Typography variant="body2" align="center">
                            {preMintedSupplyPercentage.toFixed(2)}%
                        </Typography>
                    </StatCard>
                    <StatCard>
                        <Typography variant="body2" align="center" color="text.secondary">
                            MKT CAP
                        </Typography>
                        <Tooltip title={formatNumberWithCommas(tokenInfo.marketCap)}>
                            <Typography variant="body2" align="center">
                                {tokenInfo.marketCap ? simplifyNumber(tokenInfo.marketCap) : '---'}
                            </Typography>
                        </Tooltip>
                    </StatCard>
                </Stack>
            </Box>
            <Box padding={'10px'} sx={{ paddingTop: '5px' }}>
                {tokenInfo?.metadata?.description || tokenInfo?.metadata?.socials?.x ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="body2" fontWeight={500}>
                            Description:
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem' }} color="text.secondary">
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
                <Typography variant="body2" align="center" sx={{ fontSize: '0.85rem' }} color="text.primary">
                    Community Sentiments
                </Typography>
                <SentimentsContainerBox>
                    {showSentimentLoader ? (
                        <SentimentLoader />
                    ) : (
                        sentimentButtonsConfig.map((button) => (
                            <Tooltip
                                key={`${button.key}tooltip`}
                                title={walletConnected ? '' : 'Please connect your wallet to choose a sentiment'}
                            >
                                <SentimentButton
                                    variant="outlined"
                                    key={button.key}
                                    onClick={() => onSentimentButtonClick(button.key)}
                                    className={button.key === selectedSentiment ? ' selected' : ''}
                                >
                                    {button.icon}
                                    <Typography
                                        sx={{ fontSize: '0.8rem' }}
                                        variant="body2"
                                        align="center"
                                        color="text.secondary"
                                    >
                                        {getSentimentIconValueToDisplay(button.key)}
                                    </Typography>
                                </SentimentButton>
                            </Tooltip>
                        ))
                    )}
                </SentimentsContainerBox>
            </Box>

            <UpdateMetadataDialog
                open={showTokenInfoDialog}
                onClose={() => setShowTokenInfoDialog(false)}
                walletConnected={walletConnected}
                setTokenInfo={setTokenInfo}
                walletBalance={walletBalance}
                walletAddress={walletAddress}
                ticker={tokenInfo.ticker}
            />
        </Box>
    );
};

export default TokenSideBarInfo;
