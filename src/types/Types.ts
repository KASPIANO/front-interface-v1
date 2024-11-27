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
    message?: string;
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
    isDecentralized: boolean;
}

export interface DecentralizedOrder {
    orderId: string;
    pricePerToken: number;
    quantity: number;
    ticker: string;
    totalPrice: number;
    createdAt: string;
    status: SellOrderStatusV2;
    psktSeller: string;
    psktTransactionId: string;
    sellerWalletAddress: string;
    isDecentralized: boolean;
}

export type MixedOrder = Order | DecentralizedOrder;

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

export enum SellOrderStatusV2 {
    LISTED_FOR_SALE = 'LISTED_FOR_SALE',
    VERIFYING = 'VERIFYING',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}

export type FilterSellOrderStatus =
    | SellOrderStatus.LISTED_FOR_SALE
    | SellOrderStatus.COMPLETED
    | SellOrderStatus.OFF_MARKETPLACE
    | SellOrderStatus.COMPLETED_DELISTING
    | SellOrderStatus.CANCELED;

export const filterSellOrderStatuses: FilterSellOrderStatus[] = [
    SellOrderStatus.LISTED_FOR_SALE,
    SellOrderStatus.COMPLETED,
    SellOrderStatus.OFF_MARKETPLACE,
    SellOrderStatus.COMPLETED_DELISTING,
    SellOrderStatus.CANCELED,
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

export interface SortParams {
    field?: string;
    direction?: 'asc' | 'desc';
}
export interface PaginationParams {
    limit?: number;
    offset?: number;
}

export interface UserOrdersParams {
    sort?: SortParams; // Sort object
    pagination?: PaginationParams; // Pagination object
    filters?: {
        // Filters object
        statuses?: (SellOrderStatus | SellOrderStatusV2)[];
        tickers?: string[];
        isSeller?: boolean;
        isBuyer?: boolean;
        totalPrice?: { min?: number; max?: number };
        startDateTimestamp?: number;
        endDateTimestamp?: number;
    };
}

export interface SortPaginationParams {
    sort?: SortParams; // Sort object
    pagination?: PaginationParams; // Pagination object
}
export type ClientSideLunchpad = {
    id: string;
    ticker: string;
    availabeUnits: number;
    status: LunchpadStatus;
    kasPerUnit: number;
    tokenPerUnit: number;
    roundNumber: number;
    totalUnits: number;
    minUnitsPerOrder?: number;
    maxUnitsPerOrder?: number;
    walletAddress?: string;
    senderWalletAddress?: string;
    krc20TokensAmount?: number;
    requiredKaspa?: number;
    openOrders?: number;
};

export enum ErrorCodes {
    UNKNOWN_ERROR = -1,
    NOT_FOUND = 404,

    HIGH_PRIORITY_FEE = 10001,

    NOT_ENOUGH_KRC20_TOKENS = 20001,
    INVALID_LUNCHPAD_STATUS = 20002,
    INVALID_LUNCHPAD_ORDER_STATUS = 20003,
    INVALID_ORDER_UNITS = 20004,
    LUNCHPAD_UNITS_EXCEEDS = 20005,
    INVALID_ORDER_STATUS = 20006,
    TRANSACTION_VERIFICATION_FAILED = 20007,
    TRANSACTION_DB_UPDATE_FAILED = 20008,
    INVALID_USER_WALLET = 20009,
    INVALID_SENDER_WALLET_KASPA_AMOUNT = 20010,
    LUNCHPAD_HAVE_OPEN_ORDERS = 20011,
    INVALID_WALLET_TYPE = 20012,
    WALLET_NOT_IN_WHITELIST = 20013,
    LUNCHPAD_WALLET_UNITS_EXCEEDS = 20014,

    INVALID_KASPA_AMOUNT = 30001,
    INVALID_BATCH_MINT_STATUS = 30002,
}

export const ERROR_MESSAGES: Record<ErrorCodes, string> = {
    [ErrorCodes.UNKNOWN_ERROR]: 'An unknown error has occurred.',
    [ErrorCodes.NOT_FOUND]: 'Resource not found.',

    [ErrorCodes.HIGH_PRIORITY_FEE]: 'Priority fee is too high.',

    [ErrorCodes.NOT_ENOUGH_KRC20_TOKENS]: "You don't have enough KRC20 tokens, Fund Tokens.",
    [ErrorCodes.INVALID_LUNCHPAD_STATUS]: 'Invalid lunchpad status.',
    [ErrorCodes.INVALID_LUNCHPAD_ORDER_STATUS]: 'Invalid lunchpad order status.',
    [ErrorCodes.INVALID_ORDER_UNITS]: 'The order units are invalid.',
    [ErrorCodes.LUNCHPAD_UNITS_EXCEEDS]: 'The units exceed the allowed limit.',
    [ErrorCodes.INVALID_ORDER_STATUS]: 'Invalid order status.',
    [ErrorCodes.TRANSACTION_VERIFICATION_FAILED]: 'Please verify the KAS was sent, if yes, then wait for tokens.',
    [ErrorCodes.TRANSACTION_DB_UPDATE_FAILED]: 'Failed to update transaction in the database.',
    [ErrorCodes.INVALID_USER_WALLET]: 'User wallet is invalid.',
    [ErrorCodes.INVALID_SENDER_WALLET_KASPA_AMOUNT]: 'The Launchpad wallet is missing Kaspa for Gas, Fund Gas.',
    [ErrorCodes.LUNCHPAD_HAVE_OPEN_ORDERS]: 'Lunchpad has open orders.',
    [ErrorCodes.INVALID_WALLET_TYPE]: 'The wallet type is invalid.',
    [ErrorCodes.WALLET_NOT_IN_WHITELIST]: 'The wallet is not in the whitelist.',
    [ErrorCodes.LUNCHPAD_WALLET_UNITS_EXCEEDS]: 'The wallet units exceed the allowed limit.',

    [ErrorCodes.INVALID_KASPA_AMOUNT]: 'Kaspa amount is invalid.',
    [ErrorCodes.INVALID_BATCH_MINT_STATUS]: 'Batch mint status is invalid.',
};

// Enums for Lunchpad and Order statuses

export enum LunchpadStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    NO_UNITS_LEFT = 'NO_UNITS_LEFT', // Temporary status when there are no units left, but orders are not yet final
    SOLD_OUT = 'SOLD_OUT',
    STOPPING = 'STOPPING',
}

