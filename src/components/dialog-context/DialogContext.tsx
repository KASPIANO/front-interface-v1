import React, { useState } from 'react';
import { Dialog, DialogActions, Button } from '@mui/material';
import { createRoot } from 'react-dom/client';
import ReferralDialog from '../dialogs/referral/ReferralDialog';

interface DialogOptions {
    dialogType: 'referral' | null;
    dialogProps?: any;
}

let showDialog: (options: DialogOptions) => void;

// eslint-disable-next-line react-refresh/only-export-components
const DialogComponent: React.FC = () => {
    const [dialog, setDialog] = useState<DialogOptions>({ dialogType: null });

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
                        referralCode={dialog.dialogProps.referralCode}
                        mode={dialog.dialogProps.mode}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            {dialog.dialogType && (
                <Dialog open={true} onClose={handleClose}>
                    {renderDialogContent()}
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
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
