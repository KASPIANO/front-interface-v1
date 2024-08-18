import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SlippageText = styled(Typography)({
    fontWeight: '400',
    fontSize: '1vw',
});

export const SlippageSetting = styled(Box)({
    borderColor: '#39ddbe',
    borderStyle: 'solid',
    padding: '8px 8px',
    borderRadius: '16px',
});
export const RightButtonsContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
});

export const ButtonGroup = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    width: '48vw',
});
