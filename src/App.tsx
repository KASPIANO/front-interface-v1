import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { fetchWalletBalance } from './DAL/KaspaApiDal';
import GridPage from './pages/krc-20/GridPage';
import { darkTheme } from './theme/DarkTheme';
import { lightTheme } from './theme/LightTheme';
import { getLocalDarkMode, setWalletBalanceUtil } from './utils/Utils';
import {
    isKasWareInstalled,
    requestAccounts,
    onAccountsChanged,
    removeAccountsChangedListener,
    switchNetwork,
    disconnect,
} from './utils/KaswareUtils';
import TokenPage from './pages/token-page/TokenPage';
import Navbar from './components/navbar/Navbar';

const App = () => {
    const [darkMode, setDarkMode] = useState(getLocalDarkMode());
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [walletConnected, setWalletConnected] = useState<boolean>(false);
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

        const checkWalletConnection = async () => {
            if (isKasWareInstalled()) {
                const accounts = await requestAccounts();
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    setWalletConnected(true);
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

    const handleDisconnect = async () => {
        const { origin } = window.location;
        await disconnect(origin);
        setWalletAddress(null);
        setWalletBalance(0);
        localStorage.removeItem('isWalletConnected');
    };

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
                <Navbar
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    walletConnected={walletConnected}
                    walletAddress={walletAddress}
                    network={network}
                    onNetworkChange={handleNetworkChange}
                    walletBalance={walletBalance}
                    connectWallet={requestAccounts}
                    disconnectWallet={handleDisconnect}
                />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <GridPage
                                darkMode={darkMode}
                                toggleDarkMode={toggleDarkMode}
                                walletAddress={walletAddress}
                                walletBalance={walletBalance}
                                walletConnected={walletConnected}
                                showNotification={showNotification}
                                setShowNotification={setShowNotification}
                            />
                        }
                    />
                    <Route
                        path="/token/:ticker"
                        element={
                            <TokenPage
                                network={network}
                                darkMode={darkMode}
                                toggleDarkMode={toggleDarkMode}
                                showNotification={showNotification}
                                setShowNotification={setShowNotification}
                                walletAddress={walletAddress}
                                connectWallet={requestAccounts}
                                handleNetworkChange={handleNetworkChange}
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
