import { useState, useEffect, FC } from 'react';
import WalletModal from '../../components/modals/wallet-modal/WalletModal';
import { Heading, BlurOverlay, MainContent } from './GridPage.s';
import { TokenResponse } from '../../types/Types';
import NotificationComponent from '../../components/notification/Notification';
import { fetchWalletBalance } from '../../DAL/KaspaApiDal';
import { setWalletBalanceUtil } from '../../utils/Utils';
import { GridLayout } from './GridPageLayout';
import Navbar from '../../components/navbar/Navbar';
import MiniNavbar from '../../components/mini-navbar/MiniNavbar';
import Footer from '../../components/footer/Footer';
import BackgroundEffect from '../../components/background-effect/BackgroundEffect';
import TokenDataGrid from '../../components/krc-20-page/grid-krc-20/Krc20Grid';
import {
    isKasWareInstalled,
    onAccountsChanged,
    removeAccountsChangedListener,
    requestAccounts,
    switchNetwork,
} from '../../utils/KaswareUtils';
import { fetchTokens } from '../../DAL/Krc20DAL';

interface GridPageProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    walletAddress: string | null;
    connectWallet: () => void;
    walletBalance: number;
    isConnecting: boolean;
    showNotification: boolean;
    setShowNotification: (value: boolean) => void;
    setWalletAddress: (value: string | null) => void;
    setWalletBalance: (value: number) => void;
}

// const tokens = [
//     { name: 'Kaspa', symbol: 'KAS', logoURI: '/kaspa.svg' },
//     { name: 'TokenA', symbol: 'TKA', logoURI: '/tokenA.svg' },
// ];

interface GridPageProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    walletAddress: string | null;
    connectWallet: () => void;
    walletBalance: number;
    isConnecting: boolean;
    showNotification: boolean;
    setShowNotification: (value: boolean) => void;
    setWalletAddress: (value: string | null) => void;
    setWalletBalance: (value: number) => void;
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
    } = props;

    const [network, setNetwork] = useState<string>('mainnet'); // New state for network

    const [isBlurred, setIsBlurred] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [tokens, setTokens] = useState<TokenResponse[]>([]);

    useEffect(() => {
        const fetchTokensList = async () => {
            const tokensList = await fetchTokens();
            setTokens(tokensList);
        };

        fetchTokensList();
    }, []);

    useEffect(() => {
        const handleAccountsChanged = async (accounts: string[]) => {
            if (accounts.length === 0) {
                setWalletAddress(null);
                setWalletBalance(0);
                localStorage.removeItem('isWalletConnected');
            } else {
                setWalletAddress(accounts[0]);
                const balance = await fetchWalletBalance(accounts[0]);
                setWalletBalance(setWalletBalanceUtil(balance));
            }
        };

        const handleDisconnect = () => {
            setWalletAddress(null);
            setWalletBalance(0);
            localStorage.removeItem('isWalletConnected');
        };

        const checkWalletConnection = async () => {
            const isWalletConnected = localStorage.getItem('isWalletConnected');
            if (isWalletConnected === 'true' && isKasWareInstalled()) {
                const accounts = await requestAccounts();
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    const balance = await fetchWalletBalance(accounts[0]);
                    setWalletBalance(setWalletBalanceUtil(balance));
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 5000);
                }
            }
        };

        if (isKasWareInstalled()) {
            onAccountsChanged(handleAccountsChanged);
            window.kasware.on('disconnect', handleDisconnect);
        }

        checkWalletConnection();

        return () => {
            if (isKasWareInstalled()) {
                removeAccountsChangedListener(handleAccountsChanged);
                window.kasware.removeListener('disconnect', handleDisconnect);
            }
        };
    }, [walletAddress, setShowNotification]);

    // useEffect(() => {
    //     const formatBalance = (balance: number) => (isNaN(balance) ? '0.00' : balance.toFixed(4));

    //     if (walletAddress) {
    //         fetchReceivingBalance(walletAddress, receivingCurrency).then((balanceInToken) => {
    //             setReceivingBalance(parseFloat(formatBalance(balanceInToken)));
    //         });
    //     }
    // }, [walletAddress, receivingCurrency]);

    const handleNetworkChange = async (newNetwork: string) => {
        if (network !== newNetwork) {
            try {
                await switchNetwork(newNetwork);
                setNetwork(newNetwork);
            } catch (error) {
                console.error('Error switching network:', error);
            }
        }
    };

    return (
        <GridLayout>
            <Navbar
                walletAddress={walletAddress}
                connectWallet={connectWallet}
                tokens={tokens}
                network={network}
                onNetworkChange={handleNetworkChange}
            />
            <MiniNavbar />
            <BackgroundEffect />
            <MainContent>
                <Heading>Trade your favorite KRC-20 tokens</Heading>
                <TokenDataGrid tokens={tokens} />
            </MainContent>
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
