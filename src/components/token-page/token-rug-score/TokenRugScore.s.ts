import { LinearProgress, linearProgressClasses } from '@mui/material';
import { styled } from '@mui/system';

export const ScoreLine = styled(LinearProgress)(
  ({ theme, value }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
    //   backgroundColor: value < 30 ? '#f44336' : // Red for values less than 30%
    //                    value < 70 ? '#ff9800' : // Orange for values between 30% and 70%
    //                     '#4caf50', // Green for values greater than 70%
    },
  })
);
