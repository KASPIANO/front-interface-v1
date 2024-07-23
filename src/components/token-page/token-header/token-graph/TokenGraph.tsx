import React from 'react';
import { GraphContainer } from './TokenGraph.s';
import TradingViewChart from '../../../trading-view/TradingViewChart';

interface TokenGraphProps {
    tokenInfo?: any;
}

const TokenGraph: React.FC<TokenGraphProps> = (props) => {
    const { tokenInfo } = props;
    return (
        <GraphContainer>
            <TradingViewChart />
        </GraphContainer>
    );
};

export default TokenGraph;
