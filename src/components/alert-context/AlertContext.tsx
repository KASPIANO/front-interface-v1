import { createContext, useState, FC, ReactNode } from 'react';
import { Snackbar, Slide, SlideProps, Box, Typography, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import { SpinningIcon } from './CustomSnackBar.s';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export type AlertSeverity = 'error' | 'loading' | 'info' | 'success';
export type AlertContextType = {
    showAlert: (
        message: string,
        severity: AlertSeverity,
        details?: string,
        commit?: string,
        reveal?: string,
    ) => void;
};

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

const alertColors = {
    error: '#FDEDED', // Light red
    success: '#EDF7ED', // Light green
    warning: '#FFF4E5', // Light yellow
    info: '#E5F6FD', // Light blue
    loading: '#FFF4E5', // Using warning color for loading
};

const alertIconColors = {
    error: '#D32F2F', // Dark red
    success: '#388E3C', // Dark green
    warning: '#FBC02D', // Dark yellow
    info: '#1976D2', // Dark blue
    loading: '#FBC02D', // Using warning color for loading
};

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="left" />;
}

export const AlertProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<{
        message: string;
        severity: AlertSeverity;
        details?: string;
        commit?: string;
        reveal?: string;
        open: boolean;
    } | null>(null);
    const [copied, setCopied] = useState(false);

    const showAlert = (
        message: string,
        severity: AlertSeverity,
        details?: string,
        commit?: string,
        reveal?: string,
    ) => {
        setAlert({ message, severity, details, commit, reveal, open: true });
    };

    const handleClose = () => setAlert(null);

    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Hide the message after 2 seconds
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    const getIcon = (severity: AlertSeverity) => {
        switch (severity) {
            case 'loading':
                return <SpinningIcon sx={{ color: alertIconColors[severity] }} />;
            case 'success':
                return <CheckCircleOutlineIcon sx={{ color: alertIconColors[severity] }} />;
            case 'info':
                return <PrivacyTipIcon sx={{ color: alertIconColors[severity] }} />;
            case 'error':
                return <ErrorOutlineIcon sx={{ color: alertIconColors[severity] }} />;
            default:
                return <CheckCircleOutlineIcon sx={{ color: alertIconColors.success }} />;
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alert && (
                <Snackbar
                    open={alert.open}
                    autoHideDuration={alert.severity === 'loading' ? 4000 : 10000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ marginTop: '64px' }}
                    TransitionComponent={SlideTransition}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: alertColors[alert.severity],
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            maxWidth: '400px',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {getIcon(alert.severity)}
                            <Typography sx={{ ml: 1, color: alertIconColors[alert.severity], fontWeight: 'bold' }}>
                                {alert.message}
                            </Typography>
                        </Box>
                        {alert.details && (
                            <Typography
                                sx={{ fontSize: '0.875rem', color: alertIconColors[alert.severity], opacity: 0.8 }}
                            >
                                {alert.details}
                            </Typography>
                        )}
                        {alert.commit && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: alertIconColors[alert.severity],
                                        opacity: 0.8,
                                    }}
                                >
                                    Commit Txn: {alert.commit.slice(0, 10)}...
                                </Typography>
                                <IconButton size="small" onClick={() => copyToClipboard(alert.commit)}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                        {alert.reveal && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Typography
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: alertIconColors[alert.severity],
                                        opacity: 0.8,
                                    }}
                                >
                                    Reveal Txn: {alert.reveal.slice(0, 10)}...
                                </Typography>
                                <IconButton size="small" onClick={() => copyToClipboard(alert.reveal)}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Snackbar>
            )}
            {copied && (
                <Snackbar
                    sx={{
                        backgroundColor: '#EDF7ED',
                    }}
                    open={copied}
                    autoHideDuration={2000}
                    onClose={() => setCopied(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    message="Copied to clipboard!"
                />
            )}
        </AlertContext.Provider>
    );
};
