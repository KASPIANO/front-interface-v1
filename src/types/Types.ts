export interface Token {
    tick?: string;
    ticker?: string;
    logo?: string;
    banner?: string;
    state: string;
    max: string;
    minted: string;
    pre: string;
    mtsAdd: string;
    lim: string;
    holder?: TokenHolder[];
    transferTotal?: string;
    sentiment?: TokenSentiment;
    description?: string;
    socials?: TokenSocials;
    contacts?: string[];
}

export interface TokenSentiment {
    warning: string;
    negative: string;
    neutral: string;
    positive: string;
    love: string;
}

export interface TokenSocials {
    website?: string;
    discord?: string;
    telegram?: string;
    x?: string;
    github?: string;
    medium?: string;
    reddit?: string;
    whitepaper?: string;
    audit?: string;
    contract?: string;
    explorer?: string;
    chat?: string;
    other?: string;
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

export interface TokenMetadata {
    ticker: string;
    banner?: string;
    logo?: string;
    description?: string;
    socials?: TokenSocials;
    sentiment?: TokenSentiment;
    contacts?: string[];
}

export interface TokenInfoDialog {
    ticker: string;
    description: string;
    website: string;
    x: string;
    telegram: string;
    logo: string;
    banner: string;
    contacts: string[];
}
