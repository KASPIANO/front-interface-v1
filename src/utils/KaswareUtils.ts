// Ensure the WebSocket is available globally

// Utility to detect if KasWare Wallet is installed
export const isKasWareInstalled = (): boolean => typeof window.kasware !== 'undefined';
const KASPIANO_WALLET = import.meta.env.VITE_APP_KAS_WALLET_ADDRESS;
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
export const switchNetwork = async (network: string): Promise<void> => {
    try {
        await window.kasware.switchNetwork(network);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to disconnect KasWare Wallet
export const disconnect = async (origin: string): Promise<any> => {
    try {
        const response = await window.kasware.disconnect(origin);
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
export const sendKaspa = async (
    toAddress: string,
    sompi: number,
    options?: { feeRate?: number },
): Promise<string> => {
    try {
        const txid = await window.kasware.sendKaspa(toAddress, sompi, options);
        return txid;
    } catch (error) {
        throw error;
    }
};
export const sendKaspaToKaspiano = async (sompi: number, options?: { feeRate?: number }): Promise<any> => {
    try {
        const txid = await window.kasware.sendKaspa(KASPIANO_WALLET, sompi, options);
        const parsedTxid = JSON.parse(txid);
        return parsedTxid;
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
export const deployKRC20Token = async (inscribeJsonString: string): Promise<string> => {
    if (!isKasWareInstalled()) throw new Error('KasWare Wallet is not installed');
    try {
        const txid = await window.kasware.signKRC20Transaction(inscribeJsonString, 2);
        return txid;
    } catch (error) {
        console.error('Failed to deploy KRC20 token:', error);
        throw error;
    }
};

// Method to mint KRC20 token
export const mintKRC20Token = async (inscribeJsonString: string): Promise<string> => {
    if (!isKasWareInstalled()) throw new Error('KasWare Wallet is not installed');
    try {
        const txid = await window.kasware.signKRC20Transaction(inscribeJsonString, 3);
        return txid;
    } catch (error) {
        console.error('Failed to mint KRC20 token:', error);
        throw error;
    }
};

// Method to transfer KRC20 token
export const transferKRC20Token = async (inscribeJsonString: string, destAddr: string): Promise<string> => {
    if (!isKasWareInstalled()) throw new Error('KasWare Wallet is not installed');
    try {
        const txid = await window.kasware.signKRC20Transaction(inscribeJsonString, 4, destAddr);
        return txid;
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
export const signKRC20BatchTransfer = async (inscribeJsonString: string, toAddrs: string[]): Promise<string> => {
    if (!isKasWareInstalled()) throw new Error('KasWare Wallet is not installed');

    try {
        // Calling the KasWare method to sign the batch transfer transaction
        const txid = await window.kasware.signKRC20BatchTransferTransaction(inscribeJsonString, 4, toAddrs);
        return txid;
    } catch (error) {
        console.error('Failed to execute batch KRC20 token transfer:', error);
        throw error;
    }
};
