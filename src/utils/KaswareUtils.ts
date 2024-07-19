// Ensure the WebSocket is available globally

// Utility to detect if KasWare Wallet is installed
export const isKasWareInstalled = (): boolean => typeof window.kasware !== 'undefined';

// Method to request account connection
export const requestAccounts = async (): Promise<string[]> => {
    try {
        const accounts = await window.kasware.requestAccounts();
        console.log('Connect success', accounts);
        return accounts;
    } catch (error) {
        console.error('Connect failed', error);
        throw error;
    }
};

// Method to get current account address
export const getAccounts = async (): Promise<string[]> => {
    try {
        const accounts = await window.kasware.getAccounts();
        console.log(accounts);
        return accounts;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to get current network
export const getNetwork = async (): Promise<string> => {
    try {
        const network = await window.kasware.getNetwork();
        console.log(network);
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
        console.log('Switched network');
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to disconnect KasWare Wallet
export const disconnect = async (origin: string): Promise<void> => {
    try {
        await window.kasware.disconnect(origin);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to get public key of current account
export const getPublicKey = async (): Promise<string> => {
    try {
        const publicKey = await window.kasware.getPublicKey();
        console.log(publicKey);
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
        console.log(balance);
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
        console.log(txid);
        return txid;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Method to sign message
export const signMessage = async (msg: string, type: 'ecdsa' | 'bip322-simple' = 'ecdsa'): Promise<string> => {
    try {
        const signature = await window.kasware.signMessage(msg, type);
        console.log(signature);
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
        console.log(txid);
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
        console.log(txid);
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
        console.log(txid);
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
        console.log(txid);
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
