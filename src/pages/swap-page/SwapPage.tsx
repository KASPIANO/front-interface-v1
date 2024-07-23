import { useState, FC } from 'react';
import SlippageModal from '../../components/modals/slippage-modal/SlippageModal';
import WalletModal from '../../components/modals/wallet-modal/WalletModal';
import { Heading, BlurOverlay, MainContent } from './SwapPage.s';
import { Token, TokenResponse } from '../../types/Types';
import NotificationComponent from '../../components/notification/Notification';
import { SwapLayout } from './SwapPageLayout';
import MiniNavbar from '../../components/mini-navbar/MiniNavbar';
import MainSwapBox from '../../components/main-swap-box/MainSwapBox';
import Footer from '../../components/footer/Footer';
import BackgroundEffect from '../../components/background-effect/BackgroundEffect';

interface SwapPageProps {
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
}

// const tokens = [
//     { name: 'Kaspa', symbol: 'KAS', logoURI: '/kaspa.svg' },
//     { name: 'TokenA', symbol: 'TKA', logoURI: '/tokenA.svg' },
// ];

const SwapPage: FC<SwapPageProps> = (props) => {
    const { walletAddress, connectWallet, walletBalance, isConnecting, showNotification, setShowNotification } =
        props;

    const [paying, setPaying] = useState<string>('');
    const [receiving, setReceiving] = useState<string>('');
    const [payingCurrency, setPayingCurrency] = useState<string>('KAS');
    const [payingCurrencyImage, setPayingCurrencyImage] = useState<string>('/kas.svg');
    const [receivingCurrency, setReceivingCurrency] = useState<string>('Select Token');
    const [receivingCurrencyImage, setReceivingCurrencyImage] = useState<string | null>(null);
    const [receivingBalance, setReceivingBalance] = useState<number>(0);
    const [isPayingActive, setIsPayingActive] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
    const [isPayingTokenModal, setIsPayingTokenModal] = useState<boolean>(true);
    const [isBlurred, setIsBlurred] = useState<boolean>(false);
    const [slippageMode, setSlippageMode] = useState<string>('Auto');
    const [slippageValue, setSlippageValue] = useState<string>('1%');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [tokens, setTokens] = useState<TokenResponse[]>([]);

    // useEffect(() => {
    //     const handleAccountsChanged = async (accounts: string[]) => {
    //         if (accounts.length === 0) {
    //             setWalletAddress(null);
    //             setWalletBalance(0);
    //             setReceivingBalance(0);
    //             localStorage.removeItem('isWalletConnected');
    //         } else {
    //             setWalletAddress(accounts[0]);
    //             const balance = await fetchWalletBalance(accounts[0]);
    //             setWalletBalance(setWalletBalanceUtil(balance));
    //         }
    //     };

    //     const handleDisconnect = () => {
    //         setWalletAddress(null);
    //         setWalletBalance(0);
    //         setReceivingBalance(0);
    //         localStorage.removeItem('isWalletConnected');
    //     };

    //     const checkWalletConnection = async () => {
    //         const isWalletConnected = localStorage.getItem('isWalletConnected');
    //         if (isWalletConnected === 'true' && window.kasware) {
    //             await window.kasware.requestAccounts();
    //             const selectedAddress = window.kasware._selectedAddress;
    //             if (selectedAddress) {
    //                 setWalletAddress(selectedAddress);
    //                 const balance = await fetchWalletBalance(selectedAddress);
    //                 setWalletBalance(setWalletBalanceUtil(balance));
    //                 setShowNotification(true);
    //                 setTimeout(() => setShowNotification(false), 5000);
    //             }
    //         }
    //     };

    //     if (window.kasware) {
    //         window.kasware.on('accountsChanged', handleAccountsChanged);
    //         window.kasware.on('disconnect', handleDisconnect);
    //     }

    //     checkWalletConnection();

    //     return () => {
    //         if (window.kasware && window.kasware.removeListener) {
    //             window.kasware.removeListener('accountsChanged', handleAccountsChanged);
    //             window.kasware.removeListener('disconnect', handleDisconnect);
    //         }
    //     };
    // }, [walletAddress, setShowNotification]);

    const switchAssets = () => {
        const tempPaying = paying;
        const tempPayingCurrency = payingCurrency;
        const tempPayingCurrencyImage = payingCurrencyImage;

        setPaying(receiving);
        setReceiving(tempPaying);

        setPayingCurrency(receivingCurrency);
        setReceivingCurrency(tempPayingCurrency);

        setPayingCurrencyImage(receivingCurrencyImage || '');
        setReceivingCurrencyImage(tempPayingCurrencyImage);
    };

    // useEffect(() => {
    //     const formatBalance = (balance: number) => (isNaN(balance) ? '0.00' : balance.toFixed(4));

    //     if (walletAddress) {
    //         fetchReceivingBalance(walletAddress, receivingCurrency).then((balanceInToken) => {
    //             setReceivingBalance(parseFloat(formatBalance(balanceInToken)));
    //         });
    //     }
    // }, [walletAddress, receivingCurrency]);

    // useEffect(() => {
    //     const fetchTokensList = async () => {
    //         const tokensList = await fetchTokens();
    //         setTokens(tokensList);
    //     };

    //     fetchTokensList();
    // }, []);

    const openSlippageModal = () => {
        setIsModalOpen(true);
        setIsBlurred(true);
    };

    const closeSlippageModal = () => {
        setIsModalOpen(false);
        setIsBlurred(false);
    };

    const openTokenModal = (isPaying: boolean) => {
        setIsPayingTokenModal(isPaying);
        setIsTokenModalOpen(true);
        setIsBlurred(true);
    };

    const closeTokenModal = () => {
        setIsTokenModalOpen(false);
        setIsBlurred(false);
    };

    const handleTokenSelect = (token: Token) => {
        if (isPayingTokenModal) {
            setPayingCurrency(token.symbol);
            setPayingCurrencyImage(token.logo);
        } else {
            setReceivingCurrency(token.symbol);
            setReceivingCurrencyImage(token.logo);
        }
        closeTokenModal();
    };

    const handleSlippageSave = (mode: string, value: string) => {
        setSlippageMode(mode);
        setSlippageValue(value);
    };

    return (
        <SwapLayout>
            {/* <Navbar walletAddress={walletAddress} connectWallet={connectWallet} tokens={tokens} /> */}
            <MiniNavbar />
            <BackgroundEffect />
            <MainContent>
                <Heading>Trade your favorite KRC-20 tokens</Heading>
                <MainSwapBox
                    isPayingActive={isPayingActive}
                    paying={paying}
                    setPaying={setPaying}
                    payingCurrency={payingCurrency}
                    payingCurrencyImage={payingCurrencyImage}
                    receiving={receiving}
                    setReceiving={setReceiving}
                    receivingCurrency={receivingCurrency}
                    receivingCurrencyImage={receivingCurrencyImage}
                    walletAddress={walletAddress}
                    walletBalance={walletBalance}
                    receivingBalance={receivingBalance}
                    isConnecting={isConnecting}
                    switchAssets={switchAssets}
                    connectWallet={connectWallet}
                    openTokenModal={openTokenModal}
                    slippageMode={slippageMode}
                    slippageValue={slippageValue}
                    openSlippageModal={openSlippageModal}
                    handleTokenSelect={handleTokenSelect}
                    closeTokenModal={closeTokenModal}
                    handleSlippageSave={handleSlippageSave}
                    tokens={tokens}
                />
            </MainContent>
            <Footer />
            {isModalOpen && <SlippageModal onClose={closeSlippageModal} onSave={handleSlippageSave} />}
            {isBlurred && <BlurOverlay />}
            {showNotification && walletAddress && (
                <NotificationComponent
                    message={`Connected to wallet ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`}
                    onClose={() => setShowNotification(false)}
                />
            )}
            {isModalVisible && <WalletModal onClose={() => setIsModalVisible(false)} />}
        </SwapLayout>
    );
};

export default SwapPage;
