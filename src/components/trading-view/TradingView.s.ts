import { styled } from '@mui/material';

export const ChartWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'flex-start',
});

export const ChartContainer = styled('div')({
    backgroundColor: '#151924',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    height: '100%',

    // '@media (max-width: 768px)': {
    //   padding: '10px',
    //   margin: 0,
    //   width: '96vw',
    // },
});
