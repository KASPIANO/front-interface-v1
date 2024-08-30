export interface Krc20ApiTokenResponse {
    tick: string;
    max: string;
    lim: string;
    dec: string;
    minted: string;
    opScoreAdd: string;
    opScoreMod: string;
    state: string;
    hashRev: string;
    mtsAdd: string;
    holderTotal: string;
    transferTotal: string;
    mintTotal: string;
    holder: Krc20ApiTokenHolder[];
}

export interface Krc20ApiTokenHolder {
    address: string;
    amount: string;
}

export interface BackendTokenResponse {
    ticker: string;
    creationDate: number;
    totalSupply: number;
    totalMintTimes: number;
    totalMinted: number;
    totalMintedPercent: number;
    totalHolders: number;
    preMintedSupply: number;
    topHolders: BackendTokenHolder[];
    mintLimit: number;
    devWallet: string;
    metadata: BackendTokenMetadata;
    totalTrades: number;
    volume?: number;
    price?: number;
}

export interface BackendTokenMetadata {
    logoUrl: string;
    bannerUrl: string;
    description: string;
    socials: TokenSocials;
    sentiment: TokenSentiment;
    contacts: string[];
    rugScore: number;
}

export interface TokenListItemResponse {
    ticker: string;
    creationDate: number;
    totalSupply: number;
    totalMinted: number;
    totalMintedPercent: number;
    totalHolders: number;
    preMintedSupply: number;
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
    warning: number;
    negative: number;
    neutral: number;
    positive: number;
    love: number;
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
    other?: string;
}

export interface BackendTokenHolder {
    address: string;
    balance: number;
}

export interface Krc20ApiTokenListResponse {
    result: Krc20ApiTokenResponse[];
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
    logo?: File;
    banner?: File;
    transactionHash?: string;
    whitepaper?: string;
    medium?: string;
    audit?: string;
    contract?: string;
    github?: string;
    contacts?: string[];
    founders?: string[];
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
