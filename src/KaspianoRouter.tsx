import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import BatchTransferPage from './pages/batch-transfer-page/BatchTransferPage';
import ContactUs from './pages/compliance/ContactUs';
import PrivacyPolicy from './pages/compliance/PrivacyPolicy';
import TermsOfService from './pages/compliance/TermsOfService';
import TrustSafety from './pages/compliance/TrustSafety';
import DeployPage from './pages/deploy-page/DeployPage';
import GridPage from './pages/krc-20/GridPage';
import PortfolioPage from './pages/portfolio-page/PortfolioPage';
import TokenPage from './pages/token-page/TokenPage';
import { requestAccounts } from './utils/KaswareUtils';
import TermsOfTrade from './pages/compliance/TermsOfTrade';
import OrdersManagement from './pages/orders-management/OrdersManagement';
import TeamPage from './pages/team-page/MeetTheTeam';
import FAQ from './pages/faqs/Faqs';
import { UserReferral } from './types/Types';
// import AdsPage from './pages/ads-page/AdsPage';

interface KaspianoRouterProps {
    backgroundBlur: boolean;
    walletConnected: boolean;
    walletAddress: string;
    walletBalance: number;
    network: any;
    connectWallet: () => void;
    updateAndGetUserReferral: (referredBy?: string) => Promise<UserReferral> | null;
    userReferral: UserReferral | null;
    isUserReferralFinishedLoading: boolean;
}

export const KaspianoRouter: FC<KaspianoRouterProps> = ({
    backgroundBlur,
    walletConnected,
    walletAddress,
    walletBalance,
    network,
    connectWallet,
    isUserReferralFinishedLoading,
    updateAndGetUserReferral,
    userReferral,
}) => (
    <Routes>
        <Route
            path="/KRC-20"
            element={
                <GridPage
                    backgroundBlur={backgroundBlur}
                    walletConnected={walletConnected}
                    walletAddress={walletAddress}
                    walletBalance={walletBalance}
                />
            }
        />
        <Route
            path="/"
            element={
                <GridPage
                    backgroundBlur={backgroundBlur}
                    walletConnected={walletConnected}
                    walletAddress={walletAddress}
                    walletBalance={walletBalance}
                />
            }
        />
        <Route
            path="/token/:ticker"
            element={
                <TokenPage
                    backgroundBlur={backgroundBlur}
                    network={network}
                    walletAddress={walletAddress}
                    connectWallet={requestAccounts}
                    walletBalance={walletBalance}
                    walletConnected={walletConnected}
                />
            }
        />
        <Route
            path="/deploy"
            element={
                <DeployPage
                    walletBalance={walletBalance}
                    backgroundBlur={backgroundBlur}
                    walletConnected={walletConnected}
                    walletAddress={walletAddress}
                />
            }
        />
        <Route
            path="/portfolio"
            element={
                <PortfolioPage
                    walletBalance={walletBalance}
                    walletAddress={walletAddress}
                    backgroundBlur={backgroundBlur}
                    walletConnected={walletConnected}
                    connectWallet={connectWallet}
                    isUserReferralFinishedLoading={isUserReferralFinishedLoading}
                    updateAndGetUserReferral={updateAndGetUserReferral}
                    userReferral={userReferral}
                />
            }
        />
        <Route
            path="/airdrop"
            element={
                <BatchTransferPage
                    walletBalance={walletBalance}
                    walletAddress={walletAddress}
                    backgroundBlur={backgroundBlur}
                    walletConnected={walletConnected}
                />
            }
        />
        <Route path="/orders-management/:id" element={<OrdersManagement />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-service" element={<TermsOfService />} />
        <Route path="/trust-safety" element={<TrustSafety />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/trade-terms" element={<TermsOfTrade />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/faqs" element={<FAQ />} />
        {/* <Route path="/ads" element={<AdsPage />} /> */}
        <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
);
