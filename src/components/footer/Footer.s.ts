import { Box, Grid, Link, styled, Typography } from '@mui/material';

export const FooterContainer = styled(Box)({
    borderTop: '1px solid #767676', // Info color
    color: '#B6B6B6', // Neutral text color
    padding: '10px 0',
    width: '98%',
    margin: '0 auto', // Centering the footer
});

export const FooterContent = styled(Grid)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

export const SocialMediaIcons = styled(Box)({
    display: 'flex',
    marginBottom: 'auto', // Align icons to the top
});

export const FooterList = styled('ul')({
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    width: '7vw', // Set specific width to reduce space between list items
    '& li': {
        width: '100%', // Ensure each list item has the same width
    },
});

export const FooterLink = styled(Link)({
    color: '#767676', // Info color
    textDecoration: 'none',
    fontSize: '0.8vw',
    '&:hover': {
        color: '#49EACB', // Hover color for links
    },
});

export const RightsReserved = styled(Typography)({
    marginTop: 'auto', // Align to the bottom
});
