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
    totalHolders: number;
    topHolders?: TokenHolder[];
    transferTotal?: string;
    sentiment?: TokenSentiment;
    description?: string;
    socials?: TokenSocials;
    contacts?: string[];
}

export interface TokenListItem {
    tick: string;
    ticker?: string;
    mtsAdd: number;
    max: number;
    minted: number;
    maxMintedPercent: number;
    totalHolders: number;
    pre: number;
    logoUrl: string;
    bannerUrl: string;
}
export interface TokenSearchItems {
    ticker: string;
    logo: string;
    minted?: string;
    holders?: number;
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

export enum FilterState {
    UP = 'UP',
    DOWN = 'DOWN',
    NONE = 'NONE',
}

export interface PortfolioValue {
    kas: number;
    change: number;
    changeDirection: 'increase' | 'decrease';
}

export interface UserPortfolioOverview {
    addedTokens: string[];
    mainWalletAddress: string;
    alternativeWallets?: string[];
    user?: UserSettings;
    paidUser: boolean;
}

export interface UserSettings {
    username: string;
    displayPictureURL?: string;
    displayNames?: string;
    email: string;
    discord?: string;
    twitter?: string;
}

export interface TokenRowPortfolioItem {
    ticker: string;
    balance: string;
    price?: string;
    totalValue?: string;
    oneDayChange?: string;
    logoUrl?: string;
}
