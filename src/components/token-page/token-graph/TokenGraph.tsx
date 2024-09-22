import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { GraphContainer } from './TokenGraph.s';
import { alpha, useTheme } from '@mui/material';

interface PriceHistoryItem {
    date: string;
    price: number;
}

interface RealTimeGraphProps {
    priceHistory: PriceHistoryItem[];
    ticker: string;
}

const RealTimeGraph: React.FC<RealTimeGraphProps> = ({ priceHistory, ticker }) => {
    const theme = useTheme();

    const [data, setData] = useState<{ x: string[]; y: number[] }>({
        x: [],
        y: [],
    });

    useEffect(() => {
        if (priceHistory && priceHistory.length > 0) {
            setData((prevData) => {
                const newDates = priceHistory.map((item) => item.date);
                const newPrices = priceHistory.map((item) => item.price);

                // Find the index of the first new date
                const startIndex =
                    prevData.x.length > 0
                        ? newDates.findIndex((date) => date > prevData.x[prevData.x.length - 1])
                        : 0;

                if (startIndex === -1) {
                    // No new data points
                    return prevData;
                }

                return {
                    x: [...prevData.x, ...newDates.slice(startIndex)],
                    y: [...prevData.y, ...newPrices.slice(startIndex)],
                };
            });
        }
    }, [priceHistory]);

    return (
        <GraphContainer>
            <Plot
                data={[
                    {
                        x: data.x,
                        y: data.y,
                        type: 'scatter',
                        mode: 'lines',
                        fill: 'tozeroy',
                        line: { color: theme.palette.primary.main },
                        fillcolor: alpha(theme.palette.primary.main, 0.5),
                        hoverinfo: 'x+y',
                        hovertemplate: '%{x|%Y-%m-%d %H:%M:%S}<br>Price: %{y:.8f}<extra></extra>',
                    },
                ]}
                layout={{
                    title: `${ticker} Price Chart`,
                    paper_bgcolor: theme.palette.background.paper,
                    plot_bgcolor: theme.palette.background.paper,
                    xaxis: {
                        automargin: true,
                        title: 'Date',
                        tickformat: '%Y-%m-%d', // Date without seconds
                        tickfont: { size: 10 },
                    },
                    yaxis: {
                        title: 'Price',
                        automargin: true,
                        tickformat: '.5f',
                    },
                    margin: { t: 35, r: 35, b: 35, l: 40 },
                    hovermode: 'closest',
                }}
                style={{ width: '100%', height: '100%' }}
                config={{
                    displayModeBar: true,
                    modeBarButtonsToRemove: [
                        'pan2d',
                        'select2d',
                        'lasso2d',
                        'zoomIn2d',
                        'zoomOut2d',
                        'autoScale2d',
                    ],
                    displaylogo: false,
                }}
                useResizeHandler={true}
            />
        </GraphContainer>
    );
};

export default RealTimeGraph;
