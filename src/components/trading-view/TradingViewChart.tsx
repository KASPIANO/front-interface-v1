import React, { useEffect } from 'react';
import { ChartContainer, ChartWrapper } from './TradingView.s';

declare global {
    interface Window {
        TradingView: any;
    }
}

interface TradingViewChartProps {
    symbol: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            new window.TradingView.widget({
                container_id: 'tradingview_widget',
                width: '100%',
                height: '100%',
                symbol,
                interval: '1',
                timezone: 'Etc/UTC',
                theme: 'dark',
                style: '1',
                locale: 'en',
                toolbar_bg: '#f1f3f6',
                enable_publishing: false,
                allow_symbol_change: true,
                hide_top_toolbar: false,
                save_image: false,
                details: false,
                hide_side_toolbar: true,
                withdateranges: false,
            });
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <ChartWrapper>
            <ChartContainer>
                <div id="tradingview_widget" />
            </ChartContainer>
        </ChartWrapper>
    );
};

export default TradingViewChart;
