import { getBalance } from '../utils/KaswareUtils';
import { kasInfoMainnetService, kasInfoService } from './AxiosInstaces';
import { delay } from '../utils/Utils';

const KASPA_TRANSACTION_MASS = 3000;
const KRC20_TRANSACTION_MASS = 3370;
export const fetchWalletBalance = async (address: string): Promise<number> => {
    try {
        let balanceInKaspa;

        if (window.kasware && window.kasware.getBalance) {
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
export const kaspaFeeEstimate = async (): Promise<number> => {
    try {
        const response = await kasInfoMainnetService.get<{
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

export const gasEstimator = async (txType: 'KASPA' | 'TRANSFER'): Promise<number> => {
    try {
        const fee = await kaspaFeeEstimate();
        if (txType === 'KASPA') {
            return KASPA_TRANSACTION_MASS * fee;
        } else {
            return KRC20_TRANSACTION_MASS * fee;
        }
    } catch (error) {
        console.error('Error estimating gas:', error);
        return 0;
    }
};

export const getPriorityFee = async (txType: 'KASPA' | 'TRANSFER'): Promise<number | undefined> => {
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

            console.log(`Retrying in 3 seconds...`);
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
