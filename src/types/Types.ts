// In ../../../types/Types.ts

export interface Token {
    tick: string;
    logoURI?: string;
    symbol?: string;
    logo?: string;
    state: string;
    max: string;
    minted: string;
    pre: string;
    mtsAdd: string;
    lim: string;
    holder?: TokenHolder[];
    transferTotal?: string;
}

export interface TokenHolder {
    address: string;
    amount: string;
}

export interface TokenResponse {
    tick: string;
    maxSupply: string;
    minted: string;
    state: string;
    logo: string;
}
export interface TokenListResponse {
    result: TokenResponse[];
    next: string;
    prev: string;
}

export interface InputContainerProps {
    active: boolean;
}

export interface NavButtonsProps {
    isOpen: boolean;
}

export interface NavButtonProps {
    isActive: boolean;
}

export interface NavItemProps {
    isActive: boolean;
}

export interface TokenDeploy {
    ticker: string;
    totalSupply: string;
    mintLimit: string;
    preAllocation?: string;
    description?: string;
    website?: string;
    x?: string;
    discord?: string;
    telegram?: string;
    logo?: string;
    banner?: string;
}

export type AlertSeverity = 'error' | 'loading' | 'info' | 'success';
export type AlertContextType = {
    showAlert: (
        message: string,
        severity: AlertSeverity,
        details?: string,
        commit?: string,
        reveal?: string,
    ) => void;
};
