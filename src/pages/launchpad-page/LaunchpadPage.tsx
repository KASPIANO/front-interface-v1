import { Tabs, Tab } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { FC, useState, SyntheticEvent } from 'react';
import CreateLaunchpadForm from '../../components/launchpad/create-launchpad-tab/CreateLaunchpad';
import OwnerLaunchpadPage from '../../components/launchpad/owner-launchpad/OwnerLaunchpads';
import LaunchpadList from '../../components/launchpad/launchpad-list/LaunchpadList';

interface LaunchpadPageProps {
    walletAddress: string | null;
    backgroundBlur: boolean;
    walletConnected: boolean;
    walletBalance: number;
}

const LaunchpadPage: FC<LaunchpadPageProps> = (props) => {
    const { backgroundBlur, walletAddress, walletConnected } = props;
    const [activeTab, setActiveTab] = useState('1');

    const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    return (
        <div
            style={{
                filter: backgroundBlur ? 'blur(6px)' : 'none',
                transition: 'backdrop-filter 0.3s ease',
                padding: '0.2rem 1rem 0.1rem 1rem',
            }}
        >
            <TabContext value={activeTab}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        '&.MuiTabs-root': {
                            height: '2.4rem',
                            minHeight: '5px',
                        },
                        // '& .MuiTabs-flexContainer': {
                        //     justifyContent: 'center',
                        // },
                    }}
                >
                    <Tab
                        sx={{
                            '&.MuiTab-root': {
                                minWidth: '15%',
                            },
                        }}
                        label="Launchpads"
                        value="1"
                    />
                    <Tab
                        sx={{
                            '&.MuiTab-root': {
                                minWidth: '15%',
                            },
                        }}
                        label="Create Launchpad"
                        value="2"
                    />
                    <Tab
                        sx={{
                            '&.MuiTab-root': {
                                minWidth: '15%',
                            },
                        }}
                        label="My Launchpads"
                        value="3"
                    />
                </Tabs>
                <TabPanel value="1">
                    <LaunchpadList />
                </TabPanel>
                <TabPanel value="2">
                    <CreateLaunchpadForm walletConnected={walletConnected} />
                </TabPanel>
                <TabPanel value="3">
                    <OwnerLaunchpadPage walletAddress={walletAddress} walletConnected={walletConnected} />
                </TabPanel>
            </TabContext>
        </div>
    );
};

export default LaunchpadPage;
