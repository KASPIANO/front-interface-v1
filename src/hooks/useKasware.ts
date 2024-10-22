import { useCallback, useEffect, useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import { showGlobalSnackbar } from '../components/alert-context/AlertContext';
import { UserReferral, UserVerfication } from '../types/Types';
import { generateNonce, generateRequestId, generateVerificationMessage, isEmptyString } from '../utils/Utils';
// import { showGlobalDialog } from '../components/dialog-context/DialogContext';
import { showGlobalDialog } from '../components/dialog-context/DialogContext';
import { getNetwork, isKasWareInstalled } from '../utils/KaswareUtils';
import { LOCAL_STORAGE_KEYS } from '../utils/Constants';
import { geConnectedWalletInfo, getUserReferral } from '../DAL/BackendDAL';
import { useQueryClient } from '@tanstack/react-query';

const COOKIE_TTL = 4 * 60 * 60 * 1000;
let cookieExperationTimeout = null;
let walletAddress = null;

export const useKasware = () => {
    const [connected, setConnected] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [publicKey, setPublicKey] = useState('');
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState(0);
    const [network, setNetwork] = useState('mainnet');
    const [signature, setSignature] = useState('');
    const [userVerified, setUserVerified] = useState<UserVerfication>(null);
    const [userReferral, setUserReferral] = useState<UserReferral | null>(null);
    const [isUserReferralFinishedLoading, setIsUserReferralFinishedLoading] = useState(false);
    const queryClient = useQueryClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const cookies = new Cookies();

    const getBasicInfo = async () => {
        const { kasware } = window;
        const [address] = await kasware.getAccounts();
        setAddress(address);

        const publicKey = await kasware.getPublicKey();
        setPublicKey(publicKey);

        const balance = await kasware.getBalance();
        const kasAmount = balance.total / 1e8;
        setBalance(kasAmount);

        const network = await kasware.getNetwork();
        setNetwork(network);
    };

    const setNewBalance = useCallback(() => {
        const { kasware } = window;
        if (connected) {
            kasware.getBalance().then((balance) => {
                const kasAmount = balance.total / 1e8;
                setBalance(kasAmount);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selfRef = useRef<{ accounts: string[] }>({
        accounts: [],
    });
    const self = selfRef.current;

    const setCookie = useCallback(async (cookieData) => {
        const cookieExperation = new Date(Date.now() + COOKIE_TTL);
        const domain = import.meta.env.VITE_ENV === 'local' ? '' : '.kaspiano.com';

        cookies.remove('user', { path: '/' });
        cookies.set('user', cookieData, {
            secure: true,
            sameSite: 'none',
            path: '/',
            domain,
            expires: cookieExperation,
        });

        if (cookieExperationTimeout) {
            clearTimeout(cookieExperationTimeout);
            cookieExperationTimeout = null;
        }

        cookieExperationTimeout = setTimeout(() => disconnectWallet(), COOKIE_TTL);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshCookieOnLoadOrClearData = useCallback(async () => {
        const userCookie = cookies.get('user');
        if (userCookie) {
            await setCookie(userCookie);
        } else {
            await disconnectWallet(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUserVerification = useCallback(async (account) => {
        try {
            const nonce = generateNonce();
            const requestId = generateRequestId();
            const requestDate = new Date().toISOString();
            const userVerificationMessage = generateVerificationMessage(account, nonce, requestDate, requestId);
            const userVerification = await signMessage(userVerificationMessage);
            if (userVerification) {
                const publicKeyCookies = await window.kasware.getPublicKey();

                await setCookie({
                    message: userVerificationMessage,
                    publicKey: publicKeyCookies,
                    signature: userVerification,
                });
                const verifiedUser = {
                    userWalletAddress: account,
                    userSignedMessageTxId: userVerification,
                    requestId,
                    requestNonce: nonce,
                    requestTimestamp: requestDate,
                };
                setUserVerified(verifiedUser);
                localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_LOGGED_IN, Date.now().toString());
                showGlobalSnackbar({
                    message: 'User verified successfully',
                    severity: 'success',
                });

                setNewBalance();

                // Show a success message with part of the wallet address

                return verifiedUser;
            }
        } catch (error) {
            console.error('Error verifying user:', error);
            showGlobalSnackbar({
                message: 'Failed to verify user - Connect Again',
                severity: 'error',
                details: error.message,
            });
            await disconnectWallet();
            return null;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAccountsChanged = useCallback(
        (_accounts: string[], verified = false) => {
            if (self.accounts[0] === _accounts[0]) {
                return;
            }

            self.accounts = _accounts;
            if (_accounts.length > 0) {
                queryClient.invalidateQueries({ queryKey: ['userListings'] });
                queryClient.invalidateQueries({ queryKey: ['ordersHistory'] });
                getBasicInfo();
                setAccounts(_accounts);
                setConnected(true);

                setAddress(_accounts[0]);
                [walletAddress] = _accounts;
                if (!verified) {
                    handleUserVerification(_accounts[0]);
                }
            } else {
                console.log('No accounts found');
                setConnected(false);
                setAccounts([]);
                setAddress('');
                setPublicKey('');
                setBalance(0);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [handleUserVerification, self],
    );

    const handleNetworkChange = useCallback(async (newNetwork) => {
        if (network !== newNetwork) {
            const isValid = await handleNetworkByEnvironment();
            if (isValid) {
                showGlobalSnackbar({ message: `Switched to ${newNetwork}`, severity: 'success' });
                getBasicInfo();
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
        walletAddress = null;
        const { origin } = window.location;
        await window.kasware.disconnect(origin);
        handleAccountsChanged([]);
        setUserReferral(null);

        if (!ignoreMessage) {
            showGlobalSnackbar({ message: 'Wallet disconnected successfully', severity: 'success' });
        }

        cookies.remove('user', { path: '/' });
        if (cookieExperationTimeout) {
            clearTimeout(cookieExperationTimeout);
            cookieExperationTimeout = null;
        }

        localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_LOGGED_IN);

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
    }, [handleAccountsChanged, handleNetworkChange, disconnectWallet]);

    useEffect(() => {
        const checkExistingConnection = async () => {
            await refreshCookieOnLoadOrClearData();

            if (localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_LOGGED_IN) === 'true') {
                try {
                    const result = await geConnectedWalletInfo();
                    // eslint-disable-next-line prefer-destructuring
                    walletAddress = result.walletAddress;
                } catch (error) {
                    console.error('error checking existing connection:', error);

                    if (isKasWareInstalled()) {
                        await disconnectWallet(true);
                        return;
                    }
                }
            }

            if (walletAddress && isKasWareInstalled()) {
                try {
                    const accounts = await window.kasware.requestAccounts();
                    if (accounts.length > 0 && accounts[0].toLowerCase() === walletAddress.toLowerCase()) {
                        await getBasicInfo();
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
        const result = await getUserReferral(address, referredBy);
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
            const result = await window.kasware.requestAccounts();
            showGlobalSnackbar({
                message: 'Wallet connected successfully',
                severity: 'success',
            });
            handleAccountsChanged(result);
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
        publicKey,
        walletAddress: address,
        network,
        walletBalance: balance,
        walletConnected: connected,
        accounts,
        kaswareInstance: window.kasware,
        signature,
        userVerified,
        disconnectWallet,
        connectWallet,
        signMessage,
        handleNetworkChange,
        setNewBalance,
        userReferral,
        updateAndGetUserReferral,
        isUserReferralFinishedLoading,
    };
};
