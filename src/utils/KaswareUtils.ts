// Ensure the WebSocket is available globally

import Cookies from 'js-cookie';
import { getPriorityFee } from '../DAL/KaspaApiDal';
import { KaswareSendKaspaResult } from '../types/Types';
import { saveMintData } from '../DAL/BackendDAL';
import { showGlobalSnackbar } from '../components/alert-context/AlertContext';
import { getTokenMintsLeft } from '../DAL/Krc20DAL';

export const USER_REJECTED_TRANSACTION_ERROR_CODE = 4001;
export const MINIMUM_KASPA_AMOUNT_FOR_TRANSACTION = 21;
export const AIRDROP_VERSION = '0.7.5.4';
export const PKST_VERSION = '0.7.8';

// Utility to detect if KasWare Wallet is installed
export const isKasWareInstalled = (): boolean => typeof window.kasware !== 'undefined';
const KASPIANO_WALLET = import.meta.env.VITE_APP_KAS_WALLET_ADDRESS;

// const KASPA_TO_SOMPI = 100000000; // 1 KAS = 100,000,000 sompi
// const MINT_DEPLOY_PRIORITY = 0.005;
// const MINT_DEPLOY_PRIORITY_SOMPI = MINT_DEPLOY_PRIORITY * KASPA_TO_SOMPI;
// const MIN_TX_MASS = 0.00000100;

// Method to request account connection
export const requestAccounts = async (): Promise<string[]> => {
    try {
        const accounts = await window.kasware.requestAccounts();
        return accounts;
    } catch (error) {
        console.error('Connect failed', error);
        throw error;
    }
};

export const getWalletAddress = async (): Promise<string> => {
    try {
        const accounts = await window.kasware.requestAccounts();
        return accounts[0] || '';
    } catch (error) {
        console.error('Connect failed', error);
        throw error;
    }
};

