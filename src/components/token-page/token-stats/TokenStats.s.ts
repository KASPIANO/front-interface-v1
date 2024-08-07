import { styled, Box, Paper, Typography } from '@mui/material';

export const DataRowContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
});

export const DataPaper = styled(Paper)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(1),
    height: '110px',
}));

export const TitleTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

export const ValueTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: 'bold',
    fontSize: theme.typography.h4.fontSize,
}));
