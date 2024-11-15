import { Tabs } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { FC, useState, SyntheticEvent } from 'react';
import { BackendTokenResponse } from '../../../types/Types';
import { SideBarContainer, TabStyled } from './TokenSideBar.s';
import TokenSideBarInfo from './token-sidebar-info/TokenSideBarInfo';
import { GlobalStyleTokenSideBar } from '../../../utils/GlobalStyleScrollBar';
import BuyPanel from './token-sidebar-info/buy-panel/BuyPanel';
import SellPanel from './token-sidebar-info/sell-panel/SellPanel';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
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
    const [buyPanelRef, setBuyPanelRef] = useState<{ handleDrawerClose: () => void } | null>(null);
    const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
        // Check if we're switching away from the "Buy" tab (value="2")
        if (selectedSideActionTab === '2' && newValue !== '2') {
            // Release the order in BuyPanel
            buyPanelRef?.handleDrawerClose();
        }
        setSelectedSideActionTab(newValue);
    };

    return (
        <>
            <GlobalStyleTokenSideBar />
            <SideBarContainer>
                <TabContext value={selectedSideActionTab}>
                    <Tabs
                        value={selectedSideActionTab}
                        onChange={handleTabChange}
                        sx={{
                            '&.MuiTabs-root': {
                                height: '2rem',
                                minHeight: '5px',
                            },
                            '& .MuiTabs-flexContainer': {
                                height: '2rem',
                                justifyContent: 'center',
                                gap: '1.3rem',
                            },
                        }}
                    >
                        <TabStyled label="Info" value="1" />
                        <TabStyled
                            icon={<ShoppingCartRoundedIcon sx={{ fontSize: '0.85rem' }} />} // Add the icon
                            iconPosition="end"
                            label="Buy"
                            value="2"
                            sx={{
                                '&.MuiTab-root': {
                                    color: 'rgba(0, 200, 0, 0.8)', // Lighter green with 70% opacity
                                },
                                '&.Mui-selected': {
                                    color: 'rgba(0, 200, 0, 0.89)', // Slightly darker when selected with 85% opacity
                                },
                                color: 'rgba(0, 200, 0, 0.8)', // Default lighter green color with 70% opacity
                            }}
                        />

                        <TabStyled
                            icon={<StorefrontRoundedIcon sx={{ fontSize: '0.85rem' }} />} // Add the icon
                            iconPosition="end"
                            label="Sell"
                            value="3"
                            sx={{
                                '&.MuiTab-root': {
                                    color: 'rgba(255, 0, 0, 0.6)',
                                },
                                '&.Mui-selected': {
                                    color: 'rgba(255, 0, 0, 0.85)', // Full opacity color when selected
                                },
                                color: 'rgba(255, 0, 0, 0.6)', // 80% opacity
                            }}
                        />
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
                            setBuyPanelRef={setBuyPanelRef}
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
                            walletBalance={walletBalance}
                        />
                        {/* <Typography variant="h5">Coming Soon</Typography> */}
                    </TabPanel>
                </TabContext>
            </SideBarContainer>
        </>
    );
};

export default TokenSideBar;