export enum LunchpadOrderStatus {
    WAITING_FOR_KAS = 'WAITING_FOR_KAS',
    TOKENS_NOT_SENT = 'TOKENS_NOT_SENT',
    VERIFIED_AND_WAITING_FOR_PROCESSING = 'VERIFIED_AND_WAITING_FOR_PROCESSING',
    PROCESSING = 'PROCESSING',
    WAITING_FOR_LOW_FEE = 'WAITING_FOR_LOW_FEE',
    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR',
}

// Types for sorting, pagination, and filters in the getLunchpads request

export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export type GetLunchpadListFilters = {
    tickers?: string[];
    statuses?: LunchpadStatus[];
    ownerOnly?: boolean;
};

export type Sort = {
    field?: string;
    direction: SortDirection;
};

export type Pagination = {
    limit?: number;
    offset?: number;
};

export type GetLunchpadListParams = {
    filters?: GetLunchpadListFilters;
    sort?: Sort;
    pagination?: Pagination;
};

// Define type for `createLunchpadOrder` request
export type CreateLunchpadOrderParams = {
    ticker: string;
    kasPerUnit: number;
    tokenPerUnit: number;
    maxFeeRatePerTransaction?: number;
    minUnitsPerOrder?: number;
    maxUnitsPerOrder?: number;
    maxUnitsPerWallet?: number;
    useWhitelist?: boolean;
    whitelistWalletAddresses?: string[];
};

export enum LunchpadWalletType {
    RECEIVER = 'receiver',
    SENDER = 'sender',
}

export type ClientSideLunchpadWithStatus = {
    success: boolean;
    errorCode?: number;
    lunchpad: ClientSideLunchpad;
};

export type ClientSideLunchpadListItem = {
    id: string;
    ticker: string;
    availabeUnits: number;
    status: LunchpadStatus;
    kasPerUnit: number;
    tokenPerUnit: number;
    roundNumber: number;
    maxUnitsPerWallet?: number;
    useWhitelist?: boolean;
    totalUnits: number;
};

export type ClientSideLunchpadListWithStatus = {
    success: boolean;
    errorCode?: number;
    lunchpads: ClientSideLunchpadListItem[];
    totalCount?: number;
    allTickers?: string[];
};

export type ClientSideLunchpadOrderWithStatus = {
    success: boolean;
    errorCode?: number;
    lunchpad?: ClientSideLunchpad;
    lunchpadOrder: ClientSideLunchpadOrder;
};

export type ClientSideLunchpadOrder = {
    id: string;
    totalUnits: number;
    kasPerUnit: number;
    tokenPerUnit: number;
    status: LunchpadOrderStatus;
    createdAt: Date;
};
