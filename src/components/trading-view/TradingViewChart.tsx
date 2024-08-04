import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';
import { option } from './TradingView.config';
import { ChartWrapper } from './TradingView.s';

type EChartsOption = echarts.EChartsOption;

declare global {
    interface Window {
        TradingView: any;
    }
}

export const TradingViewChart: React.FC = () => {
    const graph = useRef();
    useEffect(() => {
        if (graph.current) {
            var myChart = echarts.init(graph.current);

            myChart.setOption(option);
        }
    }, [graph]);

    return (
        <ChartWrapper style={{ width: 'inherit', height: 'inherit' }}>
            <div ref={graph} style={{ height: '100%', width: '100%' }} />
        </ChartWrapper>
    );
};
