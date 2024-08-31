import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { showGlobalSnackbar } from './components/alert-context/AlertContext';
import Navbar from './components/navbar/Navbar';
import { fetchWalletBalance } from './DAL/KaspaApiDal';
import { ThemeContext } from './main';
import DeployPage from './pages/deploy-page/DeployPage';
import GridPage from './pages/krc-20/GridPage';
import PortfolioPage from './pages/portfolio-page/PortfolioPage';
import TokenPage from './pages/token-page/TokenPage';
import { darkTheme } from './theme/DarkTheme';
import { lightTheme } from './theme/LightTheme';
import { disconnect, isKasWareInstalled, requestAccounts, signMessage, switchNetwork } from './utils/KaswareUtils';
import {
    generateNonce,
    generateRequestId,
    getLocalThemeMode,
    setWalletBalanceUtil,
    ThemeModes,
} from './utils/Utils';
import Footer from './components/footer/Footer';
import PrivacyPolicy from './pages/compliance/PrivacyPolicy';
import TermsOfService from './pages/compliance/TermsOfService';
import TrustSafety from './pages/compliance/TrustSafety';
import { UserVerfication } from './types/Types';

const App = () => {
    const [themeMode, setThemeMode] = useState(getLocalThemeMode());
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [walletConnected, setWalletConnected] = useState<boolean>(false);
    const [network, setNetwork] = useState<string>('mainnet'); // New state for network
    const [, setIsConnecting] = useState<boolean>(false);
    const [backgroundBlur, setBackgroundBlur] = useState(false);
    const [, setUserVerified] = useState<UserVerfication>(null);

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
                const nonce = generateNonce();
                const requestId = generateRequestId();
                const requestDate = new Date().toISOString();
                const userVerificationMessage = `
kaspiano.com wants you to sign in with your Kaspa account:

${accounts[0]}

Welcome to Kaspiano. Signing is the only way we can truly know that you are the owner of the wallet you are connecting. Signing is a safe, gas-less transaction that does not in any way give Kaspiano permission to perform any transactions with your wallet.

URI: https://kaspiano.com

Version: 1

Nonce: ${nonce}

Issued At: ${requestDate}

Request ID: ${requestId}
                    `;

                const userVerification = await signMessage(userVerificationMessage);
                if (userVerification) {
                    setUserVerified({
                        userWalletAddress: accounts[0],
                        userSignedMessageTxId: userVerification,
                        requestId,
                        requestNonce: nonce,
                        requestTimestamp: requestDate,
                    });
                    console.log('User Verification:', userVerification, accounts[0]);
                } else {
                    showGlobalSnackbar({
                        message: 'Failed to sign message',
                        severity: 'error',
                    });
                    await handleDisconnect();
                }
            } else {
                showGlobalSnackbar({
                    message: 'Kasware not installed',
                    severity: 'error',
                    kasware: true,
                });
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
                showGlobalSnackbar({ message: `Switched to ${newNetwork}`, severity: 'success' });
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
                                        setWalletBalance={setWalletBalance}
                                        walletBalance={walletBalance}
                                        walletConnected={walletConnected}
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
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-service" element={<TermsOfService />} />
                            <Route path="/trust-safety" element={<TrustSafety />} />
                            {/* Handle 404 - Not Found */}
                            <Route path="*" element={<div>404 - Not Found</div>} />
                        </Routes>
                        <Footer />
                    </BrowserRouter>
                </ThemeProvider>
            </ThemeContext.Provider>
        );
    }
};

export default App;
