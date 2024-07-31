import React from 'react';
import TradingViewChart from '../../../trading-view/TradingViewChart';
import { GraphContainer } from './TokenGraph.s';

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
