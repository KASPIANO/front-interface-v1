import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { fetchWalletBalance } from './DAL/KaspaApiDal';
import { ThemeContext } from './main';
import GridPage from './pages/krc-20/GridPage';
import TokenPage from './pages/token-page/TokenPage';
import { darkTheme } from './theme/DarkTheme';
import { lightTheme } from './theme/LightTheme';
import { disconnect, isKasWareInstalled, requestAccounts, switchNetwork } from './utils/KaswareUtils';
import { getLocalThemeMode, setWalletBalanceUtil, ThemeModes } from './utils/Utils';
import DeployPage from './pages/deploy-page/DeployPage';
import { showGlobalSnackbar } from './components/alert-context/AlertContext';
import PortfolioPage from './pages/portfolio-page/PortfolioPage';

const App = () => {
    const [themeMode, setThemeMode] = useState(getLocalThemeMode());
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [walletConnected, setWalletConnected] = useState<boolean>(false);
    const [network, setNetwork] = useState<string>('mainnet'); // New state for network
    const [, setIsConnecting] = useState<boolean>(false);
    const [backgroundBlur, setBackgroundBlur] = useState(false);

    const toggleThemeMode = () => {
        const newMode = themeMode === ThemeModes.DARK ? ThemeModes.LIGHT : ThemeModes.DARK;
        localStorage.setItem('theme_mode', newMode);
        setThemeMode(newMode);
    };

    const updateWalletState = useCallback(async (address) => {
        setWalletAddress(address);
        setWalletConnected(true);
        const balance = await fetchWalletBalance(address);
        setWalletBalance(setWalletBalanceUtil(balance));
    }, []);

    const resetWalletState = useCallback(() => {
        setWalletAddress(null);
        setWalletBalance(0);
        setWalletConnected(false);
    }, []);

    const handleAccountsChanged = useCallback(
        async (accounts) => {
            if (accounts.length === 0) {
                resetWalletState();
            } else {
                await updateWalletState(accounts[0]);
            }
        },
        [updateWalletState, resetWalletState],
    );

    const handleNetworkChanged = useCallback((newNetwork) => {
        setNetwork(newNetwork);
    }, []);

    const handleDisconnect = useCallback(async () => {
        const { origin } = window.location;
        await disconnect(origin);
        resetWalletState();
        showGlobalSnackbar({ message: 'Wallet disconnected successfully', severity: 'success' });
    }, [resetWalletState]);

    useEffect(() => {
        if (isKasWareInstalled()) {
            window.kasware.on('accountsChanged', handleAccountsChanged);
            window.kasware.on('networkChanged', handleNetworkChanged);
            window.kasware.on('disconnect', handleDisconnect);

            return () => {
                window.kasware.removeListener('accountsChanged', handleAccountsChanged);
                window.kasware.removeListener('networkChanged', handleNetworkChanged);
                window.kasware.removeListener('disconnect', handleDisconnect);
            };
        }
    }, [handleAccountsChanged, handleNetworkChanged, handleDisconnect]);

    useEffect(() => {
        if (walletAddress && walletBalance === 0) {
            fetchWalletBalance(walletAddress).then((balance) => setWalletBalance(setWalletBalanceUtil(balance)));
        }
    }, [walletAddress, walletBalance]);

    const handleConnectWallet = async () => {
        setIsConnecting(true);
        try {
            if (isKasWareInstalled()) {
                const accounts = await requestAccounts();
                if (accounts.length > 0) {
                    await updateWalletState(accounts[0]);
                    showGlobalSnackbar({
                        message: 'Wallet connected successfully',
                        severity: 'success',
                        details: `Connected to wallet ${accounts[0].substring(0, 9)}....${accounts[0].substring(accounts[0].length - 4)}`,
                    });
                }
            }
        } catch (error) {
            console.error('Error connecting to wallet:', error);
            showGlobalSnackbar({
                message: 'Failed to connect wallet',
                severity: 'error',
                details: error.message,
            });
        } finally {
            setIsConnecting(false);
        }
    };

    const handleNetworkChange = async (newNetwork) => {
        if (network !== newNetwork) {
            try {
                await switchNetwork(newNetwork);
                setNetwork(newNetwork);
            } catch (error) {
                console.error('Error switching network:', error);
                showGlobalSnackbar({
                    message: 'Failed to switch network',
                    severity: 'error',
                    details: error.message,
                });
            }
        }
    };

    if (!themeMode) {
        return null;
    } else {
        return (
            <ThemeContext.Provider value={{ themeMode, toggleThemeMode }}>
                <ThemeProvider theme={themeMode === ThemeModes.DARK ? darkTheme : lightTheme}>
                    <CssBaseline />
                    <BrowserRouter>
                        <Navbar
                            walletConnected={walletConnected}
                            walletAddress={walletAddress}
                            network={network}
                            onNetworkChange={handleNetworkChange}
                            walletBalance={walletBalance}
                            connectWallet={handleConnectWallet}
                            disconnectWallet={handleDisconnect}
                            setBackgroundBlur={setBackgroundBlur}
                            backgroundBlur={backgroundBlur}
                        />
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <GridPage
                                        backgroundBlur={backgroundBlur}
                                        walletConnected={walletConnected}
                                        walletAddress={walletAddress}
                                        walletBalance={walletBalance}
                                    />
                                }
                            />
                            <Route
                                path="/token/:ticker"
                                element={
                                    <TokenPage
                                        backgroundBlur={backgroundBlur}
                                        network={network}
                                        walletAddress={walletAddress}
                                        connectWallet={requestAccounts}
                                        handleNetworkChange={handleNetworkChange}
                                    />
                                }
                            />
                            <Route
                                path="/deploy"
                                element={
                                    <DeployPage walletBalance={walletBalance} backgroundBlur={backgroundBlur} />
                                }
                            />
                            <Route
                                path="/portfolio"
                                element={
                                    <PortfolioPage
                                        walletAddress={walletAddress}
                                        backgroundBlur={backgroundBlur}
                                        walletConnected={walletConnected}
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
    }
};

export default App;
