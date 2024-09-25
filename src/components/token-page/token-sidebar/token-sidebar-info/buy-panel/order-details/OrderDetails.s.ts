import { styled, Typography } from '@mui/material';

export const OrderItemPrimary = styled(Typography)({
    fontWeight: 500,
    fontSize: '0.8rem',
});
export const OrderDetailsItem = styled(Typography)({
    fontWeight: 600,
    fontSize: '0.8rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
});

export const OrderItemSecondary = styled(Typography)({
    fontSize: '0.65rem',
});
