import React, { FC } from 'react';
import Layout from '../../components/Layout';
import TradingViewChart from '../../components/trading-view/TradingViewChart';
import SwapBox from '../../components/limit-swap-box/LimitSwapBox';
import { Container } from './LimitOrder.s';

interface LimitOrderPageProps {
    walletAddress: string | null;
    connectWallet: () => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    walletBalance: number;
}

const LimitOrderPage: FC<LimitOrderPageProps> = ({
    walletAddress,
    connectWallet,
    darkMode,
    toggleDarkMode,
    walletBalance,
}) => (
    <Layout walletAddress={walletAddress} connectWallet={connectWallet} showBackgroundEffect={false}>
        <Container>
            <TradingViewChart />
            <SwapBox />
        </Container>
    </Layout>
);

export default LimitOrderPage;
