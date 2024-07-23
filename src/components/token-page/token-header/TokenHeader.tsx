import React, { FC } from 'react';
import { HeaderContainer, Title, Subtitle } from './TokenHeader.s';
import { Avatar } from '@mui/material';

interface TokenHeaderProps {
    tokenInfo: any;
}

const TokenHeader: FC<TokenHeaderProps> = (props) => {
    const { tokenInfo } = props;

    return (
        <HeaderContainer>
            <Avatar src={tokenInfo.logoURI} alt="Token Logo" />
            <Title>{tokenInfo.name}</Title>
            <Subtitle>{tokenInfo.subtitle}</Subtitle>
        </HeaderContainer>
    );
};

export default TokenHeader;
