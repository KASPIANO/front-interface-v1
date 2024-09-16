import { FC } from 'react';
import { BackendTokenResponse } from '../../../types/Types';
import { HeaderContainer, PriceContainer, Rank, Title, TitleHeaderContainer } from './TokenHeader.s';
import { Avatar, Typography } from '@mui/material';

interface TokenHeaderProps {
    tokenInfo: BackendTokenResponse;
}

const TokenHeader: FC<TokenHeaderProps> = (props) => {
    const { tokenInfo } = props;

    return (
        <HeaderContainer>
            <TitleHeaderContainer>
                <Avatar
                    variant="square"
                    alt={tokenInfo.ticker}
                    src="/path/to/logo"
                    sx={{ height: '2vw', width: '2vw' }}
                />
                <Title>{tokenInfo.ticker}</Title>
                <Rank>#69 - MOCK DATA</Rank>
            </TitleHeaderContainer>
            <PriceContainer>
                <Typography sx={{ fontWeight: '700', fontSize: '0.9vw' }}>69.20/Sompi</Typography>
                <Typography sx={{ fontSize: '0.9vw' }}>$0.0001</Typography>
            </PriceContainer>
        </HeaderContainer>
    );
};

export default TokenHeader;
