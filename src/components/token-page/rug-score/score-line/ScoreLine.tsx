import { FC, useEffect, useState } from 'react';
import { ScoreLineSlider } from './ScoreLine.s';
import { Box, useTheme } from '@mui/material';

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
    const { value, config } = props;
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
        const color = getColorByValue(value, config);
        setThumbColor(color);
    }, [value]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1.2vh' }}>
            <ScoreLineSlider
                value={value}
                aria-labelledby="color-slider"
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${value}%`}
                disabled
                sx={{
                    mt: 2,
                    '& .MuiSlider-track': {
                        background: 'transparent',
                    },
                    '& .MuiSlider-rail': {
                        opacity: 1,
                        background: generateGradient(config),
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: '8px',
                    },
                    '& .MuiSlider-thumb': {
                        background: thumbColor,
                        border: `1.5px solid ${theme.palette.primary.main}`,
                    },
                    '& .MuiSlider-valueLabel': {
                        background: thumbColor,
                    },
                    '& .MuiSlider-valueLabelLabel': {
                        color: theme.palette.getContrastText(thumbColor || '#000'),
                    },
                }}
            />
        </Box>
    );
};

export default ScoreLine;
