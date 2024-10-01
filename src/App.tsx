import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { showGlobalSnackbar } from './components/alert-context/AlertContext';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import { checkReferralExists, signUser } from './DAL/BackendDAL';
import { fetchWalletBalance } from './DAL/KaspaApiDal';
import { KaspianoRouter } from './KaspianoRouter';
import { ThemeContext } from './main';
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
    generateVerificationMessage,
    getLocalThemeMode,
    setWalletBalanceUtil,
    ThemeModes,
} from './utils/Utils';
import ReferralDialog from './components/dialogs/referral/ReferralDialog';

const App = () => {
    const [themeMode, setThemeMode] = useState(getLocalThemeMode());
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [walletConnected, setWalletConnected] = useState<boolean>(false);
    const [network, setNetwork] = useState<string>('mainnet'); // New state for network
    const [, setIsConnecting] = useState<boolean>(false);
    const [backgroundBlur, setBackgroundBlur] = useState(false);
    const [, setUserVerified] = useState<UserVerfication>(null);
    const [, setReferralExists] = useState<boolean | null>(null);
    const [openReferralDialog, setOpenReferralDialog] = useState(false);

    const toggleThemeMode = () => {
        const newMode = themeMode === ThemeModes.DARK ? ThemeModes.LIGHT : ThemeModes.DARK;
        localStorage.setItem('theme_mode', newMode);
        setThemeMode(newMode);
    };

    const updateWalletState = useCallback(async (address: string) => {
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

    const handleUserVerification = useCallback(
        async (accounts: string[], setUserVerified: any, showGlobalSnackbar: any) => {
            try {
                const nonce = generateNonce();
                const requestId = generateRequestId();
                const requestDate = new Date().toISOString();
                const [account] = accounts;
                const userVerificationMessage = generateVerificationMessage(
                    account,
                    nonce,
                    requestDate,
                    requestId,
                );

                const userVerification = await signMessage(userVerificationMessage);
                if (userVerification) {
                    const verifiedUser = {
                        userWalletAddress: account,
                        userSignedMessageTxId: userVerification,
                        requestId,
                        requestNonce: nonce,
                        requestTimestamp: requestDate,
                    };
                    setUserVerified(verifiedUser);
                    await signUser(verifiedUser);
                    showGlobalSnackbar({
                        message: 'User verified successfully',
                        severity: 'success',
                    });
                    // Update wallet state with the first account
                    await updateWalletState(account);

                    // Show a success message with part of the wallet address
                    showGlobalSnackbar({
                        message: 'Wallet connected successfully',
                        severity: 'success',
                        details: `Connected to wallet ${account.substring(0, 9)}....${account.substring(account.length - 4)}`,
                    });
                    return verifiedUser;
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
        },
        [resetWalletState, updateWalletState],
    );

    const handleAccountsChanged = useCallback(
        async (accounts: string[]) => {
            setUserVerified(null);
            if (accounts.length === 0) {
                resetWalletState();
            } else {
                await updateWalletState(accounts[0]);
                await handleUserVerification(accounts, setUserVerified, showGlobalSnackbar);
            }
        },
        [handleUserVerification, resetWalletState, updateWalletState],
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
    }, [walletAddress, walletBalance, network, handleAccountsChanged]);

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
                    // Perform user verification

                    const userVerification = await handleUserVerification(
                        accounts,
                        setUserVerified,
                        showGlobalSnackbar,
                    );

                    // Log the verification result
                    console.log('User Verification:', userVerification, accounts[0]);
                    if (userVerification) {
                        // Check referral status
                        const referralStatus = await checkReferralExists(accounts[0]);
                        setReferralExists(referralStatus?.exists || false);

                        // If referral doesn't exist, show referral dialog after 2 seconds
                        if (!referralStatus?.exists) {
                            setTimeout(() => {
                                setOpenReferralDialog(true);
                            }, 2000);
                        }
                    }
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

    const handleCloseReferralDialog = () => {
        setOpenReferralDialog(false);
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

    return themeMode ? (
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
                    <KaspianoRouter
                        backgroundBlur={backgroundBlur}
                        handleNetworkChange={handleNetworkChange}
                        network={network}
                        setWalletBalance={setWalletBalance}
                        walletAddress={walletAddress}
                        walletBalance={walletBalance}
                        walletConnected={walletConnected}
                    />
                    <Footer />
                </BrowserRouter>
                <ReferralDialog
                    open={openReferralDialog}
                    onClose={handleCloseReferralDialog}
                    walletAddress={walletAddress}
                    mode="add" // Initial mode is to add a referral code if none exists
                />
            </ThemeProvider>
        </ThemeContext.Provider>
    ) : null;
};

export default App;
