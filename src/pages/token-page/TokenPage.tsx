import { Skeleton } from '@mui/material';
import { FC, useEffect, useState } from 'react';
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
import { fetchTokenByTicker } from '../../DAL/BackendDAL';

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
    const { walletConnected, walletBalance } = props;
    const { ticker } = useParams();
    const { backgroundBlur, setWalletBalance } = props;
    const [tokenInfo, setTokenInfo] = useState<BackendTokenResponse>(null);
    const [tokenXHandle, setTokenXHandle] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTokenByTicker(ticker, props.walletAddress);
                setTokenInfo(data);
            } catch (error) {
                console.error('Error fetching token info:', error);
            }
        };

        fetchData();
    }, [ticker, props.walletAddress]);

    useEffect(() => {
        if (tokenInfo) {
            setTokenXHandle(!!tokenInfo.metadata.socials?.x);
        }
    }, [tokenInfo]);

    const getComponentToShow = (component: JSX.Element, height?: string, width?: string) =>
        tokenInfo ? component : <Skeleton variant="rectangular" height={height} width={width} />;

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
                    walletAddress={props.walletAddress}
                    setTokenInfo={setTokenInfo}
                />,
            )}
            {getComponentToShow(
                <RugScore
                    score={tokenInfo?.metadata?.rugScore}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onRecalculate={() => {}}
                    xHandle={tokenXHandle}
                    setWalletBalance={setWalletBalance}
                />,
                '19vh',
            )}
            {getComponentToShow(<TopHolders tokenInfo={tokenInfo} />, '19vh')}
            {/* {getComponentToShow(<TokenHolders tokenInfo={tokenInfo} />)} */}
            {getComponentToShow(
                <TokenSideBar
                    tokenInfo={tokenInfo}
                    setTokenInfo={setTokenInfo}
                    walletConnected={props.walletConnected}
                    walletAddress={props.walletAddress}
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
