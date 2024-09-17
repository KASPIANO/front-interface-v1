import { FC } from 'react';
import { BackendTokenResponse } from '../../../types/Types';
import { Rank, Title, TitleHeaderContainer } from './TokenHeader.s';
import { Avatar, Box } from '@mui/material';

interface TokenHeaderProps {
    tokenInfo: BackendTokenResponse;
}

const TokenHeader: FC<TokenHeaderProps> = (props) => {
    const { tokenInfo } = props;

    return (
        <TitleHeaderContainer>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5vw' }}>
                <Avatar
                    variant="square"
                    alt={tokenInfo.ticker}
                    src={tokenInfo.metadata.logoUrl}
                    sx={{ height: '2vw', width: '2vw' }}
                />
                <Title>{tokenInfo.ticker}</Title>
            </Box>
            <Rank>#69 - MOCK Rank</Rank>
        </TitleHeaderContainer>
    );
};

export default TokenHeader;
