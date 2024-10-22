interface Kasware {
    requestAccounts: () => Promise<string[]>;
    _selectedAddress: string;
    getAccounts: () => Promise<string[]>;
    getNetwork: () => Promise<string>;
    switchNetwork: (network: string) => Promise<string>;
    disconnect: (origin: string) => Promise<void>;
    getPublicKey: () => Promise<string>;
    getBalance: () => Promise<{ confirmed: number; unconfirmed: number; total: number }>;
    sendKaspa: (toAddress: string, sompi: number, options?: { priorityFee?: number }) => Promise<string>;
    signMessage: (msg: string, type?: 'ecdsa' | 'bip322-simple') => Promise<string>;
    pushTx: (options: { rawtx: string }) => Promise<string>;
    signKRC20Transaction: (
        inscribeJsonString: string,
        type: number,
        destAdd?: string,
        priorityFee?: number,
    ) => Promise<string>;
    signKRC20BatchTransferTransaction: (
        list: { ticker: string; to: string; amount: number }[],
        priorityFee?: number,
    ) => Promise<string>;
    on: (event: 'accountsChanged' | 'networkChanged' | 'disconnect', handler: (data: any) => void) => void;
    removeListener: (
        event: 'accountsChanged' | 'networkChanged' | 'disconnect',
        handler: (data: any) => void,
    ) => void;
}

interface Window {
    kasware?: Kasware;
}
