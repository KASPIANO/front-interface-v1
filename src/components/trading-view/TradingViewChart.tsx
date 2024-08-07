// TradingViewWidget.jsx
import { memo, useEffect, useRef } from 'react';

const TradingViewWidget = () => {
    const container = useRef<HTMLDivElement>();

    useEffect(() => {
        if (container.current) {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
            script.type = 'text/javascript';
            script.async = true;
            script.innerHTML = `
            {
                "autosize": true,
                "symbol": "BINANCE:BTCUSDT",
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "backgroundColor": "rgba(18, 18, 18, 1)",
                "hide_side_toolbar": false,
                "allow_symbol_change": true,
                "calendar": false,
                "support_host": "https://www.tradingview.com"
                }`;
            container.current.appendChild(script);
        }
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}>
            <div
                className="tradingview-widget-container__widget"
                style={{ height: 'calc(100% - 32px)', width: '100%' }}
            />
        </div>
    );
};

export default memo(TradingViewWidget);
