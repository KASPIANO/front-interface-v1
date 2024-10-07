import { FC } from 'react';
import { BackendTokenResponse } from '../../../types/Types';
import { Title, TitleHeaderContainer } from './TokenHeader.s';
import { Avatar, Box } from '@mui/material';

interface TokenHeaderProps {
    tokenInfo: BackendTokenResponse;
}

const TokenHeader: FC<TokenHeaderProps> = (props) => {
    const { tokenInfo } = props;

    return (
        <TitleHeaderContainer>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                <Avatar
                    alt={tokenInfo?.ticker}
                    src={tokenInfo?.metadata?.logoUrl}
                    sx={{ height: '4rem', width: '4rem' }}
                />
                <Title>{tokenInfo.ticker}</Title>
                {/* <Rank>#69 - MOCK</Rank> */}
            </Box>
        </TitleHeaderContainer>
    );
};

export default TokenHeader;
