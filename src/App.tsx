import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { showGlobalSnackbar } from './components/alert-context/AlertContext';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import { fetchWalletBalance } from './DAL/KaspaApiDal';
// import useSSE from './hooks/useSSE';
import { ThemeContext } from './main';
import BatchTransferPage from './pages/batch-transfer-page/BatchTransferPage';
import ContactUs from './pages/compliance/ContactUs';
import PrivacyPolicy from './pages/compliance/PrivacyPolicy';
import TermsOfService from './pages/compliance/TermsOfService';
import TrustSafety from './pages/compliance/TrustSafety';
import DeployPage from './pages/deploy-page/DeployPage';
import GridPage from './pages/krc-20/GridPage';
import PortfolioPage from './pages/portfolio-page/PortfolioPage';
import TokenPage from './pages/token-page/TokenPage';
import { darkTheme } from './theme/DarkTheme';
import { lightTheme } from './theme/LightTheme';
import { UserVerfication } from './types/Types';
import {
    disconnect,
    getNetwork,
    isKasWareInstalled,
    requestAccounts,
    signMessage,
    switchNetwork,
} from './utils/KaswareUtils';
import {
    generateNonce,
    generateRequestId,
    getLocalThemeMode,
    setWalletBalanceUtil,
    ThemeModes,
} from './utils/Utils';

