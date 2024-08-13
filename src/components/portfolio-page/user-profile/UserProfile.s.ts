import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const ProfileContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '10vh',
});

export const ProfileDetails = styled(Box)({
    marginLeft: '1vw',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
});

export const PortfolioValueContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
});
