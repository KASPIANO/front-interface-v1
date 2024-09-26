import { Button, ButtonGroup, styled } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const OptionSelectionGroup = styled(ButtonGroup)(({ theme }) => ({
    height: '3.5vh',
    borderRadius: '4px',
    marginRight: '1vw',
    boxShadow: `0 2px 4px ${alpha(theme.palette.grey[500], 0.2)}`, // Subtle shadow
    '& .MuiButton-root': {
        color: theme.palette.text.primary,
    },
}));

export const OptionSelectionButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary,
    // Slightly larger text
    '&.MuiButtonGroup-middleButton': {
        backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
    '&.MuiButtonGroup-firstButton': {
        backgroundColor: alpha(theme.palette.primary.light, 0.1),
        borderRadius: '4px 0 0 4px', // Rounded corners on the left
    },
    '&.MuiButtonGroup-lastButton': {
        backgroundColor: alpha(theme.palette.primary.light, 0.1),
        borderRadius: '0 4px 4px 0', // Rounded corners on the right
    },
    '&.MuiButton-root': {
        fontSize: '0.65rem', // Slightly larger text
        border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`, // Subtle border
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.light, 0.2),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.8)}`, // Darker border on hover
    },
    '&.selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.4),
    },
}));
