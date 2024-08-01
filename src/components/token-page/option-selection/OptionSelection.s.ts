import { Button, ButtonGroup, styled } from "@mui/material";
import { alpha } from '@mui/material/styles';


export const OptionSelectionGroup = styled(ButtonGroup)(({ theme }) => ({
    height: '3.5vh',
    borderRadius: '2px',
    marginRight: '1vw',
    '& .MuiButton-root': {
        border: 'none',
        color: theme.palette.text.primary,
    },
}));

export const OptionSelectionButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary,
    '&.MuiButtonGroup-middleButton': {
        backgroundColor: alpha(theme.palette.primary.main, 0.25),
    },
    '&.MuiButtonGroup-firstButton': {
        backgroundColor: alpha(theme.palette.primary.main, 0.25),
    },
    '&.MuiButtonGroup-lastButton': {
        backgroundColor: alpha(theme.palette.primary.main, 0.25),
    },
    '&.MuiButton-root': {
        padding: theme.spacing(1,1),
        fontSize: theme.typography.fontSize,
    },

    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.7), // Stronger opacity on hover
        border: `none`,
    },

    '&.selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
    }
}));
