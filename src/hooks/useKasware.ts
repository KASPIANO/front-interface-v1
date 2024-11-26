import { useCallback, useEffect, useRef, useState } from 'react';
import { showGlobalSnackbar } from '../components/alert-context/AlertContext';
import { UserReferral } from '../types/Types';
import { generateRequestId, generateVerificationMessage, isEmptyString } from '../utils/Utils';
// import { showGlobalDialog } from '../components/dialog-context/DialogContext';
import { showGlobalDialog } from '../components/dialog-context/DialogContext';
import { getNetwork, isKasWareInstalled } from '../utils/KaswareUtils';
import { LOCAL_STORAGE_KEYS } from '../utils/Constants';
import {
    doWalletSignIn,
    geConnectedWalletInfo,
    getOtpForWallet,
    getUserReferral,
    removeCookieOnBackend,
    setAxiosInterceptorToDisconnect,
} from '../DAL/BackendDAL';
import { useQueryClient } from '@tanstack/react-query';
import { releaseBuyLock } from '../DAL/BackendP2PDAL';

const COOKIE_TTL = 4 * 60 * 60 * 1000;
let walletAddressBeforeVerification = null;
let isConnected = false;
let disconnectTimeout = null;

export const useKasware = () => {
    const [connected, setConnected] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState(0);
    const [network, setNetwork] = useState(
        import.meta.env.VITE_ENV === 'prod' ? 'kaspa_mainnet' : 'kaspa_testnet_10',
    );
    const [signature, setSignature] = useState('');
    const [userReferral, setUserReferral] = useState<UserReferral | null>(null);
    const [isUserReferralFinishedLoading, setIsUserReferralFinishedLoading] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const queryClient = useQueryClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const setNewBalance = useCallback(() => {
        if (isConnected) {
            updateBalance();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateBalance = useCallback(() => {
        const { kasware } = window;

        kasware.getBalance().then((balance) => {
            const kasAmount = balance.total / 1e8;
            setBalance(kasAmount);
        });
    }, []);

    const selfRef = useRef<{ accounts: string[] }>({
        accounts: [],
    });
    const self = selfRef.current;

    const handleUserVerification = useCallback(async (account) => {
        setIsConnecting(true);

        try {
            const otpRequest = await getOtpForWallet(account);

            if (!otpRequest.success) {
                console.error(otpRequest);
                throw new Error('Error getting code from server');
            }

            const nonce = otpRequest.code;
            const requestId = generateRequestId();
            const requestDate = new Date().toISOString();
            const userVerificationMessage = generateVerificationMessage(account, nonce, requestDate, requestId);
            const userVerification = await signMessage(userVerificationMessage);
            if (userVerification) {
                const walletPublicKey = await window.kasware.getPublicKey();

                const signInResponse = await doWalletSignIn({
                    date: requestDate,
                    publicKey: walletPublicKey,
                    requestId,
                    walletAddress: account,
                    signature: userVerification,
                });

                if (!(signInResponse.success && signInResponse.walletAddress === account)) {
                    console.error(signInResponse);
                    throw new Error('Error signing in');
                }

                localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_LOGGED_IN, Date.now().toString());
                setConnectedWalletInfo(account);
                showGlobalSnackbar({
                    message: 'User verified successfully',
                    severity: 'success',
                });

                // Show a success message with part of the wallet address
            }
        } catch (error) {
            console.error('Error verifying user:', error);
            showGlobalSnackbar({
                message:
                    'Failed to verify user - Please try again. If the problem persists, please contact support.',
                severity: 'error',
                // details: error.message,
            });
            await disconnectWallet(true);
            setIsConnecting(false);
            return null;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setConnectedWalletInfo = useCallback(
        (walletAddress) => {
            setAddress(walletAddress);
            setIsConnecting(false);
            setConnected(true);
            isConnected = true;
            updateBalance();

            const lastLoggedInAt = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_LOGGED_IN);

            if (lastLoggedInAt) {
                const timeDiff = Date.now() - parseInt(lastLoggedInAt);
                disconnectTimeout = setTimeout(() => disconnectWallet(), Math.max(COOKIE_TTL - timeDiff, 0));
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [updateBalance],
    );

    const handleAccountsChanged = useCallback(
        (_accounts: string[], isFirstLoad = false) => {
            if (self.accounts[0] === _accounts[0]) {
                return;
            }

            setIsConnecting(true);

            self.accounts = _accounts;
            if (_accounts.length > 0) {
                const orderId = localStorage.getItem('orderId');
                if (orderId) {
                    releaseBuyLock(orderId);
                }
                queryClient.invalidateQueries({ queryKey: ['userListings'] });
                queryClient.invalidateQueries({ queryKey: ['ordersHistory'] });
                localStorage.removeItem('orderId');

                // setConnected(true);

                [walletAddressBeforeVerification] = _accounts;
                if (isFirstLoad) {
                    setAccounts(_accounts);
                    setConnectedWalletInfo(_accounts[0]);
                } else {
                    if (localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_LOGGED_IN)) {
                        clearConnectionData();
                    }

                    handleUserVerification(_accounts[0]);
                }
            } else {
                clearConnectionData();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const clearConnectionData = useCallback(() => {
        setConnected(false);
        isConnected = false;
        setAccounts([]);
        setAddress('');
        setBalance(0);
        setIsConnecting(false);
        setUserReferral(null);

        if (localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_LOGGED_IN)) {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_LOGGED_IN);
            if (disconnectTimeout) {
                clearTimeout(disconnectTimeout);
                disconnectTimeout = null;
            }

            removeCookieOnBackend().catch((error) => console.error(error));
        }
    }, []);

    const handleNetworkChange = useCallback(async (newNetwork) => {
        if (network !== newNetwork) {
            const isValid = await handleNetworkByEnvironment();
            if (isValid) {
                showGlobalSnackbar({ message: `Switched to ${newNetwork}`, severity: 'success' });
                setNetwork(newNetwork);
            } else {
                showGlobalSnackbar({
                    message: 'Failed to switch network',
                    severity: 'error',
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const disconnectWallet = useCallback(async (ignoreMessage = false) => {
        walletAddressBeforeVerification = null;
        const { origin } = window.location;
        await window.kasware.disconnect(origin);
        clearConnectionData();
        const orderId = localStorage.getItem('orderId');
        if (orderId) {
            releaseBuyLock(orderId);
        }
        localStorage.removeItem('orderId');

        if (!ignoreMessage) {
            showGlobalSnackbar({ message: 'Wallet disconnected successfully', severity: 'success' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isKasWareInstalled()) {
            window.kasware.on('accountsChanged', handleAccountsChanged);
            window.kasware.on('networkChanged', handleNetworkChange);
            window.kasware.on('disconnect', disconnectWallet);

            return () => {
                window.kasware.removeListener('accountsChanged', handleAccountsChanged);
                window.kasware.removeListener('networkChanged', handleNetworkChange);
                window.kasware.removeListener('disconnect', disconnectWallet);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const checkExistingConnection = async () => {
            let isLoggedIn = false;
            const lastLoggedInAt = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_LOGGED_IN);

            if (lastLoggedInAt && Date.now() < parseInt(lastLoggedInAt) + COOKIE_TTL) {
                isLoggedIn = true;
            }

            if (isLoggedIn) {
                try {
                    const result = await geConnectedWalletInfo();
                    // eslint-disable-next-line prefer-destructuring
                    walletAddressBeforeVerification = result.walletAddress;
                } catch (error) {
                    console.error('error checking existing connection:', error);

                    if (isKasWareInstalled()) {
                        await disconnectWallet(true);
                        return;
                    }
                }
            }

            if (walletAddressBeforeVerification && isKasWareInstalled()) {
                try {
                    const accounts = await window.kasware.requestAccounts();
                    if (
                        accounts.length > 0 &&
                        accounts[0].toLowerCase() === walletAddressBeforeVerification.toLowerCase()
                    ) {
                        const network = await window.kasware.getNetwork();
                        setNetwork(network);
                        handleAccountsChanged(accounts, true);
                        await handleNetworkByEnvironment();
                    } else {
                        await disconnectWallet(true);
                    }
                } catch (error) {
                    console.error('Error checking existing connection:', error);
                    await disconnectWallet(true);
                }
            }
        };

        setAxiosInterceptorToDisconnect(async () => {
            if (isConnected) {
                localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_LOGGED_IN);
                if (disconnectTimeout) {
                    clearTimeout(disconnectTimeout);
                    disconnectTimeout = null;
                }
                disconnectWallet(false);
            }
        });

        checkExistingConnection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSwitchNetwork = async (network) => {
        try {
            await window.kasware.switchNetwork(network);
            setNetwork(network);
            return true;
        } catch (error) {
            return false;
        }
    };

    const updateAndGetUserReferral = async (referredBy?: string): Promise<UserReferral> => {
        const result = await getUserReferral(referredBy);
        setUserReferral(result);

        return result;
    };

    useEffect(() => {
        const updateFirstUserReferral = async () => {
            const localStorageReferralCode = localStorage.getItem(LOCAL_STORAGE_KEYS.REFFERAL_CODE);

            try {
                const referralCode = await updateAndGetUserReferral(localStorageReferralCode);

                if (referralCode.isNew && isEmptyString(referralCode.referredBy)) {
                    showGlobalDialog({
                        dialogType: 'referral',
                        dialogProps: {
                            walletAddress: address,
                            mode: 'add',
                            updateAndGetUserReferral,
                            userReferral,
                        },
                    });
                }
            } catch (error) {
                console.error('Error getting referral info: ', error);
            }

            setIsUserReferralFinishedLoading(true);
        };
        if (!isEmptyString(address)) {
            updateFirstUserReferral();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    const connectWallet = async () => {
        if (isKasWareInstalled()) {
            await handleNetworkByEnvironment();
            setIsConnecting(true);

            try {
                const result = await window.kasware.requestAccounts();
                showGlobalSnackbar({
                    message: 'Wallet connected successfully, Please sign the message to complete your login.',
                    severity: 'success',
                });
                handleAccountsChanged(result);
            } catch (error) {
                console.error(error);
                setIsConnecting(false);
            }
        } else {
            showGlobalSnackbar({
                message: 'KasWare not installed',
                severity: 'error',
                kasware: true,
            });
        }
    };

    const signMessage = async (message: string) => {
        const signature = await (window as any).kasware.signMessage(message);
        setSignature(signature);
        return signature;
    };

    const handleNetworkByEnvironment = async () => {
        const currentEnv = import.meta.env.VITE_ENV === 'prod' ? 'kaspa_mainnet' : 'kaspa_testnet_10';
        const getCurrentNetwork = await getNetwork();

        if (currentEnv !== getCurrentNetwork) {
            showGlobalSnackbar({
                message: 'Please switch to the correct network',
                severity: 'error',
            });
            const reject = await handleSwitchNetwork(currentEnv);
            if (!reject) {
                await disconnectWallet();
                return false;
            } else {
                return true;
            }
        }
    };

    return {
        walletAddress: address,
        network,
        walletBalance: balance,
        walletConnected: connected,
        kaswareInstance: window.kasware,
        signature,
        accounts,
        disconnectWallet,
        connectWallet,
        signMessage,
        handleNetworkChange,
        setNewBalance,
        userReferral,
        updateAndGetUserReferral,
        isUserReferralFinishedLoading,
        isConnecting,
    };
};
