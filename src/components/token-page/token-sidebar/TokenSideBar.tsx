import { Tab, Tabs } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { FC, useState, SyntheticEvent } from 'react';
import { BackendTokenResponse } from '../../../types/Types';
import { SideBarContainer } from './TokenSideBar.s';
import TokenSideBarInfo from './token-sidebar-info/TokenSideBarInfo';
import { GlobalStyleTokenSideBar } from '../../../utils/GlobalStyleScrollBar';
import BuyPanel from './token-sidebar-info/buy-panel/BuyPanel';
import SellPanel from './token-sidebar-info/sell-panel/SellPanel';
// import SellPanel from './token-sidebar-info/sell-panel/SellPanel';

interface TokenSideBarProps {
    tokenInfo: BackendTokenResponse;
    setTokenInfo: (tokenInfo: BackendTokenResponse) => void;
    walletAddress: string | null;
    walletConnected: boolean;
    walletBalance: number;
    kasPrice: number;
}

const TokenSideBar: FC<TokenSideBarProps> = (props) => {
    const { setTokenInfo, tokenInfo, walletAddress, walletConnected, walletBalance, kasPrice } = props;
    const [selectedSideActionTab, setSelectedSideActionTab] = useState('1');

    const handleTabChage = (_event: SyntheticEvent, newValue: string) => {
        setSelectedSideActionTab(newValue);
    };

    return (
        <>
            <GlobalStyleTokenSideBar />
            <SideBarContainer>
                <TabContext value={selectedSideActionTab}>
                    <Tabs
                        value={selectedSideActionTab}
                        onChange={handleTabChage}
                        sx={{
                            minWidth: 0, // Optional: Removes default min-width
                            '& .MuiTabs-flexContainer': {
                                justifyContent: {
                                    xs: 'flex-start', // Default on mobile
                                    md: 'center', // Center on medium and up
                                },
                            },
                        }}
                    >
                        <Tab label="Info" value="1" />
                        <Tab label="Buy" value="2" />
                        <Tab label="Sell" value="3" />
                    </Tabs>
                    <TabPanel
                        sx={{
                            '&.MuiTabPanel-root': {
                                padding: '0px',
                                height: '100%',
                                overflowY: 'auto',
                            },
                        }}
                        value="1"
                    >
                        <TokenSideBarInfo
                            kasPrice={kasPrice}
                            tokenInfo={tokenInfo}
                            setTokenInfo={setTokenInfo}
                            walletConnected={walletConnected}
                            walletAddress={walletAddress}
                            walletBalance={walletBalance}
                        />
                    </TabPanel>
                    <TabPanel
                        sx={{
                            '&.MuiTabPanel-root': {
                                padding: '0px',
                                height: '100%',
                                overflowY: 'hidden',
                            },
                        }}
                        value="2"
                    >
                        <BuyPanel
                            walletAddress={walletAddress}
                            walletConnected={walletConnected}
                            tokenInfo={tokenInfo}
                            kasPrice={kasPrice}
                            walletBalance={walletBalance}
                        />
                    </TabPanel>
                    <TabPanel
                        sx={{
                            '&.MuiTabPanel-root': {
                                padding: '0px',
                                height: '100%',
                                overflowY: 'auto',
                            },
                        }}
                        value="3"
                    >
                        <SellPanel
                            walletConnected={walletConnected}
                            tokenInfo={tokenInfo}
                            kasPrice={kasPrice}
                            walletAddress={walletAddress}
                        />
                        {/* <Typography variant="h5">Coming Soon</Typography> */}
                    </TabPanel>
                </TabContext>
            </SideBarContainer>
        </>
    );
};

export default TokenSideBar;
