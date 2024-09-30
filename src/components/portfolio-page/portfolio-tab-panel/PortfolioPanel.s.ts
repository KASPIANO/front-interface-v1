import { styled } from '@mui/material/styles';
import { Box, Tab } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';

export const TabPanelContainer = styled(Box)({
    width: '100%',
});

export const TabPanelStyled = styled(TabPanel)({
    '&.MuiTabPanel-root': {
        paddingTop: '12px',
    },
});

export const TabStyled = styled(Tab)({
    paddingBottom: 0,
});
