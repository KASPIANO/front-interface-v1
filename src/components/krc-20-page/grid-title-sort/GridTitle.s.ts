import { Box, Typography, ButtonGroup, Button } from '@mui/material';
import styled from 'styled-components';

export const HeaderContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px',
    borderRadius: '8px 8px 0 0',
    marginLeft: '1vw',
});

export const Title = styled(Typography)({
    fontSize: '1.2rem',
    fontWeight: 'bold',
});

export const SortButtonGroup = styled(ButtonGroup)({
    height: '3.5vh',
    borderRadius: '9px',
    '& .MuiButton-root': {
        color: '#fff',
        backgroundColor: 'rgba(111, 199, 186, 0.25)', // Primary color with less opacity
    },
});

export const SortButton = styled(Button)({
    color: '#fff',

    '&:hover': {
        backgroundColor: 'rgba(111, 199, 186, 0.7)', // Stronger opacity on hover
    },
});
