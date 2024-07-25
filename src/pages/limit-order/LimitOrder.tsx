import { FC } from 'react';
import Layout from '../../components/Layout';
import SwapBox from '../../components/limit-swap-box/LimitSwapBox';
import TradingViewChart from '../../components/trading-view/TradingViewChart';
import { Container } from './LimitOrder.s';

interface LimitOrderPageProps {
    walletAddress: string | null;
    connectWallet: () => void;
    walletBalance: number;
}

const LimitOrderPage: FC<LimitOrderPageProps> = ({ walletAddress, connectWallet, walletBalance }) => (
    <Layout walletAddress={walletAddress} connectWallet={connectWallet} showBackgroundEffect={false}>
        <Container>
            <TradingViewChart />
            <SwapBox />
        </Container>
    </Layout>
);

export default LimitOrderPage;
