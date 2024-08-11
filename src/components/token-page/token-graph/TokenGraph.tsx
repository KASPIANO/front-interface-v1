import React, { memo } from 'react';
import TradingViewWidget from '../../trading-view/TradingViewChart';
import { GraphContainer } from './TokenGraph.s';

interface TokenGraphProps {
    tokenInfo?: any;
}

export const MemoizedTokenGraph: React.FC<TokenGraphProps> = memo(() => (
    <GraphContainer>
        <TradingViewWidget />
    </GraphContainer>
));

MemoizedTokenGraph.displayName = 'TokenGraph';

export default MemoizedTokenGraph;
