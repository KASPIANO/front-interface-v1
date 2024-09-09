import { Container } from '@mui/material';

import BatchTransfer from '../../components/batch-transfer/BatchTransfer';
import { FC } from 'react';

// KasWare utility functions
export interface BatchTransferPageProps {
    walletConnected: boolean;
    backgroundBlur: boolean;
    walletAddress: string | null;
    walletBalance: number;
    setWalletBalance: (balance: number) => void;
}

const BatchTransferPage: FC<BatchTransferPageProps> = (props) => {
    const { walletConnected, backgroundBlur, walletAddress, setWalletBalance, walletBalance } = props;

    return (
        <Container
            sx={{
                width: '100%',
                filter: backgroundBlur ? 'blur(6px)' : 'none',
                transition: 'backdrop-filter 0.3s ease',
                marginBottom: '5vh',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <BatchTransfer
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                setWalletBalance={setWalletBalance}
                walletBalance={walletBalance}
            />
        </Container>
    );
};

export default BatchTransferPage;
