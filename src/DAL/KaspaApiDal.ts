import { getBalance } from '../utils/KaswareUtils';
import { fyiLogoService, kasInfoMainnetService, kasInfoService } from './AxiosInstaces';
import { delay } from '../utils/Utils';

const KASPA_TRANSACTION_MASS = 3000;
const KRC20_TRANSACTION_MASS = 3370;
const TRADE_TRANSACTION_MASS = 11000;
const CANCEL_LIMIT_KAS = 0.5;
const WARNING_LIMIT_KAS = 0.2;
export const fetchWalletBalance = async (address: string, user = true): Promise<number> => {
    try {
        let balanceInKaspa;

        if (window.kasware && window.kasware.getBalance && user) {
            const balance = await getBalance();
            balanceInKaspa = balance.total / 1e8;
        } else {
            const response = await kasInfoService.get<any>(`addresses/${address}/balance`);
            balanceInKaspa = response.data.balance / 1e8;
        }
        return balanceInKaspa;
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return 0;
    }
};

export const kaspaLivePrice = async (): Promise<number> => {
    try {
        const response = await kasInfoMainnetService.get<any>('info/price');
        return response.data.price;
    } catch (error) {
        console.error('Error fetching kaspa live price:', error);
        return 0;
    }
};
export const kaspaTradeFeeEstimate = async (): Promise<number> => {
    try {
        const response = await kasInfoService.get<{
            priorityBucket: {
                feerate: number;
                estimatedSeconds: number;
            };
            normalBuckets: Array<{
                feerate: number;
                estimatedSeconds: number;
            }>;
            lowBuckets: Array<{
                feerate: number;
                estimatedSeconds: number;
            }>;
        }>('info/fee-estimate');

        // Extract the feerate from the priorityBucket
        const feeRate = response.data.priorityBucket.feerate;
        return feeRate;
    } catch (error) {
        console.error('Error fetching kaspa fee estimate:', error);
        return 0;
    }
};
export const feeEstimate = async (): Promise<any> => {
    try {
        const response = await kasInfoService.get<{
            priorityBucket: {
                feerate: number;
                estimatedSeconds: number;
            };
            normalBuckets: Array<{
                feerate: number;
                estimatedSeconds: number;
            }>;
            lowBuckets: Array<{
                feerate: number;
                estimatedSeconds: number;
            }>;
        }>('info/fee-estimate');

        // Extract the feerate from the priorityBucket
        return response.data;
    } catch (error) {
        console.error('Error fetching kaspa fee estimate:', error);
        return 0;
    }
};
export const kaspaFeeEstimate = async (): Promise<number> => {
    try {
        const response = await kasInfoService.get<{
            priorityBucket: {
                feerate: number;
                estimatedSeconds: number;
            };
            normalBuckets: Array<{
                feerate: number;
                estimatedSeconds: number;
            }>;
            lowBuckets: Array<{
                feerate: number;
                estimatedSeconds: number;
            }>;
        }>('info/fee-estimate');

        // Extract the feerate from the priorityBucket
        const feeRate = response.data.lowBuckets[0].feerate;

        return feeRate;
    } catch (error) {
        console.error('Error fetching kaspa fee estimate:', error);
        return 0;
    }
};

export const gasEstimator = async (txType: 'KASPA' | 'TRANSFER' | 'TRADE'): Promise<number> => {
    try {
        let fee;
        if (txType === 'TRADE') {
            fee = await kaspaTradeFeeEstimate();
        } else {
            fee = await kaspaFeeEstimate();
        }
        if (txType === 'KASPA') {
            return KASPA_TRANSACTION_MASS * fee;
        } else if (txType === 'TRANSFER') {
            return KRC20_TRANSACTION_MASS * fee;
        } else {
            return TRADE_TRANSACTION_MASS * fee;
        }
    } catch (error) {
        console.error('Error estimating gas:', error);
        return 0;
    }
};

export const getPriorityFee = async (txType: 'KASPA' | 'TRANSFER' | 'TRADE'): Promise<number | undefined> => {
    try {
        let priorityFee = await kaspaFeeEstimate();

        if (priorityFee === 1) {
            return undefined; // If priorityFee is 1, return undefined or empty
        } else {
            priorityFee = await gasEstimator(txType); // Get the actual fee from gasEstimator
            return priorityFee;
        }
    } catch (error) {
        console.error('Error calculating priority fee:', error);
        return undefined; // Fallback in case of error
    }
};

export const getTxnInfo = async (txnId: string, maxRetries = 3): Promise<any> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await kasInfoService.get<any>(
                `transactions/${txnId}?inputs=true&outputs=true&resolve_previous_outpoints=light`,
            );
            return response.data;
        } catch (error) {
            console.error(`Error fetching transaction info (attempt ${attempt}/${maxRetries}):`, error);

            if (attempt === maxRetries) {
                console.error('Max retries reached. Returning empty object.');
                return {};
            }

            await delay(3000); // Wait for 3 seconds before the next attempt
        }
    }
};

export const getWalletLastTransactions = async (
    walletAddress: string = null,
    limit = 10,
    offset = 0,
): Promise<any> => {
    const response = await kasInfoService.get<any>(
        `addresses/${walletAddress}/full-transactions?limit=${limit}&offset=${offset}&resolve_previous_outpoints=no`,
        {
            timeout: 2 * 60 * 1000,
        },
    );

    return response.data;
};

export const highGasLimitExceeded = async () => {
    const priorityFeeSompi = await getPriorityFee('TRADE');
    if (!priorityFeeSompi) return false;
    const kaspaPriorityFee = priorityFeeSompi / 1e8;
    if (kaspaPriorityFee > CANCEL_LIMIT_KAS) {
        return true;
    } else {
        return false;
    }
};

export const highGasWarning = async (type: 'TRANSFER' | '' = '') => {
    const typeCheck = type === 'TRANSFER' ? 'TRANSFER' : 'TRADE';
    const priorityFeeSompi = await getPriorityFee(typeCheck);
    if (!priorityFeeSompi) return false;

    const kaspaPriorityFee = priorityFeeSompi / 1e8;

    if (type === 'TRANSFER') {
        // For TRANSFER type, just check if priority fee is greater than WARNING_LIMIT_KAS
        return kaspaPriorityFee > WARNING_LIMIT_KAS;
    }

    // For other types, check if the priority fee is between WARNING_LIMIT_KAS and CANCEL_LIMIT_KAS
    return WARNING_LIMIT_KAS < kaspaPriorityFee && kaspaPriorityFee < CANCEL_LIMIT_KAS;
};

export const getFyiLogo = async (ticker: string): Promise<any> => {
    try {
        const jpgString = `${ticker}.jpg`;
        const response = await fyiLogoService.get<any>(`${jpgString}`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching token logo:', error);
        return '';
    }
};
