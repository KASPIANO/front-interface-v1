import { IconButton, styled } from '@mui/material';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

export const DisabledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.action.disabled,
    padding: 0,
    height: '1vw',
    width: '1vw',
    paddingLeft: '0.4vw',
    ':hover': {
        backgroundColor: 'transparent',
    },
}));

export const ActiveIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.main,
    padding: 0,
    height: '1vw',
    width: '1vw',
    paddingLeft: '0.4vw',
    ':hover': {
        backgroundColor: 'transparent',
    },
}));

export const StyledExpandLessRoundedIcon = styled(ExpandLessRoundedIcon)({
    '&.MuiSvgIcon-root': {
        padding: 0,
        width: '1.4vw',
        height: '1.4vw',
    },
});

export const StyledExpandMoreRoundedIcon = styled(ExpandMoreRoundedIcon)({
    '&.MuiSvgIcon-root': {
        padding: 0,
        width: '1.4vw',
        height: '1.4vw',
    },
});
