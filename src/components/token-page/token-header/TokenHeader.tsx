import { Avatar } from '@mui/material';
import { FC } from 'react';
import { Token } from '../../../types/Types';
import { HeaderContainer, Title } from './TokenHeader.s';

interface TokenHeaderProps {
    tokenInfo: Token;
}

const TokenHeader: FC<TokenHeaderProps> = (props) => {
    const { tokenInfo } = props;

    return (
        <HeaderContainer>
            {/* {/* <Avatar alt={tokenInfo.tick} src="/path/to/logo" /> */}
            <Title>{tokenInfo.tick}</Title>
        </HeaderContainer>
    );
};

export default TokenHeader;
