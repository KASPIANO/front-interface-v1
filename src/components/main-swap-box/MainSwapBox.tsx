import React from 'react';

import { Box } from '@mui/material';
import { Token, TokenResponse } from '../../types/Types';
import SlippageControl from './box-settings/BoxSettings';
import SwapForm from './swap-form/SwapForm';

interface MainSwapBoxProps {
    isPayingActive: boolean;
    paying: string;
    setPaying: (value: string) => void;
    payingCurrency: string;
    payingCurrencyImage: string;
    receiving: string;
    setReceiving: (value: string) => void;
    receivingCurrency: string;
    receivingCurrencyImage: string | null;
    walletAddress: string | null;
    walletBalance: number;
    receivingBalance: number;
    isConnecting: boolean;
    switchAssets: () => void;
    connectWallet: () => void;
    openTokenModal: (isPaying: boolean) => void;
    slippageMode: string;
    slippageValue: string;
    openSlippageModal: () => void;
    handleTokenSelect: (token: Token) => void;
    closeTokenModal: () => void;
    handleSlippageSave: (mode: string, value: string) => void;
    tokens: TokenResponse[];
}

const MainSwapBox: React.FC<MainSwapBoxProps> = ({
    isPayingActive,
    paying,
    setPaying,
    payingCurrency,
    payingCurrencyImage,
    receiving,
    setReceiving,
    receivingCurrency,
    receivingCurrencyImage,
    walletAddress,
    walletBalance,
    receivingBalance,
    isConnecting,
    switchAssets,
    connectWallet,
    openTokenModal,
    slippageMode,
    slippageValue,
    openSlippageModal,
    tokens,
}) => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
    >
        <SlippageControl
            slippageMode={slippageMode}
            slippageValue={slippageValue}
            openSlippageModal={openSlippageModal}
        />
        <SwapForm
            isPayingActive={isPayingActive}
            paying={paying}
            setPaying={setPaying}
            payingCurrency={payingCurrency}
            payingCurrencyImage={payingCurrencyImage}
            receiving={receiving}
            setReceiving={setReceiving}
            receivingCurrency={receivingCurrency}
            receivingCurrencyImage={receivingCurrencyImage}
            walletAddress={walletAddress}
            walletBalance={walletBalance}
            receivingBalance={receivingBalance}
            isConnecting={isConnecting}
            switchAssets={switchAssets}
            connectWallet={connectWallet}
            openTokenModal={openTokenModal}
            tokens={tokens}
        />
    </Box>
);

export default MainSwapBox;