const App = () => {
    const [themeMode, setThemeMode] = useState(getLocalThemeMode());
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [walletConnected, setWalletConnected] = useState<boolean>(false);
    const [network, setNetwork] = useState<string>('mainnet'); // New state for network
    const [, setIsConnecting] = useState<boolean>(false);
    const [backgroundBlur, setBackgroundBlur] = useState(false);
    const [, setUserVerified] = useState<UserVerfication>(null);
    // const events = useSSE(walletAddress);

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
        localStorage.setItem('walletAddress', address);
    }, []);

    const resetWalletState = useCallback(() => {
        setWalletAddress(null);
        setWalletBalance(0);
        setWalletConnected(false);
        setUserVerified(null);
        localStorage.removeItem('walletAddress');
    }, []);

    const handleAccountsChanged = useCallback(
        async (accounts) => {
            setUserVerified(null);
            if (accounts.length === 0) {
                resetWalletState();
            } else {
                await updateWalletState(accounts[0]);
                await handleUserVerification(accounts, setUserVerified, showGlobalSnackbar);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [updateWalletState, resetWalletState],
    );

    const handleDisconnect = useCallback(async () => {
        const { origin } = window.location;
        await disconnect(origin);
        resetWalletState();
        showGlobalSnackbar({ message: 'Wallet disconnected successfully', severity: 'success' });
    }, [resetWalletState]);

    const handleNetworkChanged = useCallback(async () => {
        handleDisconnect();
    }, [handleDisconnect]);

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
        if (walletAddress) {
            fetchWalletBalance(walletAddress).then((balance) => setWalletBalance(setWalletBalanceUtil(balance)));
        }
    }, [walletAddress, walletBalance, network]);

    useEffect(() => {
        const checkExistingConnection = async () => {
            const storedAddress = localStorage.getItem('walletAddress');
            if (storedAddress && isKasWareInstalled()) {
                try {
                    const accounts = await requestAccounts();
                    if (accounts.length > 0 && accounts[0].toLowerCase() === storedAddress.toLowerCase()) {
                        await updateWalletState(accounts[0]);
                        await handleNetworkByEnvironment();
                    } else {
                        localStorage.removeItem('walletAddress');
                    }
                } catch (error) {
                    console.error('Error checking existing connection:', error);
                    localStorage.removeItem('walletAddress');
                }
            }
        };

        checkExistingConnection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateWalletState]);

    const handleConnectWallet = async () => {
        setIsConnecting(true);
        try {
            // Check if KasWare is installed
            if (isKasWareInstalled()) {
                // Request accounts from the wallet
                await handleNetworkByEnvironment();
                const accounts = await requestAccounts();

                // Check if any accounts were returned
                if (accounts.length > 0) {
                    // Update wallet state with the first account
                    await updateWalletState(accounts[0]);
                    // Show a success message with part of the wallet address
                    showGlobalSnackbar({
                        message: 'Wallet connected successfully',
                        severity: 'success',
                        details: `Connected to wallet ${accounts[0].substring(0, 9)}....${accounts[0].substring(accounts[0].length - 4)}`,
                    });

                    // Perform user verification
                    const storedAddress = localStorage.getItem('walletAddress');
                    if (!storedAddress && storedAddress !== accounts[0]) {
                        const userVerification = await handleUserVerification(
                            accounts,
                            setUserVerified,
                            showGlobalSnackbar,
                        );

                        // Log the verification result
                        console.log('User Verification:', userVerification, accounts[0]);
                    }

                    // Log the verification result
                } else {
                    // If no accounts, show error message and disconnect
                    showGlobalSnackbar({
                        message: 'No accounts found in the wallet',
                        severity: 'error',
                    });
                    await handleDisconnect();
                }
            } else {
                // KasWare not installed
                showGlobalSnackbar({
                    message: 'KasWare not installed',
                    severity: 'error',
                    kasware: true,
                });
            }
        } catch (error) {
            // Handle any errors during the wallet connection process
            console.error('Error connecting to wallet:', error);
            showGlobalSnackbar({
                message: 'Failed to connect wallet',
                severity: 'error',
                details: error.message,
            });
        } finally {
            // Reset the connecting state
            setIsConnecting(false);
        }
    };

    const handleNetworkByEnvironment = async () => {
        const currentEnv = import.meta.env.VITE_ENV === 'prod' ? 'kaspa_mainnet' : 'kaspa_testnet_10';
        const getCurrentNetwork = await getNetwork();
        if (currentEnv !== getCurrentNetwork) {
            showGlobalSnackbar({
                message: 'Please switch to the correct network',
                severity: 'error',
            });
            const reject = await switchNetwork(currentEnv);

            if (!reject) {
                await handleDisconnect();
            } else {
                setNetwork(currentEnv);
            }
        }
    };

    const handleNetworkChange = async (newNetwork) => {
        if (network !== newNetwork) {
            try {
                await switchNetwork(newNetwork);
                setNetwork(newNetwork);
                await handleNetworkByEnvironment();
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
    // Utility function to handle user verification
    const handleUserVerification = async (accounts: string[], setUserVerified: any, showGlobalSnackbar: any) => {
        try {
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

                showGlobalSnackbar({
                    message: 'User verified successfully',
                    severity: 'success',
                });
                return userVerification;
            }
        } catch (error) {
            console.error('Error verifying user:', error);
            showGlobalSnackbar({
                message: 'Failed to verify user - Connect Again',
                severity: 'error',
                details: error.message,
            });
            resetWalletState();
            return null;
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
                                    <DeployPage
                                        walletBalance={walletBalance}
                                        backgroundBlur={backgroundBlur}
                                        walletConnected={walletConnected}
                                        setWalletBalance={setWalletBalance}
                                        walletAddress={walletAddress}
                                    />
                                }
                            />
                            <Route
                                path="/portfolio"
                                element={
                                    <PortfolioPage
                                        walletBalance={walletBalance}
                                        walletAddress={walletAddress}
                                        backgroundBlur={backgroundBlur}
                                        walletConnected={walletConnected}
                                    />
                                }
                            />
                            <Route
                                path="/airdrop"
                                element={
                                    <BatchTransferPage
                                        walletBalance={walletBalance}
                                        setWalletBalance={setWalletBalance}
                                        walletAddress={walletAddress}
                                        backgroundBlur={backgroundBlur}
                                        walletConnected={walletConnected}
                                    />
                                }
                            />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-service" element={<TermsOfService />} />
                            <Route path="/trust-safety" element={<TrustSafety />} />
                            <Route path="/contact-us" element={<ContactUs />} />
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
