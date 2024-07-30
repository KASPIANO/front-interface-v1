import { Slider, styled } from "@mui/material";

export const ScoreLineSlider = styled(Slider)(({ theme }) => ({
    height: 8,
    '& .MuiSlider-track': {
      height: 8,
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      '&:focus, &:hover, &.Mui-active': {
        boxShadow: 'inherit',
      },
    },
    '& .MuiSlider-valueLabel': {
      fontSize: theme.typography.h6.fontSize,
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
  