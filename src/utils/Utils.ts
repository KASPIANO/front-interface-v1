import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import { getTxnInfo } from '../DAL/KaspaApiDal';
import { fetchTokenInfo } from '../DAL/Krc20DAL';

export enum ThemeModes {
    DARK = 'dark',
    LIGHT = 'light',
}
const KASPIANO_WALLET = import.meta.env.VITE_APP_KAS_WALLET_ADDRESS;

export function formatPrice(price, decimals = 7) {
    // First, format the price to the specified number of decimal places
    let formattedPrice = Number(price).toFixed(decimals);

    // Remove trailing zeros after the decimal point
    formattedPrice = formattedPrice.replace(/\.?0+$/, '');

    // If the formatted price ends with a decimal point, remove it
    if (formattedPrice.endsWith('.')) {
        formattedPrice = formattedPrice.slice(0, -1);
    }

    return formattedPrice;
}
export const getLocalThemeMode = () =>
    localStorage.getItem('theme_mode') ? (localStorage.getItem('theme_mode') as ThemeModes) : ThemeModes.DARK;

export const setWalletBalanceUtil = (balanceInKaspa: number) =>
    isNaN(balanceInKaspa) ? 0 : parseFloat(balanceInKaspa.toFixed(4));

export function simplifyNumber(value) {
    if (value >= 1e12) {
        return `${(value / 1e12).toFixed(0)}T`;
    } else if (value >= 1e9) {
        return `${(value / 1e9).toFixed(0)}B`;
    } else if (value >= 1e6) {
        return `${(value / 1e6).toFixed(0)}M`;
    } else if (value >= 1e3) {
        return `${(value / 1e3).toFixed(0)}K`;
    } else {
        return value?.toString().length <= 7 ? value : 'Value too BIG';
    }
}

export const formatNumberWithCommas = (value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const shortenAddress = (address, startLength = 6, endLength = 4) => {
    if (address.length <= startLength + endLength) {
        return address;
    }
    const start = address.substring(0, startLength);
    const end = address.substring(address.length - endLength);
    return `${start}...${end}`;
};

export const formatDate = (timestamp: string | number): string => moment(Number(timestamp)).format('DD/MM/YYYY');

export const capitalizeFirstLetter = (string: string): string => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const convertToProtocolFormat = (value: string): string => (parseFloat(value) * 1e8).toFixed(0);

export function generateNonce() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Function to generate a unique request ID
export function generateRequestId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const verifyPaymentTransaction = async (
    txnId: string,
    senderAddr: string,
    amount: number,
    receiverAddr = KASPIANO_WALLET,
): Promise<boolean> => {
    const txnInfo = await getTxnInfo(txnId);
    if (!txnInfo) {
        console.error('Transaction info not found.');
        return false;
    }

    // 1. Verify sender address
    const input = txnInfo.inputs.find((input: any) => input.previous_outpoint_address === senderAddr);

    if (!input) {
        console.error('Sender address not found in the inputs.');
        return false;
    }

    // 2. Verify the output amount and receiver address
    const output = txnInfo.outputs.find(
        (output: any) => output.amount === amount && output.script_public_key_address === receiverAddr,
    );

    if (!output) {
        console.error('Receiver address or amount mismatch in the outputs.');
        return false;
    }

    // If both checks pass
    return true;
};
export const isEmptyString = (value: string): boolean => !value || value.trim() === '';

export const isEmptyArray = <T>(value: T[]): boolean => !value || value.length === 0;

export const isEmptyStringOrArray = <T>(value: T | T[] | string): boolean => {
    if (Array.isArray(value)) {
        return isEmptyArray(value);
    }
    if (typeof value === 'string') {
        return isEmptyString(value);
    }
    return !value;
};

export const checkTokenExpiration = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return true; // Consider token expired if decoding fails
    }
};

export const checkTokenDeployment = async (ticker: string): Promise<boolean> => {
    const maxRetries = 5;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            console.log('Checking token deployment:', ticker, retryCount);
            const token = await fetchTokenInfo(ticker, true); // Make API call to check token info

            if (token && token.state === 'deployed') {
                return true; // Token is deployed
            }
        } catch (error) {
            console.error('Error fetching token info:', error);
        }

        retryCount++;
        if (retryCount < maxRetries) {
            await delay(5000); // Wait 5 seconds before the next attempt
        }
    }

    return false; // Token was not deployed after 5 attempts
};
