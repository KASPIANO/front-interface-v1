import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { fetchWalletBalance } from './DAL/KaspaApiDal';
import GridPage from './pages/krc-20/GridPage';
import LimitOrderPage from './pages/limit-order/LimitOrder';
import SwapPage from './pages/swap-page/SwapPage';
import { darkTheme } from './theme/DarkTheme';
import { lightTheme } from './theme/LightTheme';
import { getLocalDarkMode, setWalletBalanceUtil } from './utils/Utils';

const App = () => {
    const [darkMode, setDarkMode] = useState(getLocalDarkMode());
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);

    const toggleDarkMode = () => {
        const modeString = !darkMode ? 'true' : 'false';
        localStorage.setItem('dark_mode', modeString);
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        reconnectWallet();
    }, []);

    const connectWallet = async () => {
        setIsConnecting(true);
        try {
            if (window.kasware) {
                await window.kasware.requestAccounts();
                const selectedAddress = window.kasware._selectedAddress;

                if (selectedAddress) {
                    setWalletAddress(selectedAddress);
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 5000);
                    // await verifyWallet(selectedAddress);
                    localStorage.setItem('isWalletConnected', 'true');
                    const balance = await fetchWalletBalance(selectedAddress);
                    setWalletBalance(setWalletBalanceUtil(balance));
                } else {
                    console.log('No account found');
                    localStorage.setItem('isWalletConnected', 'false');
                }
            } else {
                console.log('KasWare extension not detected');
                localStorage.setItem('isWalletConnected', 'false');
            }
        } catch (error) {
            console.error('Error connecting to wallet:', error);
            localStorage.setItem('isWalletConnected', 'false');
        } finally {
            setIsConnecting(false);
        }
    };

    const reconnectWallet = async () => {
        try {
            if (window.kasware && localStorage.getItem('isWalletConnected') === 'true') {
                const selectedAddress = window.kasware._selectedAddress;
                if (selectedAddress) {
                    setWalletAddress(selectedAddress);
                    const balance = await fetchWalletBalance(selectedAddress);
                    setWalletBalance(setWalletBalanceUtil(balance));
                }
            }
        } catch (error) {
            console.error('Error reconnecting to wallet:', error);
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
                                connectWallet={connectWallet}
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
                                connectWallet={connectWallet}
                                walletBalance={walletBalance}
                            />
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <GridPage
                                darkMode={darkMode}
                                toggleDarkMode={toggleDarkMode}
                                walletAddress={walletAddress}
                                connectWallet={connectWallet}
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
