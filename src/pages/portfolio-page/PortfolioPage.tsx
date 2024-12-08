import { FC, useEffect, useState } from 'react';
import { PortfolioLayout } from './PortfolioPageLayout';
import UserProfile from '../../components/portfolio-page/user-profile/UserProfile';
import PortfolioPanel from '../../components/portfolio-page/portfolio-tab-panel/PortfolioPanel';
import { kaspaLivePrice } from '../../DAL/KaspaApiDal';
import { TokenRowPortfolioItem, UserReferral } from '../../types/Types';
import { fetchWalletKRC20TokensBalance } from '../../DAL/Krc20DAL';
import { fetchTokenPortfolio } from '../../DAL/BackendDAL';
import { isEmptyString } from '../../utils/Utils';

interface PortfolioPageProps {
    walletAddress: string | null;
    backgroundBlur: boolean;
    walletConnected: boolean;
    walletBalance: number;
    connectWallet: () => void;
    updateAndGetUserReferral: (referredBy?: string) => Promise<UserReferral> | null;
    userReferral: UserReferral | null;
    isUserReferralFinishedLoading: boolean;
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
    const {
        walletAddress,
        backgroundBlur,
        walletConnected,
        walletBalance,
        connectWallet,
        updateAndGetUserReferral,
        isUserReferralFinishedLoading,
        userReferral,
    } = props;
    const [kasPrice, setkasPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [portfolioAssetTickers, setPortfolioAssetTickers] = useState<string[]>([]);
    const [portfolioTokenInfo, setPortfolioTokenInfo] = useState<TokenRowPortfolioItem[]>([]);

    const [paginationPortfolioKey, setPaginationPortfolioKey] = useState<string | null>(null);
    const [paginationPortfolioDirection, setPaginationPortfolioDirection] = useState<'next' | 'prev' | null>(null);
    const [portfolioNext, setPortfolioNext] = useState<string | null>(null);
    const [portfolioPrev, setPortfolioPrev] = useState<string | null>(null);
    const [lastPortfolioPage, setLastPortfolioPage] = useState<boolean>(false);
    const [operationFinished, setOperationFinished] = useState<boolean>(false);
    const [portfolioValueKAS, setPortfolioValueKAS] = useState<number>(0);
    const [currentWalletToCheck, setCurrentWalletToCheck] = useState<string>('');
    const [isUserConnected, setIsUserConnected] = useState<boolean>(false);

    useEffect(() => {
        // Update currentWalletToCheck when walletAddress changes
        setCurrentWalletToCheck(null);

        // Update isUserConnected when either walletConnected or currentWalletToCheck changes
        setIsUserConnected(walletConnected || !!walletAddress);
    }, [walletAddress, walletConnected]);

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
                    walletConnected ? walletAddress : currentWalletToCheck,
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
                    const portfolioValue = parseInt(token.balance) * (tokenInfo.price ? tokenInfo?.price : 0);
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
                const checkNext = await fetchWalletKRC20TokensBalance(
                    currentWalletToCheck,
                    tokenData.next,
                    'next',
                );
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

        if ((isUserConnected && !isEmptyString(walletAddress)) || !isEmptyString(currentWalletToCheck)) {
            fetchPortfolioData();
        }
    }, [
        walletConnected,
        operationFinished,
        paginationPortfolioKey,
        currentWalletToCheck,
        isUserConnected,
        walletAddress,
        paginationPortfolioDirection,
    ]);

    const handlePortfolioPagination = (direction: 'next' | 'prev') => {
        setPortfolioTokenInfo([]);
        setPaginationPortfolioDirection(direction);
        setPaginationPortfolioKey(direction === 'next' ? portfolioNext : portfolioPrev);
    };

    const handleChange = () => {
        setTimeout(() => {
            setOperationFinished((prev) => !prev);
        }, 11000); // 5000 milliseconds = 5 seconds
    };

    return (
        <PortfolioLayout backgroundBlur={backgroundBlur}>
            <UserProfile
                walletAddress={walletAddress}
                currentWalletToCheck={currentWalletToCheck}
                portfolioValue={portfolioValueKAS}
                kasPrice={kasPrice}
                setCurrentWalletToCheck={setCurrentWalletToCheck}
                connectWallet={connectWallet}
                isUserReferralFinishedLoading={isUserReferralFinishedLoading}
                updateAndGetUserReferral={updateAndGetUserReferral}
                userReferral={userReferral}
            />
            <PortfolioPanel
                isLoading={isLoading}
                operationFinished={operationFinished}
                handleChange={handleChange}
                handlePortfolioPagination={handlePortfolioPagination}
                lastPortfolioPage={lastPortfolioPage}
                walletBalance={walletBalance}
                kasPrice={kasPrice}
                walletConnected={isUserConnected}
                tokenList={portfolioTokenInfo}
                tickers={portfolioAssetTickers}
                walletAddress={walletAddress}
                currentWalletToCheck={currentWalletToCheck}
            />
        </PortfolioLayout>
    );
};

export default PortfolioPage;
