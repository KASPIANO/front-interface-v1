/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Snackbar, Slide, SlideProps, Box, Typography, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import { SpinningIcon } from './CustomSnackBar.s';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type AlertSeverity = 'error' | 'success' | 'warning' | 'info' | 'loading';

interface AlertOptions {
    message: string;
    severity: AlertSeverity;
    details?: string;
    commit?: string;
    reveal?: string;
}

const alertColors = {
    error: '#FDEDED',
    success: '#EDF7ED',
    warning: '#FFF4E5',
    info: '#E5F6FD',
    loading: '#FFF4E5',
};

const alertIconColors = {
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#FBC02D',
    info: '#1976D2',
    loading: '#FBC02D',
};

const autoHideDuration = {
    error: 6000,
    success: 4000,
    warning: 8000,
    info: 4000,
    loading: null,
};

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="left" />;
}

let showSnackbar: (options: AlertOptions) => void;

const SnackbarComponent: React.FC = () => {
    const [alert, setAlert] = React.useState<(AlertOptions & { open: boolean }) | null>(null);
    const [copied, setCopied] = React.useState(false);

    showSnackbar = (options: AlertOptions) => {
        setAlert({ ...options, open: true });
    };

    const handleClose = () => setAlert(null);

    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
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
        <>
            {alert && (
                <Snackbar
                    open={alert.open}
                    autoHideDuration={autoHideDuration[alert.severity]}
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
        </>
    );
};

const snackbarDiv = document.createElement('div');
document.body.appendChild(snackbarDiv);
const root = createRoot(snackbarDiv);
root.render(<SnackbarComponent />);

export const showGlobalSnackbar = (options: AlertOptions) => {
    if (showSnackbar) {
        showSnackbar(options);
    }
};
