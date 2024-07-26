import { Skeleton } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotificationComponent from '../../components/notification/Notification';
import TokenGraph from '../../components/token-page/token-header/token-graph/TokenGraph';
import TokenHeader from '../../components/token-page/token-header/TokenHeader';
import { fetchTokenInfo } from '../../DAL/Krc20DAL';
import { Token } from '../../types/Types';
import { TokenPageLayout } from './TokenPageLayout';

interface TokenPageProps {
    walletAddress: string | null;
    connectWallet?: () => void;
    showNotification: boolean;
    setShowNotification: (value: boolean) => void;
    handleNetworkChange: (network: string) => void;
    network: string;
}

const TokenPage: FC<TokenPageProps> = (props) => {
    const { walletAddress, showNotification, setShowNotification } = props;

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

    const getComponentToShow = (component: JSX.Element, size: string, width?: string) =>
        tokenInfo ? component : <Skeleton height={size} width={width} />;

    return (
        <TokenPageLayout>
            {getComponentToShow(<TokenHeader tokenInfo={tokenInfo} />, '10vh')}
            {getComponentToShow(<TokenGraph />, '30vh')}

            {showNotification && walletAddress && (
                <NotificationComponent
                    message={`Connected to wallet ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`}
                    onClose={() => setShowNotification(false)}
                />
            )}
            {/* {isModalVisible && <WalletModal onClose={() => setIsModalVisible(false)} />} */}
        </TokenPageLayout>
    );
};

export default TokenPage;
