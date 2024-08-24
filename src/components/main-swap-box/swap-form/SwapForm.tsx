import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import React from 'react';
import { BalanceButtons, BalanceText } from '../../../pages/swap-page/SwapPage.s';
import { TokenResponse } from '../../../types/Types';
import CurrencyBox from '../currency-box/CurrencyBox';
import { BalanceInfo, Label, SwapButton, SwapContainer, SwitchButton } from './SwapForm.s';

interface SwapFormProps {
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
    tokens: TokenResponse[];
}

const SwapForm: React.FC<SwapFormProps> = (props) => {
    const {
        isPayingActive,
        paying,
        setPaying,
        receiving,
        setReceiving,
        walletAddress,
        walletBalance,
        receivingBalance,
        isConnecting,
        switchAssets,
        connectWallet,
        receivingCurrency,
        tokens,
    } = props;

    return (
        <SwapContainer>
            <Label>Sell</Label>
            <CurrencyBox tokens={[]} active={isPayingActive} paying={paying} setPaying={setPaying} />
            {walletAddress && (
                <BalanceInfo>
                    <BalanceText>
                        <i className="fas fa-wallet" /> Balance: {walletBalance} KAS
                    </BalanceText>
                    <BalanceButtons>
                        <button onClick={() => setPaying((walletBalance / 2).toString())}>HALF</button>
                        <button onClick={() => setPaying(walletBalance.toString())}>MAX</button>
                    </BalanceButtons>
                </BalanceInfo>
            )}
            <SwitchButton onClick={switchAssets}>
                <SwapHorizRoundedIcon />
            </SwitchButton>
            <Label>Buy</Label>
            <CurrencyBox tokens={tokens} active={false} paying={receiving} setPaying={setReceiving} />
            {walletAddress && receivingCurrency !== 'Select Token' && (
                <BalanceInfo>
                    <BalanceText>
                        <i className="fas fa-wallet" /> Balance: {receivingBalance} {receivingCurrency}
                    </BalanceText>
                </BalanceInfo>
            )}
            <SwapButton onClick={connectWallet} disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : walletAddress ? 'Swap' : 'Connect Wallet'}
            </SwapButton>
        </SwapContainer>
    );
};
export default SwapForm;
