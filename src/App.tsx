import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { fetchWalletBalance } from './DAL/KaspaApiDal';
import { ThemeContext } from './main';
import GridPage from './pages/krc-20/GridPage';
import LimitOrderPage from './pages/limit-order/LimitOrder';
import SwapPage from './pages/swap-page/SwapPage';
import { darkTheme } from './theme/DarkTheme';
import { lightTheme } from './theme/LightTheme';
import { getLocalThemeMode, setWalletBalanceUtil, ThemeModes } from './utils/Utils';

const App = () => {
    const [themeMode, setThemeMode] = useState(getLocalThemeMode());
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);

    const toggleThemeMode = () => {
        const newMode = themeMode === ThemeModes.DARK ? ThemeModes.LIGHT : ThemeModes.DARK;
        localStorage.setItem('theme_mode', newMode);
        setThemeMode(newMode);
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
        <ThemeContext.Provider value={{ themeMode, toggleThemeMode }}>
            <ThemeProvider theme={themeMode === ThemeModes.DARK ? darkTheme : lightTheme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/swap"
                            element={
                                <SwapPage
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
        </ThemeContext.Provider>
    );
};

export default App;
