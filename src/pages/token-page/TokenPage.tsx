import { useState, useEffect, FC } from 'react';
import NotificationComponent from '../../components/notification/Notification';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { fetchTokenInfo } from '../../DAL/Krc20DAL';
import { TokenPageLayout } from './TokenPageLayout';
import { useParams } from 'react-router-dom';
import TokenHeader from '../../components/token-page/token-header/TokenHeader';
import TokenGraph from '../../components/token-page/token-header/token-graph/TokenGraph';
import { Token } from '../../types/Types';
import { Skeleton } from '@mui/material';

interface TokenPageProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    walletAddress: string | null;
    connectWallet?: () => void;
    showNotification: boolean;
    setShowNotification: (value: boolean) => void;
    handleNetworkChange: (network: string) => void;
    network: string;
}

const TokenPage: FC<TokenPageProps> = (props) => {
    const {
        darkMode,
        toggleDarkMode,
        walletAddress,
        connectWallet,
        showNotification,
        setShowNotification,
        handleNetworkChange,
        network,
    } = props;

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
            <Navbar
                walletAddress={walletAddress}
                connectWallet={connectWallet}
                network={network}
                onNetworkChange={handleNetworkChange}
            />
            {getComponentToShow(<TokenHeader tokenInfo={tokenInfo} />, '10vh')}
            {getComponentToShow(<TokenGraph />, '30vh')}

            <Footer />

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
