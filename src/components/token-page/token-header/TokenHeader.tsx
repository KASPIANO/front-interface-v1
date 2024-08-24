import { FC } from 'react';
import { Token } from '../../../types/Types';
import { HeaderContainer, PriceContainer, Rank, Title, TitleHeaderContainer } from './TokenHeader.s';
import { Avatar, Typography } from '@mui/material';

interface TokenHeaderProps {
    tokenInfo: Token;
}

const TokenHeader: FC<TokenHeaderProps> = (props) => {
    const { tokenInfo } = props;

    return (
        <HeaderContainer>
            <TitleHeaderContainer>
                <Avatar
                    variant="square"
                    alt={tokenInfo.tick}
                    src="/path/to/logo"
                    sx={{ height: '2vw', width: '2vw' }}
                />
                <Title>{tokenInfo.tick}</Title>
                <Rank>#26</Rank>
            </TitleHeaderContainer>
            <PriceContainer>
                <Typography sx={{ fontWeight: '700', fontSize: '0.9vw' }}>420.69/Sompi</Typography>
                <Typography sx={{ fontSize: '0.9vw' }}>$0.0069</Typography>
            </PriceContainer>
        </HeaderContainer>
    );
};

export default TokenHeader;
