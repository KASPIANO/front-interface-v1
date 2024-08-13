import React, { ReactNode } from 'react';
import styled from 'styled-components';
import BackgroundEffect from './background-effect/BackgroundEffect';
import Footer from './footer/Footer';
import MiniNavbar from './mini-navbar/MiniNavbar';
import Navbar from './navbar/Navbar';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    min-height: 100vh;
    width: 100%;
`;

const Main = styled.main`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    flex-grow: 1;
    z-index: 2;
`;

// const tokens = [
//     { name: 'Kaspa', symbol: 'KAS', logoURI: '/kaspa.svg' },
//     { name: 'TokenA', symbol: 'TKA', logoURI: '/tokenA.svg' },
// ];

interface LayoutProps {
    children: ReactNode;
    walletAddress: string | null;
    connectWallet: () => void;
    showBackgroundEffect: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, walletAddress, connectWallet, showBackgroundEffect }) => (
    <Container>
        <Navbar
            walletAddress={walletAddress}
            connectWallet={connectWallet}
            tokensList={[]}
            network={''}
            onNetworkChange={() => {
                console.log('nana');
            }}
        />
        <MiniNavbar />
        {showBackgroundEffect && <BackgroundEffect />}
        <Main>{children}</Main>
        <Footer />
    </Container>
);

export default Layout;
