import { Box, Button, ButtonGroup } from '@mui/material';
import styled from 'styled-components';

export const HeaderContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px',
    borderRadius: '8px 8px 0 0',
    marginLeft: '1vw',
    '&.MuiBox-root': {
        paddingBottom: '0',
    },
});

export const SortButtonGroup = styled(ButtonGroup)({
    height: '3.5vh',
    borderRadius: '2px',
    marginRight: '1vw',
    '& .MuiButton-root': {
        backgroundColor: 'rgba(111, 199, 186, 0.25)', // Primary color with less opacity
    },
});

export const SortMiddleButton = styled(Button)<{ selected: boolean }>(({ selected }) => ({
    '&.MuiButtonGroup-middleButton': {
        backgroundColor: selected ? 'rgba(111, 199, 186, 0.8)' : 'rgba(111, 199, 186, 0.25)',
    },
    '&.MuiButton-root': {
        padding: '5px 5px',
        fontSize: '0.68rem',
    },

    '&:hover': {
        backgroundColor: 'rgba(111, 199, 186, 0.7)', // Stronger opacity on hover
    },
}));

export const SortFirstButton = styled(Button)<{ selected: boolean }>(({ selected }) => ({
    '&.MuiButton-root': {
        borderRadius: '4px 0 0 4px',
        padding: '4px 4px',
        fontSize: '0.68rem',
    },
    '&.MuiButtonGroup-firstButton': {
        backgroundColor: selected ? 'rgba(111, 199, 186, 0.8)' : 'rgba(111, 199, 186, 0.25)',
    },

    '&:hover': {
        backgroundColor: 'rgba(111, 199, 186, 0.7)', // Stronger opacity on hover
    },
}));

export const SortLastButton = styled(Button)<{ selected: boolean }>(({ selected }) => ({
    '&.MuiButtonGroup-lastButton': {
        backgroundColor: selected ? 'rgba(111, 199, 186, 0.8)' : 'rgba(111, 199, 186, 0.25)',
    },
    '&.MuiButton-root': {
        padding: '4px 4px',
        fontSize: '0.68rem',
        borderRadius: '0 4px 4px 0',
    },
    '&:hover': {
        backgroundColor: 'rgba(111, 199, 186, 0.7)', // Stronger opacity on hover
    },
}));

export const PrevPageButton = styled(Button)({
    '&.MuiButton-root': {
        marginLeft: '1.4vw',
        padding: '4px 4px',
        borderRadius: '4px 0 0 4px',
        fontSize: '0.68rem',
        minWidth: '0',
        width: '3vw',
        backgroundColor: 'rgba(111, 199, 186, 0.25)', // Primary color with less opacity
    },
    '&:hover': {
        backgroundColor: 'rgba(111, 199, 186, 0.7)', // Stronger opacity on hover
    },
});

export const NextPageButton = styled(Button)({
    '&.MuiButton-root': {
        padding: '4px 4px',
        borderRadius: '0 4px 4px 0',
        fontSize: '0.68rem',
        minWidth: '0',
        width: '3vw',
        backgroundColor: 'rgba(111, 199, 186, 0.25)', // Primary color with less opacity
    },
    '&:hover': {
        backgroundColor: 'rgba(111, 199, 186, 0.7)', // Stronger opacity on hover
    },
});

export const fireColors = {
    primary: '#FF6600',
    secondary: '#FF9933',
    tertiary: '#FFCC00',
    glow: '#FF3300',
};
