import { Container } from '@mui/material';

import BatchTransfer from '../../components/batch-transfer/BatchTransfer';
import { FC } from 'react';

// KasWare utility functions
export interface BatchTransferPageProps {
    walletConnected: boolean;
    backgroundBlur: boolean;
    walletAddress: string | null;
}

const BatchTransferPage: FC<BatchTransferPageProps> = (props) => {
    const { walletConnected, backgroundBlur, walletAddress } = props;

    return (
        <Container
            sx={{
                width: '90%',
                filter: backgroundBlur ? 'blur(6px)' : 'none',
                transition: 'backdrop-filter 0.3s ease',
                marginBottom: '5vh',
            }}
        >
            <BatchTransfer walletConnected={walletConnected} walletAddres={walletAddress} />
        </Container>
    );
};

export default BatchTransferPage;
