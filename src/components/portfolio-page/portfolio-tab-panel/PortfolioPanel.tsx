import { FC, useState } from 'react';
import { Tabs } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import { TabPanelContainer, TabPanelStyled, TabStyled } from './PortfolioPanel.s';
// import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PortfolioTokenGrid from '../portfolio-token-grid/PortfolioTokenGrid';
import { Order, TokenRowActivityItem, TokenRowPortfolioItem } from '../../../types/Types';
import PortfolioActivityTokenGrid from '../portfolio-activity-grid/PortfolioActivityTokenGrid';
import UserOrdersGrid from '../user-orders/UserOrders';

interface PortfolioPanelProps {
    kasPrice: number;
    walletConnected: boolean;
    tokenList: TokenRowPortfolioItem[];
    isLoading: boolean;
    walletBalance: number;
    tokensActivityList: TokenRowActivityItem[];
    tickers: string[];
    isLoadingActivity: boolean;
    handleActivityPagination: (direction: 'next' | 'prev') => void;
    lastActivityPage: boolean;
    handleChange: () => void;
    lastPortfolioPage: boolean;
    handlePortfolioPagination: (direction: 'next' | 'prev') => void;
    listings: Order[];
}

const PortfolioPanel: FC<PortfolioPanelProps> = (props) => {
    const {
        tokenList,
        kasPrice,
        walletConnected,
        isLoading,
        walletBalance,
        tickers,
        tokensActivityList,
        isLoadingActivity,
        handleActivityPagination,
        lastActivityPage,
        handleChange,
        lastPortfolioPage,
        handlePortfolioPagination,
        listings,
    } = props;
    const [value, setValue] = useState('1');
    // const [paidUser] = useState(false);

    const handleValueChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <TabPanelContainer>
            <TabContext value={value}>
                <Tabs
                    value={value}
                    onChange={handleValueChange}
                    sx={{
                        '& .MuiTabs-flexContainer': {
                            marginLeft: '2vw',
                            gap: '2vw',
                        },
                        borderBottom: '0.3px solid',
                    }}
                >
                    <TabStyled label="Overview" value="1" />
                    <TabStyled label="Activity" value="2" />
                    <TabStyled label="Listings" iconPosition="end" value="3" />
                    {/* <TabStyled
                        label="Wallet Tracking"
                        icon={!paidUser && <LockRoundedIcon sx={{ marginBottom: '3px' }} />}
                        iconPosition="end"
                        value="4"
                    /> */}
                </Tabs>
                <TabPanelStyled value="1">
                    <PortfolioTokenGrid
                        handleChange={handleChange}
                        walletBalance={walletBalance}
                        isLoading={isLoading}
                        tokensList={tokenList}
                        kasPrice={kasPrice}
                        walletConnected={walletConnected}
                        lastPortfolioPage={lastPortfolioPage}
                        handlePortfolioPagination={handlePortfolioPagination}
                    />
                </TabPanelStyled>
                <TabPanelStyled value="2">
                    <PortfolioActivityTokenGrid
                        lastActivityPage={lastActivityPage}
                        handleActivityPagination={handleActivityPagination}
                        isLoading={isLoadingActivity}
                        tickers={tickers}
                        tokensActivityList={tokensActivityList}
                        walletBalance={walletBalance}
                        kasPrice={kasPrice}
                        walletConnected={walletConnected}
                    />
                </TabPanelStyled>
                <TabPanelStyled value="3">
                    <UserOrdersGrid
                        kasPrice={kasPrice}
                        walletConnected={walletConnected}
                        isLoading={isLoading}
                        orders={listings}
                    />
                </TabPanelStyled>
                <TabPanelStyled value="4">Wallet Tracking </TabPanelStyled>
            </TabContext>
        </TabPanelContainer>
    );
};

export default PortfolioPanel;
