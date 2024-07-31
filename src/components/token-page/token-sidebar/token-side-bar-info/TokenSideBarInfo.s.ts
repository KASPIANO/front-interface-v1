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
    justifyContent: 'center',
    elevation: 0,
    padding: theme.spacing(1),
}));

