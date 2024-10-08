import React, { useState } from 'react';
import { Dialog, ThemeProvider } from '@mui/material';
import { createRoot } from 'react-dom/client';
import ReferralDialog from '../dialogs/referral/ReferralDialog';
import { ThemeContext } from '../../main';
import { darkTheme } from '../../theme/DarkTheme';
import { lightTheme } from '../../theme/LightTheme';
import { getLocalThemeMode, ThemeModes } from '../../utils/Utils';

interface DialogOptions {
    dialogType: 'referral' | null;
    dialogProps?: any;
}

let showDialog: (options: DialogOptions) => void;

// eslint-disable-next-line react-refresh/only-export-components
const DialogComponent: React.FC = () => {
    const [dialog, setDialog] = useState<DialogOptions>({ dialogType: null });
    const [themeMode, setThemeMode] = useState(getLocalThemeMode());

    const toggleThemeMode = () => {
        const newMode = themeMode === ThemeModes.DARK ? ThemeModes.LIGHT : ThemeModes.DARK;
        localStorage.setItem('theme_mode', newMode);
        setThemeMode(newMode);
    };

    showDialog = (options: DialogOptions) => {
        setDialog({ ...options });
    };

    const handleClose = () => {
        setDialog({ dialogType: null });
    };

    const renderDialogContent = () => {
        switch (dialog.dialogType) {
            case 'referral':
                return (
                    <ReferralDialog
                        open={true}
                        onClose={handleClose}
                        walletAddress={dialog.dialogProps.walletAddress}
                        userReferral={dialog.dialogProps.userReferral}
                        updateAndGetUserReferral={dialog.dialogProps.updateAndGetUserReferral}
                        mode={dialog.dialogProps.mode}
                    />
                );
            default:
                return null;
        }
    };

    return themeMode ? (
        <ThemeContext.Provider value={{ themeMode, toggleThemeMode }}>
            <ThemeProvider theme={themeMode === ThemeModes.DARK ? darkTheme : lightTheme}>
                {dialog.dialogType && (
                    <Dialog open={true} onClose={handleClose}>
                        {renderDialogContent()}
                    </Dialog>
                )}
            </ThemeProvider>
        </ThemeContext.Provider>
    ) : null;
};

const dialogDiv = document.createElement('div');
document.body.appendChild(dialogDiv);
const root = createRoot(dialogDiv);
root.render(<DialogComponent />);

export const showGlobalDialog = (options: DialogOptions) => {
    if (showDialog) {
        showDialog(options);
    }
};
