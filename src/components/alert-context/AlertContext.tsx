import React from 'react';
import { createRoot } from 'react-dom/client';
import { Snackbar, Slide, SlideProps, Box, Typography, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import { SpinningIcon } from './CustomSnackBar.s';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

type AlertSeverity = 'error' | 'success' | 'warning' | 'info' | 'loading';

interface AlertOptions {
    message: string;
    severity: AlertSeverity;
    details?: string;
    commit?: string;
    reveal?: string;
    kasware?: boolean;
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
    error: 8000,
    success: 8000,
    warning: 8000,
    info: 8000,
    loading: null,
};

let showSnackbar: (options: AlertOptions) => void;

// eslint-disable-next-line react-refresh/only-export-components
const SnackbarComponent: React.FC = () => {
    const [alert, setAlert] = React.useState<(AlertOptions & { open: boolean }) | null>(null);
    const [, setCopied] = React.useState(false);

    const currentEnv = import.meta.env.VITE_ENV === 'prod' ? 'kaspa_mainnet' : 'kaspa_testnet_10';
    const txnLink =
        currentEnv === 'kaspa_mainnet' ? 'https://kas.fyi/transaction/' : 'https://explorer-tn10.kaspa.org/txs/';
    showSnackbar = (options: AlertOptions) => {
        setAlert({ ...options, open: true });
    };

    const SlideTransition = (props: SlideProps) => <Slide {...props} direction="left" />;
    const handleClose = () => setAlert(null);

    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopied(true);
                showGlobalSnackbar({
                    message: 'Copied to clipboard',
                    severity: 'success',
                });
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
                            maxWidth: '600px',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {getIcon(alert.severity)}
                            <Typography
                                sx={{
                                    fontSize: '1rem',
                                    ml: 1,
                                    color: alertIconColors[alert.severity],
                                    fontWeight: 'bold',
                                }}
                            >
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
                        {alert.kasware && (
                            <Typography
                                sx={{
                                    fontSize: '1rem',
                                    color: alertIconColors[alert.severity],
                                    opacity: 0.8,
                                    fontWeight: 'bold',
                                }}
                            >
                                <a
                                    href="https://chromewebstore.google.com/detail/kasware-wallet/hklhheigdmpoolooomdihmhlpjjdbklf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', color: alertIconColors[alert.severity] }}
                                >
                                    Install Kasware Wallet Extension by clicking here
                                </a>
                            </Typography>
                        )}

                        {alert.commit && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: alertIconColors[alert.severity],
                                        opacity: 0.8,
                                        wordBreak: 'break-all',
                                        overflowWrap: 'break-word',
                                    }}
                                >
                                    Commit Txn:{' '}
                                    <a
                                        href={`${txnLink}${alert.commit}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', color: alertIconColors[alert.severity] }}
                                    >
                                        {alert.commit.slice(0, 10)}...
                                    </a>
                                </Typography>
                                <IconButton size="small" onClick={() => copyToClipboard(alert.commit)}>
                                    <ContentCopyRoundedIcon fontSize="small" />
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
                                        wordBreak: 'break-all',
                                        overflowWrap: 'break-word',
                                    }}
                                >
                                    Reveal Txn:{' '}
                                    <a
                                        href={`${txnLink}${alert.reveal}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', color: alertIconColors[alert.severity] }}
                                    >
                                        {alert.reveal.slice(0, 10)}...
                                    </a>
                                </Typography>
                                <IconButton size="small" onClick={() => copyToClipboard(alert.reveal)}>
                                    <ContentCopyRoundedIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Snackbar>
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
