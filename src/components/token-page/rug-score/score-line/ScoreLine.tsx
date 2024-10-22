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
    const [thumbColor, setThumbColor] = useState(null);

    const generateGradient = (colorRanges) => {
        let gradientString = '';
        const keys = Object.keys(colorRanges);

        keys.forEach((color) => {
            const { start, end } = colorRanges[color];
            gradientString += `${color} ${start}%, ${color} ${end}%, `;
        });

        return `linear-gradient(90deg, ${gradientString.slice(0, -2)})`; // Remove last comma and space
    };

    // Determines the color for the given value
    const getColorByValue = (value, colorRanges) => {
        const keys = Object.keys(colorRanges);

        for (let i = 0; i < keys.length; i++) {
            const color = keys[i];
            const { start, end } = colorRanges[color];

            if (value >= start && value <= end) {
                // Updated to <= for boundary conditions
                return color;
            }
        }

        // Fallback to the last color if value exceeds all ranges
        return keys[keys.length - 1];
    };

    useEffect(() => {
        const color = getColorByValue(value, config);
        setThumbColor(color);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, config]);

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
