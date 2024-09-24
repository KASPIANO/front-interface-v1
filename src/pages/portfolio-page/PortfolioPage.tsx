import { FC, useEffect, useState } from 'react';
import { PortfolioLayout } from './PortfolioPageLayout';
import UserProfile from '../../components/portfolio-page/user-profile/UserProfile';
import PortfolioPanel from '../../components/portfolio-page/portfolio-tab-panel/PortfolioPanel';
import { kaspaLivePrice } from '../../DAL/KaspaApiDal';
import { TokenRowActivityItem, TokenRowPortfolioItem } from '../../types/Types';
import { fetchWalletActivity, fetchWalletKRC20TokensBalance } from '../../DAL/Krc20DAL';
import { fetchTokenPortfolio } from '../../DAL/BackendDAL';

interface PortfolioPageProps {
    walletAddress: string | null;
    backgroundBlur: boolean;
    walletConnected: boolean;
    walletBalance: number;
}

// const portfolioValue: PortfolioValue = {
//     kas: 6089.56,
//     change: 14.5,
//     changeDirection: 'increase',
// };

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
    const [isLoadingActivity, setIsLoadingActivity] = useState<boolean>(false);
    const [portfolioAssetTickers, setPortfolioAssetTickers] = useState<string[]>([]);
    const [portfolioAssetsActivity, setPortfolioAssetsActivity] = useState<TokenRowActivityItem[]>([]);
    const [portfolioTokenInfo, setPortfolioTokenInfo] = useState<TokenRowPortfolioItem[]>([]);
    const [paginationActivityKey, setPaginationActivityKey] = useState<string | null>(null);
    const [paginationActivityDirection, setPaginationActivityDirection] = useState<'next' | 'prev' | null>(null);
    const [activityNext, setActivityNext] = useState<string | null>(null);
    const [activityPrev, setActivityPrev] = useState<string | null>(null);
    const [paginationPortfolioKey, setPaginationPortfolioKey] = useState<string | null>(null);
    const [paginationPortfolioDirection, setPaginationPortfolioDirection] = useState<'next' | 'prev' | null>(null);
    const [portfolioNext, setPortfolioNext] = useState<string | null>(null);
    const [portfolioPrev, setPortfolioPrev] = useState<string | null>(null);
    const [lastActivityPage, setLastActivityPage] = useState<boolean>(false);
    const [lastPortfolioPage, setLastPortfolioPage] = useState<boolean>(false);
    const [operationFinished, setOperationFinished] = useState<boolean>(false);
    const [portfolioValueKAS, setPortfolioValueKAS] = useState<number>(0);
    const [currentWallet, setCurrentWallet] = useState<string>(walletAddress || '');
    const isUserConnected = walletConnected || !!currentWallet;
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
                const tokenData = await fetchWalletKRC20TokensBalance(
                    currentWallet,
                    paginationPortfolioKey,
                    paginationPortfolioDirection,
                );

                // Extract the tickers for later use in metadata fetch
                const tickers = tokenData.portfolioItems.map((token) => token.ticker);
                const tickersPortfolio = await fetchTokenPortfolio(tickers);
                let totalPortfolioValue = 0;
                // Update tokenData with logo URLs
                const updatedTokenData = tokenData.portfolioItems.map((token) => {
                    const tokenInfo = tickersPortfolio.find((item) => item.ticker === token.ticker);
                    const portfolioValue = parseInt(token.balance) * (tokenInfo ? tokenInfo.price : 0);
                    totalPortfolioValue += portfolioValue;
                    return {
                        ...token,
                        state: tokenInfo ? tokenInfo.state : null,
                        logoUrl: tokenInfo ? tokenInfo.logo : null,
                        price: tokenInfo ? tokenInfo.price : 0,
                    };
                });

                setPortfolioAssetTickers(tickers);
                setPortfolioValueKAS(totalPortfolioValue);
                // Set the portfolio token info state
                setPortfolioTokenInfo(updatedTokenData);
                setPortfolioNext(tokenData.next); // Save the 'next' key for further requests
                setPortfolioPrev(tokenData.prev); // Save the 'prev' key for further requests
                const checkNext = await fetchWalletKRC20TokensBalance(currentWallet, tokenData.next, 'next');
                if (checkNext.portfolioItems.length === 0) {
                    setLastPortfolioPage(true);
                } else {
                    setLastPortfolioPage(false);
                }
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isUserConnected) {
            fetchPortfolioData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletConnected, operationFinished, paginationPortfolioKey, currentWallet]);

    useEffect(() => {
        const fetchActivity = async () => {
            setIsLoadingActivity(true);
            try {
                const activityData = await fetchWalletActivity(
                    currentWallet,
                    paginationActivityKey,
                    paginationActivityDirection,
                );
                setPortfolioAssetsActivity(activityData.activityItems);
                setActivityNext(activityData.next); // Save the 'next' key for further requests
                setActivityPrev(activityData.prev); // Save the 'prev' key for further requests
                const checkNext = await fetchWalletActivity(currentWallet, activityData.next, 'next');
                if (checkNext.activityItems.length === 0) {
                    setLastActivityPage(true);
                } else {
                    setLastActivityPage(false);
                }
            } catch (error) {
                console.error('Error fetching activity data:', error);
            } finally {
                setIsLoadingActivity(false);
            }
        };

        if (isUserConnected) {
            fetchActivity();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWallet, walletConnected, paginationActivityKey, operationFinished]);

    const handleActivityPagination = (direction: 'next' | 'prev') => {
        setPortfolioAssetsActivity([]);
        setPaginationActivityDirection(direction);
        setPaginationActivityKey(direction === 'next' ? activityNext : activityPrev);
    };

    const handlePortfolioPagination = (direction: 'next' | 'prev') => {
        setPortfolioTokenInfo([]);
        setPaginationPortfolioDirection(direction);
        setPaginationPortfolioKey(direction === 'next' ? portfolioNext : portfolioPrev);
    };

    const handleChange = () => {
        setTimeout(() => {
            setOperationFinished((prev) => !prev);
            console.log('Operation finished', operationFinished);
        }, 11000); // 5000 milliseconds = 5 seconds
    };

    return (
        <PortfolioLayout backgroundBlur={backgroundBlur}>
            <UserProfile
                walletAddress={currentWallet}
                portfolioValue={portfolioValueKAS}
                kasPrice={kasPrice}
                setWalletAddress={setCurrentWallet}
            />
            <PortfolioPanel
                handleChange={handleChange}
                handleActivityPagination={handleActivityPagination}
                handlePortfolioPagination={handlePortfolioPagination}
                lastPortfolioPage={lastPortfolioPage}
                lastActivityPage={lastActivityPage}
                walletBalance={walletBalance}
                isLoading={isLoading}
                isLoadingActivity={isLoadingActivity}
                kasPrice={kasPrice}
                walletConnected={isUserConnected}
                tokenList={portfolioTokenInfo}
                tokensActivityList={portfolioAssetsActivity}
                tickers={portfolioAssetTickers}
            />
        </PortfolioLayout>
    );
};

export default PortfolioPage;
