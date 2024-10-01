import { useCallback, useEffect, useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import { showGlobalSnackbar } from '../components/alert-context/AlertContext';
import { UserVerfication } from '../types/Types';
import { generateNonce, generateRequestId, generateVerificationMessage } from '../utils/Utils';

export const useKasware = () => {
    const [isStarted, setIsStarted] = useState(false);
    const [kaswareInstalled, setKaswareInstalled] = useState(false);
    const [connected, setConnected] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [publicKey, setPublicKey] = useState('');
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState({
        confirmed: 0,
        unconfirmed: 0,
        total: 0,
    });
    const [network, setNetwork] = useState('mainnet');
    const [signature, setSignature] = useState('');
    const [userVerified, setUserVerified] = useState<UserVerfication>(null);
    const cookies = new Cookies();

    const getBasicInfo = async () => {
        const { kasware } = window;
        const [address] = await kasware.getAccounts();
        setAddress(address);

        const publicKey = await kasware.getPublicKey();
        setPublicKey(publicKey);

        const balance = await kasware.getBalance();
        setBalance(balance);
        const krc20Balances = await kasware.getKRC20Balance();
        console.log('krc20Balances', krc20Balances);

        const network = await kasware.getNetwork();
        setNetwork(network);
    };

    const selfRef = useRef<{ accounts: string[] }>({
        accounts: [],
    });
    const self = selfRef.current;

    const handleAccountsChanged = (_accounts: string[]) => {
        if (self.accounts[0] === _accounts[0]) {
            // prevent from triggering twice
            return;
        }
        self.accounts = _accounts;
        if (_accounts.length > 0) {
            handleUserVerification(_accounts[0]);
            setAccounts(_accounts);
            setConnected(true);

            setAddress(_accounts[0]);

            getBasicInfo();
        } else {
            setConnected(false);
        }
    };

    const handleNetworkChanged = (network: string) => {
        setNetwork(network);
        getBasicInfo();
    };

    useEffect(() => {
        if (!isStarted) {
            async function checkKasware() {
                let { kasware } = window;

                for (let i = 1; i < 10 && !kasware; i += 1) {
                    await new Promise((resolve) => setTimeout(resolve, 100 * i));
                    // eslint-disable-next-line prefer-destructuring
                    kasware = window.kasware;
                }

                if (kasware) {
                    setKaswareInstalled(true);
                } else if (!kasware) return;

                kasware.getAccounts().then((accounts: string[]) => {
                    handleAccountsChanged(accounts);
                });

                kasware.on('accountsChanged', handleAccountsChanged);
                kasware.on('networkChanged', handleNetworkChanged);

                return () => {
                    kasware.removeListener('accountsChanged', handleAccountsChanged);
                    kasware.removeListener('networkChanged', handleNetworkChanged);
                };
            }

            checkKasware().then();
            setIsStarted(true);
        }
    }, []);

    const disconnectWallet = async () => {
        const { origin } = window.location;
        await window.kasware.disconnect(origin);
        handleAccountsChanged([]);
        cookies.remove('user');
    };

    const switchNetwork = async (e) => {
        const network = await window.kasware.switchNetwork(e.target.value);
        setNetwork(network);
    };

    const connectWallet = async () => {
        const result = await window.kasware.requestAccounts();
        handleAccountsChanged(result);
    };

    const signMessage = async (message: string) => {
        const signature = await (window as any).kasware.signMessage(message);
        setSignature(signature);
        return signature;
    };

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
            return null;
        }
    }, []);

    const handleNetworkByEnvironment = async () => {
        const currentEnv = import.meta.env.VITE_ENV === 'prod' ? 'kaspa_mainnet' : 'kaspa_testnet_10';
        const getCurrentNetwork = network;
        if (currentEnv !== getCurrentNetwork) {
            showGlobalSnackbar({
                message: 'Please switch to the correct network',
                severity: 'error',
            });
            await switchNetwork(currentEnv).catch(async () => {
                await disconnectWallet();
            });
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
        isKasWareInstalled: kaswareInstalled,
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
