import { styled, Box, Paper } from '@mui/material';

export const DataRowContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
});

export const DataPaper = styled(Paper)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
}));