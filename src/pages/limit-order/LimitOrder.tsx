import React, { FC } from 'react';
import TradingViewChart from '../../components/trading-view/TradingViewChart';
import SwapBox from '../../components/limit-swap-box/LimitSwapBox';
import { Container } from './LimitOrder.s';

interface LimitOrderPageProps {
    walletAddress: string | null;
    darkMode: boolean;
    toggleDarkMode: () => void;
    walletBalance: number;
}

const LimitOrderPage: FC<LimitOrderPageProps> = ({ walletAddress }) => (
    <Container>
        <TradingViewChart />
        <SwapBox />
    </Container>
);

export default LimitOrderPage;
