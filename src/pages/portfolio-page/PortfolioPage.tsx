import { FC, useEffect, useState } from 'react';
import { PortfolioLayout } from './PortfolioPageLayout';
import UserProfile from '../../components/portfolio-page/user-profile/UserProfile';
import PortfolioPanel from '../../components/portfolio-page/portfolio-tab-panel/PortfolioPanel';
import { kaspaLivePrice } from '../../DAL/KaspaApiDal';
import { PortfolioValue, TokenRowPortfolioItem } from '../../types/Types';
import { fetchWalletKRC20Balance } from '../../DAL/Krc20DAL';
import { fetchTokenPortfolio } from '../../DAL/BackendDAL';

interface PortfolioPageProps {
    walletAddress: string | null;
    backgroundBlur: boolean;
    walletConnected: boolean;
    walletBalance: number;
}

const portfolioValue: PortfolioValue = {
    kas: 6089.56,
    change: 14.5,
    changeDirection: 'increase',
};

// export const mockTokenRowPortfolioItems: TokenRowPortfolioItem[] = [
//     {
//         ticker: 'KASPER',
//         balance: '1,200.50',
//         price: '0.032',
//         logoUrl: '/kasper.svg',
//     },
//     {
//         ticker: 'NACHO',
//         balance: '8,000.00',
//         price: '0.025',
//         logoUrl: '/nacho.svg',
//     },
//     {
//         ticker: 'KEKE',
//         balance: '5,500.75',
//         price: '0.015',
//         logoUrl: '/keke.jpg',
//     },
// ];

const PortfolioPage: FC<PortfolioPageProps> = (props) => {
    const { walletAddress, backgroundBlur, walletConnected, walletBalance } = props;
    const [kasPrice, setkasPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [portfolioAssetTickers, setPortfolioAssetTickers] = useState<string[]>([]);
    // const [portfolioAssetsActivity, setPortfolioAssetsActivity] = useState<string[]>([]);
    const [portfolioTokenInfo, setPortfolioTokenInfo] = useState<TokenRowPortfolioItem[]>([]);

    useEffect(() => {
        const fetchPrice = async () => {
            const newPrice = await kaspaLivePrice();
            setkasPrice(newPrice);
        };

        // Fetch the price immediately when the component mounts
        fetchPrice();

        // Set up the interval to fetch the price every 30 seconds
        const interval = setInterval(fetchPrice, 30000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            setIsLoading(true);
            try {
                const tokenData = await fetchWalletKRC20Balance(walletAddress);

                // Extract the tickers for later use in metadata fetch
                const tickers = tokenData.map((token) => token.ticker);
                const tickersPortfolio = await fetchTokenPortfolio(tickers);

                // Update tokenData with logo URLs
                const updatedTokenData = tokenData.map((token) => {
                    const logoInfo = tickersPortfolio.find((item) => item.ticker === token.ticker);
                    return {
                        ...token,
                        logoUrl: logoInfo ? logoInfo.logo : null,
                    };
                });

                setPortfolioAssetTickers(tickers);

                // Set the portfolio token info state
                setPortfolioTokenInfo(updatedTokenData);
                console.log(updatedTokenData);
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (walletConnected) {
            fetchPortfolioData();
        }
    }, [walletAddress, walletConnected]);

    return (
        <PortfolioLayout backgroundBlur={backgroundBlur}>
            <UserProfile walletAddress={walletAddress} portfolioValue={portfolioValue} kasPrice={kasPrice} />
            <PortfolioPanel
                walletBalance={walletBalance}
                isLoading={isLoading}
                tickers={portfolioAssetTickers}
                kasPrice={kasPrice}
                walletConnected={walletConnected}
                tokenList={portfolioTokenInfo}
            />
        </PortfolioLayout>
    );
};

export default PortfolioPage;
