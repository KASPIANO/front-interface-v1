import { useState, useEffect, FC } from 'react';
import WalletModal from '../../components/modals/wallet-modal/WalletModal';
import { BlurOverlay } from './TokenPage.s';
import { TokenResponse } from '../../types/Types';
import NotificationComponent from '../../components/notification/Notification';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import TokenDataGrid from '../../components/krc-20-page/grid-krc-20/Krc20Grid';

import { fetchTokenInfo, fetchTokens, fetchTotalTokensDeployed } from '../../DAL/Krc20DAL';
import GridTitle from '../../components/krc-20-page/grid-title-sort/GridTitle';
import { TokenPageLayout } from './TokenPageLAyout';
import { useParams } from 'react-router-dom';
import TokenHeader from '../../components/token-page/token-header/TokenHeader';

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

    const { ticker } = useParams<{ ticker: string }>();
    const [tokenInfo, setTokenInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTokenInfo(ticker);
                setTokenInfo(data);
            } catch (error) {
                console.error('Error fetching token info:', error);
            }
        };

        if (ticker) {
            fetchData();
        }
    }, [ticker]);

    return (
        <TokenPageLayout>
            <Navbar
                walletAddress={walletAddress}
                connectWallet={connectWallet}
                network={network}
                onNetworkChange={handleNetworkChange}
            />
            <TokenHeader tokenInfo={tokenInfo} />
            <TokenGraph />
            <TokenDataGrid
                nextPage={nextPage}
                totalTokensDeployed={totalTokensDeployed}
                tokensList={tokensList}
                setNextPage={setNextPage}
                nextPageParams={nextPageParams}
            />
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
