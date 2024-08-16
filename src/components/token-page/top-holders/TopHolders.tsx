import { FC, useEffect, useState } from 'react';
import { Box, Card, Tooltip, Typography } from '@mui/material';
import OptionSelection from '../option-selection/OptionSelection';
import _ from 'lodash';
import { Token } from '../../../types/Types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface TopHoldersProps {
    tokenInfo: Token;
}

const TopHolders: FC<TopHoldersProps> = ({ tokenInfo }) => {
    const numberOfHoldersToSelect = [5, 10, 20, 30, 40, 50];
    const [tokenHoldersToShow, setTokenHoldersToShow] = useState(numberOfHoldersToSelect[0]);
    const [topHoldersPercentage, setTopHoldersPercentage] = useState('---');
    const [tokenHolders] = useState(tokenInfo?.topHolders || []);

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

                    <Tooltip title="Top holders represent the amount of tokens held by the top X holders combined. This metric helps understand token distribution, potential whale dominance, and the risk of market manipulation. A large concentration of tokens among few holders might be a red flag.">
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
