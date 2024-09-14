import { Skeleton } from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TokenHeader from '../../components/token-page/token-header/TokenHeader';
import TokenSideBar from '../../components/token-page/token-sidebar/TokenSideBar';
import TokenStats from '../../components/token-page/token-stats/TokenStats';
import TopHolders from '../../components/token-page/top-holders/TopHolders';
import { BackendTokenResponse } from '../../types/Types';
import { TokenPageLayout } from './TokenPageLayout';
import TokenGraph from '../../components/token-page/token-graph/TokenGraph';
import RugScore from '../../components/token-page/rug-score/RugScore';
import MintingComponent from '../../components/token-page/minting-status/MintingStatus';
import { fetchTokenByTicker, recalculateRugScore } from '../../DAL/BackendDAL';
import { AxiosError } from 'axios';
import { showGlobalSnackbar } from '../../components/alert-context/AlertContext';

interface TokenPageProps {
    walletAddress: string | null;
    connectWallet?: () => void;
    handleNetworkChange: (network: string) => void;
    network: string;
    backgroundBlur: boolean;
    setWalletBalance: (balance: number) => void;
    walletBalance: number;
    walletConnected: boolean;
}

const TokenPage: FC<TokenPageProps> = (props) => {
    const { walletConnected, walletBalance, walletAddress, setWalletBalance, backgroundBlur } = props;
    const { ticker } = useParams();
    const [tokenInfo, setTokenInfo] = useState<BackendTokenResponse>(null);
    const [tokenXHandle, setTokenXHandle] = useState(false);
    const [recalculateRugScoreLoading, setRecalculateRugScoreLoading] = useState(false);

    const fetchAndUpdateTokenInfo = useCallback(
        async (refresh: boolean) => {
            try {
                const updatedTokenData = await fetchTokenByTicker(ticker, walletAddress, refresh);
                setTokenInfo(updatedTokenData);
            } catch (error) {
                console.error('Error fetching token info:', error);
            }
        },
        [ticker, walletAddress],
    );

    useEffect(() => {
        fetchAndUpdateTokenInfo(false);
    }, [fetchAndUpdateTokenInfo, ticker]);

    useEffect(() => {
        if (tokenInfo) {
            setTokenXHandle(!!tokenInfo.metadata.socials?.x);
        }
    }, [tokenInfo]);

    useEffect(() => {
        // Fetch the token info immediately on component mount

        // Set up the interval to update token info every 15 seconds
        const interval = setInterval(fetchAndUpdateTokenInfo, 15000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, [fetchAndUpdateTokenInfo]);

    const getComponentToShow = (component: JSX.Element, height?: string, width?: string) =>
        tokenInfo ? component : <Skeleton variant="rectangular" height={height} width={width} />;
    const rugScoreParse = tokenInfo?.metadata?.rugScore === 0 ? null : tokenInfo?.metadata?.rugScore;

    const recalculateRugScoreAndShow = async () => {
        setRecalculateRugScoreLoading(true);

        try {
            const result = await recalculateRugScore(tokenInfo.ticker);

            if (result) {
                setTokenInfo({ ...tokenInfo, metadata: { ...tokenInfo.metadata, rugScore: result } });
            }
        } catch (error) {
            console.error('Error recalculating rug score:', error);

            if (error instanceof AxiosError && error.response?.status === 400) {
                showGlobalSnackbar({
                    message: 'Please wait 3 hours before recalculation of the rug score',
                    severity: 'error',
                });
            } else {
                showGlobalSnackbar({
                    message: 'Error recalculating rug score, Please try again later',
                    severity: 'error',
                });
            }
        } finally {
            setRecalculateRugScoreLoading(false);
        }
    };
    return (
        <TokenPageLayout backgroundBlur={backgroundBlur}>
            {getComponentToShow(<TokenHeader tokenInfo={tokenInfo} />, '11.5vh')}
            {getComponentToShow(<TokenGraph />, '35vh')}
            {getComponentToShow(<TokenStats tokenInfo={tokenInfo} />)}
            {getComponentToShow(
                <MintingComponent
                    tokenInfo={tokenInfo}
                    walletBalance={walletBalance}
                    walletConnected={walletConnected}
                    walletAddress={walletAddress}
                    setTokenInfo={setTokenInfo}
                    setWalletBalance={setWalletBalance}
                />,
            )}
            {getComponentToShow(
                <RugScore
                    walletConnected={walletConnected}
                    ticker={ticker}
                    walletBalance={walletBalance}
                    score={rugScoreParse}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onRecalculate={recalculateRugScoreAndShow}
                    xHandle={tokenXHandle}
                    setWalletBalance={setWalletBalance}
                    walletAddress={walletAddress}
                    setTokenInfo={setTokenInfo}
                    isLoadingRugScore={recalculateRugScoreLoading}
                />,
                '19vh',
            )}
            {getComponentToShow(<TopHolders tokenInfo={tokenInfo} />, '19vh')}
            {/* {getComponentToShow(<TokenHolders tokenInfo={tokenInfo} />)} */}
            {getComponentToShow(
                <TokenSideBar
                    tokenInfo={tokenInfo}
                    setTokenInfo={setTokenInfo}
                    walletConnected={walletConnected}
                    walletAddress={walletAddress}
                    walletBalance={walletBalance}
                    setWalletBalance={setWalletBalance}
                />,
                '91vh',
            )}

            {/* {showNotification && walletAddress && (
                <NotificationComponent
                    message={`Connected to wallet ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`}
                    onClose={() => setShowNotification(false)}
                />
            )} */}
            {/* {isModalVisible && <WalletModal onClose={() => setIsModalVisible(false)} />} */}
        </TokenPageLayout>
    );
};

export default TokenPage;
