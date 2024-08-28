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
    devWallet?: string;
    totalMints: string;
    holder?: TokenHolder[];
    to?: string;
    mintTotal: string;
    volume?: string;
    price?: string;
}

export interface TokenResponse {
    ticker: string;
    maxSupply: number;
    topHolders: TokenHolder[];
    logo: string;
    banner: string;
    totalTrades: number;
    mintedSupply: number;
    mintedSupplyPercent: number;
    mintLimit: number;
    devWallet: string;
    totalHolders: number;
    totalMints: number;
    contacts: string[];
    volume?: number;
    price?: number;
    metadata: TokenMetadataResponse;
}

export interface TokenMetadataResponse {
    logoUrl: string;
    bannerUrl: string;
    description: string;
    socials: TokenSocials;
    sentiment: TokenSentiment;
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
    other?: string;
}

export interface TokenHolder {
    address: string;
    amount: string;
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
