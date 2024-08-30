import { Tab, Tabs } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { FC, useState, SyntheticEvent } from 'react';
import { BackendTokenResponse } from '../../../types/Types';
import { SideBarContainer } from './TokenSideBar.s';
import TokenSideBarInfo from './token-sidebar-info/TokenSideBarInfo';
import { GlobalStyleTokenSideBar } from '../../../utils/GlobalStyleScrollBar';

interface TokenSideBarProps {
    tokenInfo: BackendTokenResponse;
    setTokenInfo: (tokenInfo: BackendTokenResponse) => void;
}

const TokenSideBar: FC<TokenSideBarProps> = (props) => {
    const { setTokenInfo, tokenInfo } = props;
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
                        <TokenSideBarInfo tokenInfo={tokenInfo} setTokenInfo={setTokenInfo} />
                    </TabPanel>
                    <TabPanel value="2">Buy The Token</TabPanel>
                    <TabPanel value="3">Sell The Token</TabPanel>
                </TabContext>
            </SideBarContainer>
        </>
    );
};

export default TokenSideBar;
