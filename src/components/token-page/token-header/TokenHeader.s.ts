import { styled, Typography, Box } from '@mui/material';

export const HeaderContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column', // Change to column to stack title and price containers
    alignItems: 'start',
    gap: '0.4vw',
    justifyItems: 'center',
    height: '11.5vh',
});

export const PriceContainer = styled(Box)({
    display: 'flex',
    alignItems: 'start',
    flexDirection: 'column', // Ensure price container elements are in a row
    justifyItems: 'center',
});

export const TitleHeaderContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column', // Change to column to stack title elements
    alignItems: 'start',
    justifyItems: 'center',
});

export const Title = styled(Typography)({
    fontSize: '1.5vw',
    fontWeight: 600,
});

export const Rank = styled(Typography)({
    fontSize: '1.3vw',
    fontWeight: 600,
    marginLeft: '1vh',
});

export const Subtitle = styled(Typography)({
    fontSize: '1vw',
});
