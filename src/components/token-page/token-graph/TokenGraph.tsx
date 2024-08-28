import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { GraphContainer } from './TokenGraph.s';
import { alpha, useTheme } from '@mui/material';

const mockData = {
    dates: [
        '2024-08-01',
        '2024-08-02',
        '2024-08-03',
        '2024-08-04',
        '2024-08-05',
        '2024-08-06',
        '2024-08-07',
        '2024-08-08',
        '2024-08-09',
        '2024-08-10',
        '2024-08-11',
        '2024-08-12',
        '2024-08-13',
        '2024-08-14',
        '2024-08-15',
        '2024-08-16',
        '2024-08-17',
    ],
    prices: [10, 40, 90, 50, 40, 70, 60, 90, 120, 140, 150, 200, 180, 160, 140, 120, 100, 80],
};
interface RealTimeGraphProps {
    newDates?: string[];
    newPrices?: number[];
}

const RealTimeGraph: React.FC<RealTimeGraphProps> = ({ newDates, newPrices }) => {
    const theme = useTheme();

    // Initial state set with static mock data
    const [data, setData] = useState<{ x: string[]; y: number[] }>({
        x: mockData.dates,
        y: mockData.prices,
    });

    useEffect(() => {
        // Update the graph with new dates and prices if provided
        if (newDates && newPrices) {
            setData((prevData) => ({
                x: [...prevData.x, ...newDates], // Append new dates to the existing dates
                y: [...prevData.y, ...newPrices], // Append new prices to the existing prices
            }));
        }
    }, [newDates, newPrices]);

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
                        hoverinfo: 'x+y', // Disable default hoverinfo
                        hovertemplate: '%{x|%b %d %Y}<br>%{y:.2f}<extra></extra>',
                    },
                ]}
                layout={{
                    paper_bgcolor: theme.palette.background.paper,
                    plot_bgcolor: theme.palette.background.paper,

                    xaxis: { automargin: true },
                    yaxis: { title: 'Price', automargin: true },
                    margin: { t: 35, r: 35, b: 35, l: 40 }, // Adjust margin as needed
                    hovermode: 'closest',
                }}
                style={{ width: '100%', height: '100%' }}
                config={{
                    displayModeBar: true, // Keep the mode bar for reset button
                    modeBarButtonsToRemove: [
                        'pan2d',
                        'select2d',
                        'lasso2d',
                        'zoomIn2d',
                        'zoomOut2d',
                        'autoScale2d',
                    ],
                    displaylogo: false, // Hide the Plotly logo
                }}
                useResizeHandler={true} // Enable resizing with the container
            />
        </GraphContainer>
    );
};

export default RealTimeGraph;
