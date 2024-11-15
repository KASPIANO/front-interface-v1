import { showGlobalSnackbar } from '../components/alert-context/AlertContext';
import { ERROR_MESSAGES, ErrorCodes } from '../types/Types';

export const handleLaunchpadError = (error: any) => {
    if (error.response && error.response.data && !error.response.data.success) {
        const { errorCode } = error.response.data;
        const errorMessage = ERROR_MESSAGES[errorCode as ErrorCodes] || ERROR_MESSAGES[ErrorCodes.UNKNOWN_ERROR];
        showGlobalSnackbar({ message: errorMessage, severity: 'error' });
    } else {
        showGlobalSnackbar({ message: 'An unexpected error occurred', severity: 'error' });
    }
};
