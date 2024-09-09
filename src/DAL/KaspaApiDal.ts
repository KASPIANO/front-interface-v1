import { getBalance } from '../utils/KaswareUtils';
import { kasInfoService } from './AxiosInstaces';

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
        const response = await kasInfoService.get<any>('info/price');
        return response.data.price;
    } catch (error) {
        console.error('Error fetching kaspa live price:', error);
        return 0;
    }
};

export const getTxnInfo = async (txnId: string): Promise<any> => {
    try {
        const response = await kasInfoService.get<any>(
            `transactions/${txnId}?inputs=true&outputs=true&resolve_previous_outpoints=light`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching transaction info:', error);
        return {};
    }
};
