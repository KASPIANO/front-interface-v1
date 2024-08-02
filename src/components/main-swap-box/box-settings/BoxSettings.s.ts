import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SlippageText = styled(Typography)({
    fontWeight: '600',
    fontSize: '1.3vw',
});

export const SlippageSetting = styled(Box)({
    backgroundColor: '#353545',
    padding: '8px 8px',
    borderRadius: '20px',

    marginLeft: '270px',
});

export const ButtonGroup = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    marginBottom: '0.5rem',
});
