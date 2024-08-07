import React, { FC, useEffect, useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import OptionSelection from '../option-selection/OptionSelection';
import _ from 'lodash';
import { Token } from '../../../types/Types';

interface TopHoldersProps {
    tokenInfo: Token;
}

const TopHolders: FC<TopHoldersProps> = ({ tokenInfo }) => {
    const numberOfHoldersToSelect = [10, 20, 30, 40, 50];
    const [tokenHoldersToShow, setTokenHoldersToShow] = useState(numberOfHoldersToSelect[0]);
    const [topHoldersPercentage, setTopHoldersPercentage] = useState('---');
    const [tokenHolders, setTokenHolders] = useState(tokenInfo?.holder || []);

    const updateTokenHoldersToShow = (value: number) => {
        setTokenHoldersToShow(value);
    };

    useEffect(() => {
        const holdersToCalaulate = tokenHolders.slice(0, tokenHoldersToShow);

        const totalHolding = _.sum(_.map(holdersToCalaulate, (h) => parseFloat(h.amount)));

        if (tokenInfo.holder) {
            const totalPercentage = (totalHolding / parseFloat(tokenInfo?.minted || '0')) * 100;
            setTopHoldersPercentage(`${totalPercentage.toFixed(2)}%`);
        } else {
            setTopHoldersPercentage('---');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenHoldersToShow, tokenHolders, tokenInfo?.minted]);

    return (
        <Card sx={{ height: '19vh' }}>
            <Typography variant="body2" color="text.secondary">
                TOP HOLDERS
            </Typography>
            <OptionSelection
                options={numberOfHoldersToSelect}
                value={tokenHoldersToShow}
                onChange={updateTokenHoldersToShow}
            />
            <Typography variant="h5">{topHoldersPercentage}</Typography>
        </Card>
    );
};

export default TopHolders;
