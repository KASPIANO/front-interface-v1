import React from 'react';
import TradingViewWidget from '../../trading-view/TradingViewChart';
import { GraphContainer } from './TokenGraph.s';

interface TokenGraphProps {
    tokenInfo?: any;
}

export const TokenGraph: React.FC<TokenGraphProps> = (props) => {
    const { tokenInfo } = props;
    return (
        <GraphContainer style={{ width: 'inherit', height: '50vh' }}>
            <TradingViewWidget />
        </GraphContainer>
    );
};
