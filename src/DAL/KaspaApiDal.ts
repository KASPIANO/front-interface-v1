import { getBalance } from '../utils/KaswareUtils';
import { kasInfoMainnetService, kasInfoService } from './AxiosInstaces';
import { delay } from '../utils/Utils';

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
