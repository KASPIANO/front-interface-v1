import { FC, useEffect } from 'react';
import { BackendTokenResponse } from '../../../types/Types';
import { Rank, Title, TitleHeaderContainer } from './TokenHeader.s';
import { Avatar, Box } from '@mui/material';
import { isEmptyString } from '../../../utils/Utils';
import { DEFAULT_TOKEN_LOGO_URL } from '../../../utils/Constants';
import { getFyiLogo } from '../../../DAL/KaspaApiDal';
import React from 'react';

interface TokenHeaderProps {
    tokenInfo: BackendTokenResponse;
}

const TokenHeader: FC<TokenHeaderProps> = (props) => {
    const { tokenInfo } = props;
    const [fyiLogo, setFyiLogo] = React.useState<string | null>(null);

    useEffect(() => {
        if (!tokenInfo.metadata?.logoUrl) {
            getFyiLogo(tokenInfo.ticker)
                .then((response) => {
                    const imageUrl = URL.createObjectURL(response); // Use the blob data here
                    setFyiLogo(imageUrl);
                })
                .catch(() => {
                    setFyiLogo(DEFAULT_TOKEN_LOGO_URL); // Fallback if there's an error
                });
        }
    }, [tokenInfo]);

    const rankHeader = tokenInfo?.rank ? `Rank #${tokenInfo.rank}` : '';

    return (
        <TitleHeaderContainer>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                <Avatar
                    alt={tokenInfo?.ticker}
                    src={isEmptyString(tokenInfo?.metadata?.logoUrl) ? fyiLogo : tokenInfo?.metadata?.logoUrl}
                    sx={{ height: '4rem', width: '4rem' }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Title>{tokenInfo.ticker}</Title>
                    <Rank>{rankHeader}</Rank>
                </Box>
            </Box>
        </TitleHeaderContainer>
    );
};

export default TokenHeader;
