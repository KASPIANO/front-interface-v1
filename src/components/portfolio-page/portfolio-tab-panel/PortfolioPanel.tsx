import { FC, useState } from 'react';
import { Tabs } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import { TabPanelContainer, TabPanelStyled, TabStyled } from './PortfolioPanel.s';
// import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PortfolioTokenGrid from '../portfolio-token-grid/PortfolioTokenGrid';
import { TokenRowPortfolioItem } from '../../../types/Types';

interface PortfolioPanelProps {
    kasPrice: number;
    walletConnected: boolean;
    tokenList: TokenRowPortfolioItem[];
    tickers?: string[];
    isLoading: boolean;
    walletBalance: number;
}

const PortfolioPanel: FC<PortfolioPanelProps> = (props) => {
    const { tokenList, kasPrice, walletConnected, isLoading, walletBalance } = props;
    const [value, setValue] = useState('1');
    // const [paidUser] = useState(false);

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <TabPanelContainer>
            <TabContext value={value}>
                <Tabs
                    value={value}
                    onChange={handleChange}
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
                    {/* <TabStyled
                        label="Insights"
                        icon={!paidUser && <LockRoundedIcon sx={{ marginBottom: '3px' }} />}
                        iconPosition="end"
                        value="3"
                    />
                    <TabStyled
                        label="Wallet Tracking"
                        icon={!paidUser && <LockRoundedIcon sx={{ marginBottom: '3px' }} />}
                        iconPosition="end"
                        value="4"
                    /> */}
                </Tabs>
                <TabPanelStyled value="1">
                    <PortfolioTokenGrid
                        walletBalance={walletBalance}
                        isLoading={isLoading}
                        tokensList={tokenList}
                        kasPrice={kasPrice}
                        walletConnected={walletConnected}
                    />
                </TabPanelStyled>
                <TabPanelStyled value="2">
                    <PortfolioTokenGrid
                        walletBalance={walletBalance}
                        isLoading={isLoading}
                        tokensList={tokenList}
                        kasPrice={kasPrice}
                        walletConnected={walletConnected}
                    />
                </TabPanelStyled>
                <TabPanelStyled value="3">Portfolio Insights </TabPanelStyled>
                <TabPanelStyled value="4">Wallet Tracking </TabPanelStyled>
            </TabContext>
        </TabPanelContainer>
    );
};

export default PortfolioPanel;
