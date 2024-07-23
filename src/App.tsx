import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { darkTheme } from './theme/DarkTheme';
import { lightTheme } from './theme/LightTheme';
import { getLocalDarkMode, setWalletBalanceUtil } from './utils/Utils';
import { useEffect, useState } from 'react';
import SwapPage from './pages/swap-page/SwapPage';
import LimitOrderPage from './pages/limit-order/LimitOrder';
import { fetchWalletBalance } from './DAL/KaspaApiDal';
import GridPage from './pages/krc-20/GridPage';
import {
    isKasWareInstalled,
    requestAccounts,
    onAccountsChanged,
    removeAccountsChangedListener,
    switchNetwork,
} from './utils/KaswareUtils';

const App = () => {
    const [darkMode, setDarkMode] = useState(getLocalDarkMode());
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [network, setNetwork] = useState<string>('mainnet'); // New state for network

    const toggleDarkMode = () => {
        const modeString = !darkMode ? 'true' : 'false';
        localStorage.setItem('dark_mode', modeString);
        setDarkMode(!darkMode);
    };

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
    }, [walletAddress]);

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
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/swap"
                        element={
                            <SwapPage
                                darkMode={darkMode}
                                toggleDarkMode={toggleDarkMode}
                                walletAddress={walletAddress}
                                walletBalance={walletBalance}
                                isConnecting={isConnecting}
                                showNotification={showNotification}
                                setShowNotification={setShowNotification}
                                setWalletAddress={setWalletAddress}
                                setWalletBalance={setWalletBalance}
                            />
                        }
                    />
                    <Route
                        path="/limit-order"
                        element={
                            <LimitOrderPage
                                darkMode={darkMode}
                                toggleDarkMode={toggleDarkMode}
                                walletAddress={walletAddress}
                                walletBalance={walletBalance}
                            />
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <GridPage
                                network={network}
                                handleNetworkChange={handleNetworkChange}
                                darkMode={darkMode}
                                toggleDarkMode={toggleDarkMode}
                                walletAddress={walletAddress}
                                walletBalance={walletBalance}
                                isConnecting={isConnecting}
                                showNotification={showNotification}
                                setShowNotification={setShowNotification}
                                setWalletAddress={setWalletAddress}
                                setWalletBalance={setWalletBalance}
                            />
                        }
                    />
                    <Route
                        path="/token/:ticker"
                        element={
                            <GridPage
                                network={network}
                                handleNetworkChange={handleNetworkChange}
                                darkMode={darkMode}
                                toggleDarkMode={toggleDarkMode}
                                walletAddress={walletAddress}
                                walletBalance={walletBalance}
                                isConnecting={isConnecting}
                                showNotification={showNotification}
                                setShowNotification={setShowNotification}
                                setWalletAddress={setWalletAddress}
                                setWalletBalance={setWalletBalance}
                            />
                        }
                    />
                    {/* Handle 404 - Not Found */}
                    <Route path="*" element={<div>404 - Not Found</div>} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
