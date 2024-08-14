import { Slider, styled } from '@mui/material';

export const ScoreLineSlider = styled(Slider)({
    width: '95%',
    paddingBottom: '0px', // Add some bottom padding for better spacing

    '& .MuiSlider-track': {
        height: '3vh', // Same height as the rail for consistency
    },
    '& .MuiSlider-rail': {
        height: '3vh', // Same height as the track for consistency
        borderRadius: 4, // Adding slight rounding to the edges
    },
    '& .MuiSlider-thumb': {
        height: '4vh', // Make the thumb larger
        width: '4vh',
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
