import { useState, useEffect, FC } from 'react';
import WalletModal from '../../components/modals/wallet-modal/WalletModal';
import { BlurOverlay } from './GridPage.s';
import { TokenResponse } from '../../types/Types';
import NotificationComponent from '../../components/notification/Notification';
import { GridLayout } from './GridPageLayout';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import TokenDataGrid from '../../components/krc-20-page/grid-krc-20/Krc20Grid';

import { fetchTokens, fetchTotalTokensDeployed } from '../../DAL/Krc20DAL';
import GridTitle from '../../components/krc-20-page/grid-title-sort/GridTitle';

interface GridPageProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    walletAddress: string | null;
    connectWallet?: () => void;
    walletBalance: number;
    isConnecting: boolean;
    showNotification: boolean;
    setShowNotification: (value: boolean) => void;
    setWalletAddress: (value: string | null) => void;
    setWalletBalance: (value: number) => void;
    handleNetworkChange: (network: string) => void;
    network: string;
}

const GridPage: FC<GridPageProps> = (props) => {
    const {
        darkMode,
        toggleDarkMode,
        walletAddress,
        connectWallet,
        walletBalance,
        isConnecting,
        showNotification,
        setShowNotification,
        setWalletAddress,
        setWalletBalance,
        handleNetworkChange,
        network,
    } = props;

    const [isBlurred, setIsBlurred] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [tokensList, setTokensList] = useState<TokenResponse[]>([]);
    const [nextPage, setNextPage] = useState<number>(1);
    const [nextPageParams, setNextPageParams] = useState<string>('');
    const [totalTokensDeployed, setTotalTokensDeployed] = useState(0);

    useEffect(() => {
        fetchTotalTokensDeployed().then((result) => {
            setTotalTokensDeployed(result);
        });
    }, []);

    useEffect(() => {
        const fetchTokensList = async () => {
            const tokensList = await fetchTokens(nextPageParams);
            setTokensList((prevTokensList) => [...prevTokensList, ...tokensList.result]);
            setNextPageParams(tokensList.next);
        };

        fetchTokensList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextPage]);

    return (
        <GridLayout>
            <Navbar
                walletAddress={walletAddress}
                connectWallet={connectWallet}
                tokensList={tokensList}
                network={network}
                onNetworkChange={handleNetworkChange}
            />
            <GridTitle />
            <TokenDataGrid
                nextPage={nextPage}
                totalTokensDeployed={totalTokensDeployed}
                tokensList={tokensList}
                setNextPage={setNextPage}
                nextPageParams={nextPageParams}
            />
            <Footer />

            {isBlurred && <BlurOverlay />}
            {showNotification && walletAddress && (
                <NotificationComponent
                    message={`Connected to wallet ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`}
                    onClose={() => setShowNotification(false)}
                />
            )}
            {isModalVisible && <WalletModal onClose={() => setIsModalVisible(false)} />}
        </GridLayout>
    );
};

export default GridPage;

// const openSlippageModal = () => {
//     setIsModalOpen(true);
//     setIsBlurred(true);
// };

// const closeSlippageModal = () => {
//     setIsModalOpen(false);
//     setIsBlurred(false);
// };

// const openTokenModal = (isPaying: boolean) => {
//     setIsPayingTokenModal(isPaying);
//     setIsTokenModalOpen(true);
//     setIsBlurred(true);
// };

// const closeTokenModal = () => {
//     setIsTokenModalOpen(false);
//     setIsBlurred(false);
// };

// const handleTokenSelect = (token: Token) => {
//     if (isPayingTokenModal) {
//         setPayingCurrency(token.symbol);
//         setPayingCurrencyImage(token.logo);
//     } else {
//         setReceivingCurrency(token.symbol);
//         setReceivingCurrencyImage(token.logo);
//     }
//     closeTokenModal();
// };

// const handleSlippageSave = (mode: string, value: string) => {
//     setSlippageMode(mode);
//     setSlippageValue(value);
// };
