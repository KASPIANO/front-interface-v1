import { Tabs, Tab } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { FC, useState, SyntheticEvent } from 'react';
import CreateLaunchpadForm from '../../components/launchpad/create-launchpad-tab/CreateLaunchpad';

interface LaunchpadPageProps {
    walletAddress: string | null;
    backgroundBlur: boolean;
    walletConnected: boolean;
    walletBalance: number;
}

const LaunchpadPage: FC<LaunchpadPageProps> = (props) => {
    const { backgroundBlur } = props;
    const [activeTab, setActiveTab] = useState('1');

    const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    return (
        <div
            style={{
                filter: backgroundBlur ? 'blur(6px)' : 'none',
                transition: 'backdrop-filter 0.3s ease',
            }}
        >
            <TabContext value={activeTab}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        '&.MuiTabs-root': {
                            height: '2rem',
                            minHeight: '5px',
                        },
                        // '& .MuiTabs-flexContainer': {
                        //     justifyContent: 'center',
                        // },
                    }}
                >
                    <Tab label="Launchpads" value="1" />
                    <Tab label="Create Launchpad" value="2" />
                    <Tab label="My Launchpads" value="3" />
                </Tabs>
                <TabPanel value="1">{/* <LaunchpadsList /> */}</TabPanel>
                <TabPanel value="2">
                    <CreateLaunchpadForm />
                </TabPanel>
                <TabPanel value="3">{/* <MyLaunchpads /> */}</TabPanel>
            </TabContext>
        </div>
    );
};

export default LaunchpadPage;
