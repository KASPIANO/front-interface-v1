import React, { FC, useEffect, useState } from 'react';
import { Box, Card, Tooltip, Typography } from '@mui/material';
import OptionSelection from '../option-selection/OptionSelection';
import _ from 'lodash';
import { Token } from '../../../types/Types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface TopHoldersProps {
    tokenInfo: Token;
}

const TopHolders: FC<TopHoldersProps> = ({ tokenInfo }) => {
    const numberOfHoldersToSelect = [10, 20, 30, 40, 50];
    const [tokenHoldersToShow, setTokenHoldersToShow] = useState(numberOfHoldersToSelect[0]);
    const [topHoldersPercentage, setTopHoldersPercentage] = useState('---');
    const [tokenHolders, setTokenHolders] = useState(tokenInfo?.topHolders || []);

    const updateTokenHoldersToShow = (value: number) => {
        setTokenHoldersToShow(value);
    };

    useEffect(() => {
        const holdersToCalaulate = tokenHolders.slice(0, tokenHoldersToShow);

        const totalHolding = _.sum(_.map(holdersToCalaulate, (h) => parseFloat(h.amount)));

        if (tokenInfo.topHolders) {
            const totalPercentage = (totalHolding / parseFloat(tokenInfo?.minted || '0')) * 100;
            setTopHoldersPercentage(`${totalPercentage.toFixed(2)}%`);
        } else {
            setTopHoldersPercentage('---');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenHoldersToShow, tokenHolders, tokenInfo?.minted]);

    return (
        <Card sx={{ height: '19vh', padding: '8px 10px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>
                        TOP HOLDERS
                    </Typography>

                    <Tooltip title="The Rug Score is an algorithm based on token collection metrics and social media footprints. The score ranges from 1 to 100, with 100 being the best. It represents the collection's transparency and trustworthiness. If you find the score unsatisfactory, you can send a request to review it with the 'Send Request' button near the token header.">
                        <InfoOutlinedIcon fontSize="small" />
                    </Tooltip>
                </Box>
                <OptionSelection
                    options={numberOfHoldersToSelect}
                    value={tokenHoldersToShow}
                    onChange={updateTokenHoldersToShow}
                />
            </Box>

            <Typography variant="h5">{topHoldersPercentage}</Typography>
        </Card>
    );
};

export default TopHolders;
