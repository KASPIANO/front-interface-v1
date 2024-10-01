import { useCallback, useEffect, useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import { showGlobalSnackbar } from '../components/alert-context/AlertContext';
import { UserVerfication } from '../types/Types';
import { generateNonce, generateRequestId, generateVerificationMessage } from '../utils/Utils';
// import { showGlobalDialog } from '../components/dialog-context/DialogContext';
import { getNetwork, handleSwitchNetwork, isKasWareInstalled } from '../utils/KaswareUtils';

export const useKasware = () => {
    const [connected, setConnected] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [publicKey, setPublicKey] = useState('');
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState(0);
    const [network, setNetwork] = useState('mainnet');
    const [signature, setSignature] = useState('');
    const [userVerified, setUserVerified] = useState<UserVerfication>(null);
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

            const userVerification = await signMessage(userVerificationMessage);

            if (userVerification) {
                cookies.remove('user');
                cookies.set(
                    'user',
                    {
                        message: userVerificationMessage,
                        publicKey,
                        signature: userVerification,
                        expiresAt: Date.now() + 4 * 60 * 60 * 1000,
                    },
                    { secure: true },
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

                // showGlobalDialog({
                //     dialogType: 'referral',
                //     dialogProps: {
                //         walletAddress: account,
                //         mode: 'add',
                //     },
                // });
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
                if (!verified) {
                    handleUserVerification(_accounts[0]);
                }
                setAccounts(_accounts);
                setConnected(true);

                setAddress(_accounts[0]);
                localStorage.setItem('walletAddress', _accounts[0]);

                getBasicInfo();
            } else {
                setConnected(false);
            }
        },
        [self, handleUserVerification],
    );

    const handleNetworkChanged = useCallback(async (newNetwork: string) => {
        if (network !== newNetwork) {
            try {
                setNetwork(network);
                await handleNetworkByEnvironment();
                showGlobalSnackbar({ message: `Switched to ${network}`, severity: 'success' });
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
    }, [handleAccountsChanged, cookies]);

    useEffect(() => {
        if (isKasWareInstalled()) {
            window.kasware.on('accountsChanged', handleAccountsChanged);
            window.kasware.on('networkChanged', handleNetworkChanged);
            window.kasware.on('disconnect', disconnectWallet);

            return () => {
                window.kasware.removeListener('accountsChanged', handleAccountsChanged);
                window.kasware.removeListener('networkChanged', handleNetworkChanged);
                window.kasware.removeListener('disconnect', disconnectWallet);
            };
        }
    }, [handleAccountsChanged, handleNetworkChanged, disconnectWallet]);

    // useEffect(() => {
    //     if (!isStarted) {
    //         async function checkKasware() {
    //             let { kasware } = window;

    //             for (let i = 1; i < 10 && !kasware; i += 1) {
    //                 await new Promise((resolve) => setTimeout(resolve, 100 * i));
    //                 // eslint-disable-next-line prefer-destructuring
    //                 kasware = window.kasware;
    //             }

    //             if (kasware) {
    //                 setKaswareInstalled(true);
    //             } else if (!kasware) return;

    //             kasware.getAccounts().then((accounts: string[]) => {
    //                 handleAccountsChanged(accounts);
    //             });

    //             kasware.on('accountsChanged', handleAccountsChanged);
    //             kasware.on('networkChanged', handleNetworkChanged);
    //             kasware.on('disconnect', disconnectWallet);

    //             return () => {
    //                 kasware.removeListener('accountsChanged', handleAccountsChanged);
    //                 kasware.removeListener('networkChanged', handleNetworkChanged);
    //                 kasware.removeListener('disconnect', disconnectWallet);
    //             };
    //         }

    //         checkKasware().then();
    //         setIsStarted(true);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        const checkExistingConnection = async () => {
            const storedAddress = localStorage.getItem('walletAddress');
            if (storedAddress && isKasWareInstalled()) {
                try {
                    const accounts = await window.kasware.requestAccounts();
                    if (accounts.length > 0 && accounts[0].toLowerCase() === storedAddress.toLowerCase()) {
                        handleAccountsChanged(accounts, true);
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
    }, []);

    const switchNetwork = async (e) => {
        const network = await window.kasware.switchNetwork(e.target.value);
        setNetwork(network);
    };

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
        switchNetwork,
        connectWallet,
        signMessage,
        setWalletBalance: setBalance,
        handleNetworkChange,
    };
};
