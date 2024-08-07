import { Skeleton } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RugScore from '../../components/token-page/rug-score/RugScore';
import { TokenGraph } from '../../components/token-page/token-graph/TokenGraph';
import TokenHeader from '../../components/token-page/token-header/TokenHeader';
import TokenSideBar from '../../components/token-page/token-sidebar/TokenSideBar';
import TokenStats from '../../components/token-page/token-stats/TokenStats';
import TopHolders from '../../components/token-page/top-holders/TopHolders';
import { fetchTokenInfo } from '../../DAL/Krc20DAL';
import { Token } from '../../types/Types';
import { TokenPageLayout } from './TokenPageLayout';

interface TokenPageProps {
    walletAddress: string | null;
    connectWallet?: () => void;
    handleNetworkChange: (network: string) => void;
    network: string;
}

const TokenPage: FC<TokenPageProps> = () => {
    const { ticker } = useParams();

    const [tokenInfo, setTokenInfo] = useState<Token>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTokenInfo(ticker);
                setTokenInfo(data[0]);
            } catch (error) {
                console.error('Error fetching token info:', error);
            }
        };

        fetchData();
    }, [ticker]);

    const getComponentToShow = (component: JSX.Element, height?: string, width?: string) =>
        tokenInfo ? component : <Skeleton variant="rectangular" height={height} width={width} />;

    return (
        <TokenPageLayout>
            {getComponentToShow(<TokenHeader tokenInfo={tokenInfo} />, '11.5vh')}
            {getComponentToShow(<TokenGraph />, '30vh')}
            {getComponentToShow(<TokenStats />)}
            {getComponentToShow(<RugScore score={66} />, '19vh')}
            {getComponentToShow(<TopHolders tokenInfo={tokenInfo} />, '19vh')}
            {/* {getComponentToShow(<TokenHolders tokenInfo={tokenInfo} />)} */}
            {getComponentToShow(<TokenSideBar tokenInfo={tokenInfo} />, '91vh')}

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
