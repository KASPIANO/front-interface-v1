import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import { option } from './TradingView.config';
import { ChartContainer, ChartWrapper } from './TradingView.s';

type EChartsOption = echarts.EChartsOption;

declare global {
    interface Window {
        TradingView: any;
    }
}

const TradingViewChart: React.FC = () => {
    const graph = useRef();
    useEffect(() => {
        if (graph.current) {
            var myChart = echarts.init(graph.current);

            myChart.setOption(option);
        }
    }, [graph]);

    return (
        <ChartWrapper>
            <ChartContainer>
                <div ref={graph} style={{ height: '40vh', width: '30vw' }} />
            </ChartContainer>
        </ChartWrapper>
    );
};
export default TradingViewChart;
