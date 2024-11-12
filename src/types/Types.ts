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
    state: string;
    marketCap?: number;
    changeMarketCap?: number;
    changePrice?: number;
    volumeUsd?: number;
    changeVolumeUsd?: number;
    volumeKas?: number;
}

export interface BackendTokenMetadata {
    logoUrl: string;
    bannerUrl: string;
    description: string;
    socials: TokenSocials;
    sentiment: TokenSentiment;
    selectedSentiment: keyof TokenSentiment | null;
    contacts: string[];
    rugScore: number;
    founders?: string[];
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
    changeTotalMints: number;
    changeTotalHolders: number;
    state: string;
    price?: number;
    marketCap?: number;
    changeMarketCap?: number;
    changePrice?: number;
    volumeUsd?: number;
    changeVolumeUsd?: number;
}
export interface AdsListItemResponse {
    ticker: string;
    creationDate: number;
    totalSupply: number;
    totalMinted: number;
    totalMintedPercent: number;
    totalHolders: number;
    preMintedSupply: number;
    logo: string;
    state: string;
    price?: number;
    marketCap?: number;
    volumeUsd?: number;
    purpose: SlotPurpose;
    telegram?: string;
    website?: string;
}
export interface TokenSearchItems {
    ticker: string;
    logo: string | any;
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

export interface TokenKRC20Deploy {
    ticker: string;
    totalSupply: string;
    mintLimit: string;
    preAllocation?: string;
}
export interface TokenKRC20DeployMetadata {
    description?: string;
    website?: string;
    x: string;
    email: string;
    discord?: string;
    telegram?: string;
    logo?: File;
    banner?: File;
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
    value: number;
    change?: number;
    changeDirection?: 'increase' | 'decrease';
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
    price?: number;
    totalValue?: string;
    oneDayChange?: string;
    logoUrl?: string;
    state: string;
}
export interface TokenRowActivityItem {
    ticker: string;
    amount: string;
    type: string;
    time: string;
    price?: string;
    totalValue?: string;
    oneDayChange?: string;
}

export interface TransferObj {
    p: string;
    op: string;
    tick: string;
    amt: string;
    to?: string[] | string;
}

export interface TickerPortfolioBackend {
    ticker: string;
    logo: string;
    state?: string;
    price?: number;
}

export interface FetchWalletActivityResponse {
    activityItems: TokenRowActivityItem[];
    next: string | null;
    prev: string | null;
}

export interface FetchWalletPortfolioResponse {
    portfolioItems: TokenRowPortfolioItem[];
    next: string | null;
    prev: string | null;
}

export interface UTXO {
    address: string | null;
    amount: string;
    blockDaaScore: string;
    isCoinbase: boolean;
    scriptPublicKey: string;
}
export interface KaswareSendKaspaResultInput {
    index: number;
    sequence: string;
    sigOpCount: number;
    signatureScript: string;
    transactionId: string;
    utxo: UTXO;
}

export interface KaswareSendKaspaResultOutput {
    scriptPublicKey: string;
    value: string;
}

export interface KaswareSendKaspaResult {
    gas: string;
    id: string;
    inputs: KaswareSendKaspaResultInput[];
    lockTime: string;
    outputs: KaswareSendKaspaResultOutput[];
    payload: string;
    subnetworkId: string;
    version: number;
}

export interface Order {
    orderId: string;
    quantity: number;
    totalPrice: number;
    pricePerToken: number;
    ticker: string;
    createdAt: string;
    status: SellOrderStatus;
}

export interface SwapTransactionsResult {
    readonly commitTransactionId?: string;
    readonly revealTransactionId?: string;
    readonly sellerTransactionId?: string;
    readonly buyerTransactionId?: string;
}

export enum SellOrderStatus {
    WAITING_FOR_TOKENS = 'WAITING_FOR_TOKENS',
    LISTED_FOR_SALE = 'LISTED_FOR_SALE',
    WAITING_FOR_KAS = 'WAITING_FOR_KAS',
    CHECKOUT = 'CHECKOUT',
    WAITING_FOR_LOW_FEE = 'WAITING_FOR_LOW_FEE',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
    SWAP_ERROR = 'SWAP_ERROR',
    CHECKING_EXPIRED = 'CHECKING_EXPIRED',
    UNKNOWN_MONEY_ERROR = 'UNKNOWN_MONEY_ERROR',
    TOKENS_NOT_SENT = 'TOKENS_NOT_SENT',
    OFF_MARKETPLACE = 'OFF_MARKETPLACE',
    DELISTING = 'DELISTING',
    DELIST_ERROR = 'DELIST_ERROR',
    COMPLETED_DELISTING = 'COMPLETED_DELISTING',
}
export type FilterSellOrderStatus =
    | SellOrderStatus.LISTED_FOR_SALE
    | SellOrderStatus.COMPLETED
    | SellOrderStatus.OFF_MARKETPLACE
    | SellOrderStatus.COMPLETED_DELISTING;

export const filterSellOrderStatuses: FilterSellOrderStatus[] = [
    SellOrderStatus.LISTED_FOR_SALE,
    SellOrderStatus.COMPLETED,
    SellOrderStatus.OFF_MARKETPLACE,
    SellOrderStatus.COMPLETED_DELISTING,
];

export type UserReferral = {
    code: string;
    referredBy?: string;
    isNew?: boolean;
};

export type UserInfo = {
    email: string;
    x_url: string;
};

export type TradeStats = {
    totalTradesKaspiano: number;
    totalVolumeKasKaspiano: string;
    totalVolumeUsdKaspiano: string;
    tokens: [
        {
            totalTrades: number;
            totalVolumeKAS: number;
            ticker: string;
            totalVolumeUsd: string;
        },
    ];
};

export interface AuthWalletInfo {
    walletAddress: string;
    authType: AuthType;
}

export enum AuthType {
    USER = 'user',
    WALLET = 'wallet',
}

export interface AuthWalletOtp {
    success: boolean;
    code: string;
}

export interface SignInWithWalletRequestDto {
    walletAddress: string;
    signature: string;
    date: string;
    requestId: string;
    publicKey: string;
}

export interface AuthWalletInfo {
    walletAddress: string;
    authType: AuthType;
    userRoles?: UserRoleEnum[];
}

export interface SignInResponse extends AuthWalletInfo {
    success: boolean;
}

export enum UserRoleEnum {
    SYS_ADMIN = -1,
    LISTING_MANAGER = 1,
}

export interface BatchTransferItem {
    to: string;
    amount: number;
    tick: string;
}

export enum AdType {
    BANNER = 'main_page',
    SIDEBAR = 'token_page',
}

export enum SlotPurpose {
    FEATURED = 'featured',
    EVENT = 'event',
    TRADING = 'trading',
    MINT = 'mint_live',
}

export const slotPurposeDisplayMapper: { [key in SlotPurpose]: string } = {
    [SlotPurpose.FEATURED]: 'Featured',
    [SlotPurpose.EVENT]: 'Event',
    [SlotPurpose.TRADING]: 'Trading Competition',
    [SlotPurpose.MINT]: 'Mint Live',
};
