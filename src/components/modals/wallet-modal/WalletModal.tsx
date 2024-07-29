import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import React from 'react';
import {
    HorizontalLine,
    InstallLink,
    LinkButton,
    Logo,
    ModalButton,
    ModalContent,
    ModalOverlay,
    ModalText,
    ModalTitle,
    SubText,
} from './WalletModal.s';

interface WalletModalProps {
    onClose: () => void;
    children?: React.ReactNode;
}

const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => (
    <ModalOverlay>
        <ModalContent>
            <ModalTitle style={{ textAlign: 'left', fontSize: '16px', fontWeight: '500' }}>
                Connect Wallet
            </ModalTitle>
            <ModalText
                style={{
                    textAlign: 'left',
                    marginTop: '-5px',
                    fontSize: '12px',
                    color: '#999fa6',
                }}
            >
                You need to connect a Kaspa wallet.
            </ModalText>
            <HorizontalLine />
            <Logo src="/kasware.png" alt="KasWare Logo" />
            <ModalText style={{ fontWeight: '800' }}>Have you installed KasWare?</ModalText>
            <InstallLink
                href="https://chromewebstore.google.com/detail/kasware-wallet/hklhheigdmpoolooomdihmhlpjjdbklf?hl=en"
                target="_blank"
                rel="noopener noreferrer"
            >
                Install KasWare <LaunchRoundedIcon style={{ fontSize: '12px', paddingTop: '2px' }} />
            </InstallLink>
            <SubText style={{ textAlign: 'left', fontWeight: '900' }}>On mobile:</SubText>
            <ModalText>
                <li style={{ fontSize: '13px' }}>(Coming Soon)</li>
            </ModalText>
            <SubText style={{ textAlign: 'left', fontWeight: '900' }}>On desktop:</SubText>
            <ModalText style={{ marginBottom: '30px' }}>
                <li style={{ fontSize: '13px' }}>Install and refresh the page</li>
            </ModalText>
            <HorizontalLine />
            <LinkButton
                href="https://chromewebstore.google.com/detail/kasware-wallet/hklhheigdmpoolooomdihmhlpjjdbklf?hl=en"
                target="_blank"
                rel="noopener noreferrer"
            >
                I don&apos;t have a wallet
            </LinkButton>
            <ModalButton onClick={onClose}>Close</ModalButton>
        </ModalContent>
    </ModalOverlay>
);

export default WalletModal;
