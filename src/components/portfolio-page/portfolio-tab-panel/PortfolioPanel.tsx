import { FC, useState } from 'react';
import { Tabs } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import { TabPanelContainer, TabPanelStyled, TabStyled } from './PortfolioPanel.s';
import PortfolioTokenGrid from '../portfolio-token-grid/PortfolioTokenGrid';
import { TokenRowPortfolioItem } from '../../../types/Types';
import PortfolioActivityTokenGrid from '../portfolio-activity-grid/PortfolioActivityTokenGrid';
import PortfolioOrdersGrid from '../user-orders/PortfolioOrdersGrid';
import PortfolioOrdersHistoryGrid from '../user-orders-history/PortfolioOrdersHistoryGrid';

interface PortfolioPanelProps {
    kasPrice: number;
    walletConnected: boolean;
    walletAddress: string | null;
    tokenList: TokenRowPortfolioItem[];
    walletBalance: number;
    tickers: string[];
    handleChange: () => void;
    lastPortfolioPage: boolean;
    handlePortfolioPagination: (direction: 'next' | 'prev') => void;
    operationFinished: boolean;
    isLoading: boolean;
    currentWalletToCheck: string;
}

const PortfolioPanel: FC<PortfolioPanelProps> = (props) => {
    const {
        tokenList,
        kasPrice,
        walletConnected,
        walletBalance,
        tickers,
        handleChange,
        lastPortfolioPage,
        handlePortfolioPagination,
        walletAddress,
        isLoading,
        operationFinished,
        currentWalletToCheck,
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
                    <TabStyled label="Listings" value="3" />
                    <TabStyled label="Order HIstory" value="4" />
                </Tabs>
                <TabPanelStyled value="1">
                    <PortfolioTokenGrid
                        isLoading={isLoading}
                        handleChange={handleChange}
                        walletBalance={walletBalance}
                        tokensList={tokenList}
                        kasPrice={kasPrice}
                        walletConnected={walletConnected}
                        lastPortfolioPage={lastPortfolioPage}
                        handlePortfolioPagination={handlePortfolioPagination}
                        currentWalletToCheck={currentWalletToCheck}
                    />
                </TabPanelStyled>
                <TabPanelStyled value="2">
                    <PortfolioActivityTokenGrid
                        operationFinished={operationFinished}
                        tickers={tickers}
                        walletBalance={walletBalance}
                        kasPrice={kasPrice}
                        walletConnected={walletConnected}
                        walletAddress={walletAddress}
                        currentWalletToCheck={currentWalletToCheck}
                    />
                </TabPanelStyled>
                <TabPanelStyled value="3">
                    <PortfolioOrdersGrid
                        kasPrice={kasPrice}
                        walletConnected={walletConnected}
                        walletAddress={walletAddress}
                    />
                </TabPanelStyled>
                <TabPanelStyled value="4">
                    <PortfolioOrdersHistoryGrid
                        kasPrice={kasPrice}
                        walletConnected={walletConnected}
                        walletAddress={walletAddress}
                    />
                </TabPanelStyled>
            </TabContext>
        </TabPanelContainer>
    );
};

export default PortfolioPanel;
