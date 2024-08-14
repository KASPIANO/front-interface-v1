import { FC, useEffect, useState } from 'react';
import { PortfolioLayout } from './PortfolioPageLayout';
import UserProfile from '../../components/portfolio-page/user-profile/UserProfile';
import PortfolioPanel from '../../components/portfolio-page/portfolio-tab-panel/PortfolioPanel';
import { kaspaLivePrice } from '../../DAL/KaspaApiDal';
import { PortfolioValue, TokenRowPortfolioItem } from '../../types/Types';

interface PortfolioPageProps {
    walletAddress: string | null;
    backgroundBlur: boolean;
    walletConnected: boolean;
}

const portfolioValue: PortfolioValue = {
    kas: 6089.56,
    change: 14.5,
    changeDirection: 'increase',
};

const mockTokenRowPortfolioItems: TokenRowPortfolioItem[] = [
    {
        ticker: 'KASPER',
        balance: '1,200.50',
        price: '0.032',
        logoUrl: '/kasper.svg',
    },
    {
        ticker: 'NACHO',
        balance: '8,000.00',
        price: '0.025',
        logoUrl: '/nacho.svg',
    },
    {
        ticker: 'KEKE',
        balance: '5,500.75',
        price: '0.015',
        logoUrl: '/keke.jpg',
    },
];

const PortfolioPage: FC<PortfolioPageProps> = (props) => {
    const { walletAddress, backgroundBlur, walletConnected } = props;
    const [kasPrice, setkasPrice] = useState<number>(0);

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

    return (
        <PortfolioLayout backgroundBlur={backgroundBlur}>
            <UserProfile walletAddress={walletAddress} portfolioValue={portfolioValue} kasPrice={kasPrice} />
            <PortfolioPanel
                kasPrice={kasPrice}
                walletConnected={walletConnected}
                tokenList={mockTokenRowPortfolioItems}
            />
        </PortfolioLayout>
    );
};

export default PortfolioPage;
