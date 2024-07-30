

import { FC, useEffect, useState } from 'react';
import { ScoreLineSlider } from './ScoreLine.s';
import { useTheme } from '@mui/material';

export type ScoreLineConfig = {
    [color: string]: {
        start: number;
        end: number;
    };    
};

interface ScoreLineProps {
    value: number;
    config: ScoreLineConfig;
}

const ScoreLine: FC<ScoreLineProps> = (props) => {
    const theme = useTheme();

    const generateGradient = (colorRanges) => {
        let gradientString = '';
        const keys = Object.keys(colorRanges);
        
        for (let i = 0; i < keys.length; i++) {
          const color = keys[i];
          const { start, end } = colorRanges[color];
          
          gradientString += `${color} ${start}%, `;
          gradientString += `${color} ${end}%, `;
        }
        
        gradientString = gradientString.slice(0, -2); // Remove trailing comma and space
        return `linear-gradient(90deg, ${gradientString})`;
    };

    const getColorByValue = (value, colorRanges) => {
        const keys = Object.keys(colorRanges);
        
        for (let i = 0; i < keys.length; i++) {
          const color = keys[i];
          const { start, end } = colorRanges[color];
          
          if (value >= start && value <= end) {
            return color;
          }
        }

        return keys[keys.length - 1]; // Default to the last color
    };


    const [thumbColor, setThumbColor] = useState(null);

    useEffect(() => {
        const color = getColorByValue(props.value, props.config);
        setThumbColor(color);
    }, [props.value]);
      

    return (
        <ScoreLineSlider
        value={props.value}
        aria-labelledby="color-slider"
        valueLabelDisplay="on"
        valueLabelFormat={(value) => `${value}%`}
        disabled
        sx={{
          mt: 2,
          '& .MuiSlider-track': {
            background: 'transparent',
            border: 'none',
          },
          '& .MuiSlider-rail': {
            opacity: 1,
            background: generateGradient(props.config),
          },
          '& .MuiSlider-thumb': {
            background: thumbColor,
          },
          '& .MuiSlider-valueLabel': {
            background: thumbColor,
          },
          '& .MuiSlider-valueLabelLabel': {
            color: theme.palette.getContrastText(thumbColor || '#000'),
          }
        }}
      />  
    );
}

export default ScoreLine;
