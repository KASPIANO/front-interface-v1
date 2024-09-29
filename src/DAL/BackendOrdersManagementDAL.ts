import { backendService } from './AxiosInstaces';

const CONTROLLER = 'orders-management';

export const getOrdersManagementOrder = async (orderId: string): Promise<any> => {
    const response = await backendService.get<any>(`/${CONTROLLER}/order/${orderId}`);
    return response.data;
};

export const updateOrdersManagementSellOrder = async (orderId: string, data: any): Promise<any> => {
    const response = await backendService.post<any>(`/${CONTROLLER}/order/${orderId}`, data);
    return response.data;
};

export const revealPrivateKey = async (orderId: string, password: string): Promise<any> => {
    const response = await backendService.post<any>(`/${CONTROLLER}/order/${orderId}/private`, { password });
    return response.data;
};