// Method to get current account address
export const getAccounts = async (): Promise<string[]> => {
    try {
        const accounts = await window.kasware.getAccounts();

        return accounts;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCurrentAccount = async (): Promise<string> => {
    try {
        const accounts = await window.kasware.getAccounts();
        return accounts[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to get current network
export const getNetwork = async (): Promise<string> => {
    try {
        const network = await window.kasware.getNetwork();
        return network;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to switch network
export const handleSwitchNetwork = async (network: string): Promise<any> => {
    try {
        await window.kasware.switchNetwork(network);
        return true;
    } catch (error) {
        if (error.code === 4001) {
            return false;
        }
        console.error(error);
        throw error;
    }
};

// Method to disconnect KasWare Wallet
export const disconnect = async (origin: string): Promise<any> => {
    try {
        const response = await window.kasware.disconnect(origin);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to get public key of current account
export const getPublicKey = async (): Promise<string> => {
    try {
        const publicKey = await window.kasware.getPublicKey();
        return publicKey;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to get KAS balance
export const getBalance = async (): Promise<{ confirmed: number; unconfirmed: number; total: number }> => {
    try {
        const balance = await window.kasware.getBalance();
        return balance;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to send KAS
// PRIORITY FEE SOMPI//
export const sendKaspa = async (toAddress: string, sompi: number, priorityFee?: number): Promise<string> => {
    try {
        const kasPriorityFee = priorityFee ? priorityFee : undefined;
        const options = { priorityFee: kasPriorityFee };
        const txData = await window.kasware.sendKaspa(toAddress, sompi, options);
        return txData;
    } catch (error) {
        throw error;
    }
};

// PRIORITY FEE SOMPI//
export const sendKaspaToKaspiano = async (
    sompi: number,
    options?: { priorityFee?: number },
): Promise<KaswareSendKaspaResult> => {
    try {
        const priorityFee = await getPriorityFee('KASPA');
        if (priorityFee) {
            options = { priorityFee };
        }
        const txData = await window.kasware.sendKaspa(KASPIANO_WALLET, sompi, options);
        const parsedTxData = JSON.parse(txData);
        return parsedTxData;
    } catch (error) {
        throw error;
    }
};

// Method to sign message
export const signMessage = async (msg: string, type: 'ecdsa' | 'bip322-simple' = 'ecdsa'): Promise<string> => {
    try {
        const signature = await window.kasware.signMessage(msg, type);
        return signature;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to push transaction
export const pushTx = async (options: { rawtx: string }): Promise<string> => {
    try {
        const txid = await window.kasware.pushTx(options);
        return txid;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to sign KRC20 transaction
// PRIORITY FEE KAS
export const deployKRC20Token = async (inscribeJsonString: string, priorityFee?: number): Promise<string> => {
    if (!isKasWareInstalled()) throw new Error('KasWare Wallet is not installed');
    try {
        const kasPriorityFee = priorityFee ? priorityFee / 1e8 : priorityFee;
        const txid = await window.kasware.signKRC20Transaction(inscribeJsonString, 2, '', kasPriorityFee);
        return txid;
    } catch (error) {
        console.error('Failed to deploy KRC20 token:', error);
        throw error;
    }
};

// Method to mint KRC20 token
// PRIORITY FEE KAS
export const mintKRC20Token = async (
    inscribeJsonString: string,
    ticker: string,
    priorityFee?: number,
): Promise<string> => {
    if (!isKasWareInstalled()) throw new Error('KasWare Wallet is not installed');
    try {
        const mintsLeft = await getTokenMintsLeft(ticker);

        if (mintsLeft <= 0) {
            throw new Error(`Minting for the ${ticker} token has ended`);
        }
        const kasPriorityFee = priorityFee ? priorityFee / 1e8 : undefined;
        const txid = await window.kasware.signKRC20Transaction(inscribeJsonString, 3, '', kasPriorityFee);
        saveMintData(ticker);
        return txid;
    } catch (error) {
        console.error('Failed to mint KRC20 token:', error);
        throw error;
    }
};

// Method to transfer KRC20 token
// PRIORITY FEE KAS
export const transferKRC20Token = async (inscribeJsonString: string): Promise<string> => {
    if (!isKasWareInstalled()) throw new Error('KasWare Wallet is not installed');
    try {
        const priorityFee = await getPriorityFee('TRANSFER');
        const kasPriorityFee = priorityFee ? priorityFee / 1e8 : priorityFee;
        const txid = await window.kasware.signKRC20Transaction(inscribeJsonString, 4, '', kasPriorityFee);
        return txid;
    } catch (error) {
        console.error('Failed to transfer KRC20 token:', error);
        throw error;
    }
};

// NEED to revise priorityfee
export const createOrderKRC20 = async (
    krc20Tick: string,
    krc20Amount: number,
    kasAmount: number,
    psktExtraOutput?: Array<{ address: string; amount: number }>,
    priorityFee?: number,
): Promise<{ txJsonString: string; sendCommitTxId: string }> => {
    if (!isKasWareInstalled()) throw new Error('KasWare Wallet is not installed');
    await versionCheck(PKST_VERSION);
    try {
        const kasPriorityFee = priorityFee ? priorityFee / 1e8 : undefined;

        const { txJsonString, sendCommitTxId } = await window.kasware.createKRC20Order({
            krc20Tick,
            krc20Amount,
            kasAmount,
            psktExtraOutput,
            priorityFee: kasPriorityFee,
        });
        return { txJsonString, sendCommitTxId };
    } catch (error) {
        console.error('Failed to transfer KRC20 token:', error);
        throw error;
    }
};

export const buyOrderKRC20 = async (
    txJsonString: string,
    priorityFee?: number,
    extraOutput?: Array<{ address: string; amount: number }>,
): Promise<string> => {
    if (!isKasWareInstalled()) throw new Error('KasWare Wallet is not installed');
    await versionCheck(PKST_VERSION);
    try {
        const kasPriorityFee = priorityFee ? priorityFee / 1e8 : undefined;
        const txId = await window.kasware.buyKRC20Token({
            txJsonString,
            extraOutput,
            priorityFee: kasPriorityFee,
        });
        return txId; // txId is a string
    } catch (error) {
        console.error('Failed to transfer KRC20 token:', error);
        throw error;
    }
};
export const cancelOrderKRC20 = async (ticker: string, sendCommitTxId: string): Promise<string> => {
    if (!isKasWareInstalled()) throw new Error('KasWare Wallet is not installed');
    await versionCheck(PKST_VERSION);
    try {
        const txId = await window.kasware.cancelKRC20Order({
            krc20Tick: ticker,
            sendCommitTxId,
        });
        return txId; // txId is a string
    } catch (error) {
        console.error('Failed to transfer KRC20 token:', error);
        throw error;
    }
};

// Event handling for account changes
export const onAccountsChanged = (handler: (accounts: Array<string>) => void) => {
    window.kasware.on('accountsChanged', handler);
};

export const removeAccountsChangedListener = (handler: (accounts: Array<string>) => void) => {
    window.kasware.removeListener('accountsChanged', handler);
};

// Event handling for network changes
export const onNetworkChanged = (handler: (network: string) => void) => {
    window.kasware.on('networkChanged', handler);
};

export const removeNetworkChangedListener = (handler: (network: string) => void) => {
    window.kasware.removeListener('networkChanged', handler);
};

// Utility function to sign a KRC20 batch transfer transaction
export const signKRC20BatchTransfer = async (
    addressedList: { tick: string; to: string; amount: number }[],
): Promise<string> => {
    if (!isKasWareInstalled()) throw new Error('KasWare Wallet is not installed');

    try {
        const txid = await window.kasware.krc20BatchTransferTransaction(addressedList);

        return txid;
    } catch (error) {
        console.error('Failed to execute batch KRC20 token transfer:', error);
        throw error;
    }
};

const isVersionLatestOrGreater = (currentVersion, versionNeeded: string) => {
    const currentParts = currentVersion.split('.').map(Number);
    const latestParts = versionNeeded.split('.').map(Number);

    for (let i = 0; i < latestParts.length; i++) {
        if (currentParts[i] > latestParts[i]) return true;
        if (currentParts[i] < latestParts[i]) return false;
    }
    return true; // If all parts are equal, the version is up-to-date
};
export const versionCheck = async (versionNeeded: string) => {
    const currentVersion = await window.kasware.getVersion();
    if (isVersionLatestOrGreater(currentVersion, versionNeeded)) {
        return true;
    } else {
        showGlobalSnackbar({
            message: 'Please update your KasWare Wallet to the latest version.',
            severity: 'error',
        });
        return false;
    }
};
