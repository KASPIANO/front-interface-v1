import { Slider, styled } from '@mui/material';

export const ScoreLineSlider = styled(Slider)({
    height: '2vh',
    width: '25vw',

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
        top: -6,
        borderRadius: 10,
        lineHeight: 1,
        '&::before': {
            display: 'none',
        },
    },
});
