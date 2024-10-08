import { useCallback, useEffect, useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import { showGlobalSnackbar } from '../components/alert-context/AlertContext';
import { UserReferral, UserVerfication } from '../types/Types';
import { generateNonce, generateRequestId, generateVerificationMessage, isEmptyString } from '../utils/Utils';
// import { showGlobalDialog } from '../components/dialog-context/DialogContext';
import { showGlobalDialog } from '../components/dialog-context/DialogContext';
import { getNetwork, isKasWareInstalled } from '../utils/KaswareUtils';
import { LOCAL_STORAGE_KEYS } from '../utils/Constants';
import { getUserReferral } from '../DAL/BackendDAL';

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
        try {
            const nonce = generateNonce();
            const requestId = generateRequestId();
            const requestDate = new Date().toISOString();
            const userVerificationMessage = generateVerificationMessage(account, nonce, requestDate, requestId);
            const domain = import.meta.env.VITE_ENV === 'local' ? '' : '.kaspiano.com';
            const userVerification = await signMessage(userVerificationMessage);
            const publicKeyCookies = await window.kasware.getPublicKey();
            if (userVerification) {
                cookies.remove('user');
                cookies.set(
                    'user',
                    {
                        message: userVerificationMessage,
                        publicKey: publicKeyCookies,
                        signature: userVerification,
                        expiresAt: Date.now() + 4 * 60 * 60 * 1000,
                    },
                    { secure: true, sameSite: 'none', path: '/', domain },
                );
                const verifiedUser = {
                    userWalletAddress: account,
                    userSignedMessageTxId: userVerification,
                    requestId,
                    requestNonce: nonce,
                    requestTimestamp: requestDate,
                };
                setUserVerified(verifiedUser);
                showGlobalSnackbar({
                    message: 'User verified successfully',
                    severity: 'success',
                });

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
                getBasicInfo();
                setAccounts(_accounts);
                setConnected(true);

                setAddress(_accounts[0]);
                localStorage.setItem('walletAddress', _accounts[0]);
                if (!verified) {
                    handleUserVerification(_accounts[0]);
                }
            } else {
                setConnected(false);
                setAccounts([]);
                setAddress('');
                setPublicKey('');
                setBalance(0);
            }
        },
        [handleUserVerification, self],
    );

    const handleNetworkChange = useCallback(async (newNetwork) => {
        if (network !== newNetwork) {
            try {
                await handleNetworkByEnvironment();
                showGlobalSnackbar({ message: `Switched to ${newNetwork}`, severity: 'success' });
                getBasicInfo();
            } catch (error) {
                console.error('Error switching network:', error);
                showGlobalSnackbar({
                    message: 'Failed to switch network',
                    severity: 'error',
                    details: error.message,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const disconnectWallet = useCallback(async () => {
        const { origin } = window.location;
        await window.kasware.disconnect(origin);
        handleAccountsChanged([]);
        localStorage.removeItem('walletAddress');
        showGlobalSnackbar({ message: 'Wallet disconnected successfully', severity: 'success' });
        cookies.remove('user');
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
            const storedAddress = localStorage.getItem('walletAddress');
            if (storedAddress && isKasWareInstalled()) {
                try {
                    const accounts = await window.kasware.requestAccounts();
                    if (accounts.length > 0 && accounts[0].toLowerCase() === storedAddress.toLowerCase()) {
                        await getBasicInfo();
                        handleAccountsChanged(accounts, true);
                        await handleNetworkByEnvironment();
                    } else {
                        localStorage.removeItem('walletAddress');
                        cookies.remove('user');
                    }
                } catch (error) {
                    console.error('Error checking existing connection:', error);
                    localStorage.removeItem('walletAddress');
                    cookies.remove('user');
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
            if (error.code === 4001) {
                return false;
            }
            console.error(error);
            throw error;
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

                setIsUserReferralFinishedLoading(true);

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
        console.log('currentEnv', currentEnv);
        console.log('getCurrentNetwork', getCurrentNetwork);
        if (currentEnv !== getCurrentNetwork) {
            showGlobalSnackbar({
                message: 'Please switch to the correct network',
                severity: 'error',
            });
            const reject = await handleSwitchNetwork(currentEnv);

            if (!reject) {
                await disconnectWallet();
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
