export enum Network {
    MAINNET = 'mainnet',
    TESTNET = 'testnet',
    DEVNET = 'devnet',
}

export const LOCAL_STORAGE_KEYS = {
    REFFERAL_CODE: 'referralCode',
    LAST_LOGGED_IN: 'lastLoggedIn',
};

export const DEFAULT_TOKEN_LOGO_URL = 'https://krc20data.s3.amazonaws.com/Grid-Default-Icon.png';

// Error codes with user-facing messages

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

    INVALID_KASPA_AMOUNT = 30001,
    INVALID_BATCH_MINT_STATUS = 30002,
}

export const ERROR_MESSAGES: Record<ErrorCodes, string> = {
    [ErrorCodes.UNKNOWN_ERROR]: 'An unknown error has occurred.',
    [ErrorCodes.NOT_FOUND]: 'Resource not found.',

    [ErrorCodes.HIGH_PRIORITY_FEE]: 'Priority fee is too high.',

    [ErrorCodes.NOT_ENOUGH_KRC20_TOKENS]: "You don't have enough KRC20 tokens.",
    [ErrorCodes.INVALID_LUNCHPAD_STATUS]: 'Invalid lunchpad status.',
    [ErrorCodes.INVALID_LUNCHPAD_ORDER_STATUS]: 'Invalid lunchpad order status.',
    [ErrorCodes.INVALID_ORDER_UNITS]: 'The order units are invalid.',
    [ErrorCodes.LUNCHPAD_UNITS_EXCEEDS]: 'The units exceed the allowed limit.',
    [ErrorCodes.INVALID_ORDER_STATUS]: 'Invalid order status.',
    [ErrorCodes.TRANSACTION_VERIFICATION_FAILED]: 'Transaction verification failed.',
    [ErrorCodes.TRANSACTION_DB_UPDATE_FAILED]: 'Failed to update transaction in the database.',
    [ErrorCodes.INVALID_USER_WALLET]: 'User wallet is invalid.',
    [ErrorCodes.INVALID_SENDER_WALLET_KASPA_AMOUNT]: 'The sender wallet Kaspa amount is invalid.',
    [ErrorCodes.LUNCHPAD_HAVE_OPEN_ORDERS]: 'Lunchpad has open orders.',
    [ErrorCodes.INVALID_WALLET_TYPE]: 'The wallet type is invalid.',

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
    ASC = 'ASC',
    DESC = 'DESC',
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
    maxFeeRatePerTransaction: number;
    minUnitsPerOrder?: number;
    maxUnitsPerOrder?: number;
};

export enum LunchpadWalletType {
    RECEIVER = 'receiver',
    SENDER = 'sender',
}
