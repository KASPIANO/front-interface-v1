import { FC, useEffect, useState } from 'react';
import { PortfolioLayout } from './PortfolioPageLayout';
import UserProfile from '../../components/portfolio-page/user-profile/UserProfile';
import PortfolioPanel from '../../components/portfolio-page/user-profile/portfolio-tab-panel/PortfolioPanel';
import { kaspaLivePrice } from '../../DAL/KaspaApiDal';
import { PortfolioValue } from '../../types/Types';

interface PortfolioPageProps {
    walletAddress: string | null;
    backgroundBlur: boolean;
}

const portfolioValue: PortfolioValue = {
    kas: 6089.56,
    change: 14.5,
    changeDirection: 'increase',
};

const PortfolioPage: FC<PortfolioPageProps> = (props) => {
    const { walletAddress, backgroundBlur } = props;
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
            <PortfolioPanel />
        </PortfolioLayout>
    );
};

export default PortfolioPage;
