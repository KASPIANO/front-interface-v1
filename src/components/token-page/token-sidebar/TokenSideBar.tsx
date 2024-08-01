import { Tab, Tabs } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { FC, useState, SyntheticEvent } from 'react';
import { Token } from '../../../types/Types';
import { SideBarCard, SideBarContainer } from './TokenSideBar.s';
import TokenSideBarInfo from './token-side-bar-info/TokenSideBarInfo';

interface TokenSideBarProps {
    tokenInfo: Token;
}

const TokenSideBar: FC<TokenSideBarProps> = (props) => {
    const [selectedSideActionTab, setSelectedSideActionTab] = useState('1');

    const handleTabChage = (_event: SyntheticEvent, newValue: string) => {
        setSelectedSideActionTab(newValue);
    };

    return (
        <SideBarContainer>
            <SideBarCard>
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
                    <TabPanel value="1">
                        <TokenSideBarInfo tokenInfo={props.tokenInfo} priceInfo={{}} />
                    </TabPanel>
                    <TabPanel value="2">Buy The Token</TabPanel>
                    <TabPanel value="3">Sell The Token</TabPanel>
                </TabContext>
            </SideBarCard>
        </SideBarContainer>
    );
};

export default TokenSideBar;