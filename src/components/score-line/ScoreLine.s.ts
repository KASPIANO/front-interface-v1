import { Slider, styled } from '@mui/material';

export const ScoreLineSlider = styled(Slider)(({ theme }) => ({
    height: '1.4vh',
    '& .MuiSlider-track': {
        height: '1vh',
    },
    '& .MuiSlider-thumb': {
        height: '3vh',
        width: '3vh',
        '&:focus, &:hover, &.Mui-active': {
            boxShadow: 'inherit',
        },
    },
    '& .MuiSlider-valueLabel': {
        fontSize: theme.typography.body1,
        fontWeight: 'normal',
        top: -6,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        padding: theme.spacing(1),
        '&::before': {
            display: 'none',
        },
    },
}));