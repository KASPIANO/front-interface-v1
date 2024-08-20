import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { GraphContainer } from './TokenGraph.s';
import { alpha, useTheme } from '@mui/material';

const RealTimeGraph: React.FC = () => {
    const theme = useTheme();
    const [data, setData] = useState<{ x: number[]; y: number[] }>({
        x: [],
        y: [],
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const newX = data.x.length > 0 ? data.x[data.x.length - 1] + 1 : 0;
            const newY = Math.random() * 100; // Mock data point

            setData((prevData) => ({
                x: [...prevData.x, newX],
                y: [...prevData.y, newY],
            }));
        }, 8000); // Update every 8 seconds

        return () => clearInterval(interval);
    }, [data]);

    return (
        <GraphContainer>
            <Plot
                data={[
                    {
                        x: data.x,
                        y: data.y,
                        type: 'scatter',
                        mode: 'lines',
                        // mode: 'lines+markers',
                        fill: 'tozeroy', // Fill area under the line
                        line: { color: theme.palette.primary.main }, // Line color
                        fillcolor: alpha(theme.palette.primary.main, 0.5), // Fill color with opacity
                    },
                ]}
                layout={{
                    paper_bgcolor: theme.palette.background.paper,
                    plot_bgcolor: theme.palette.background.paper,

                    width: 920,
                    height: 205,
                    xaxis: { title: 'Time', automargin: true },
                    yaxis: { title: 'Price', automargin: true },
                    margin: { t: 35, r: 35, b: 35, l: 40 }, // Adjust margin as needed
                }}
                useResizeHandler={true} // Enable resizing with the container
            />
        </GraphContainer>
    );
};

export default RealTimeGraph;
