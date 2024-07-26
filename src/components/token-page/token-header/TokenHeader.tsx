import { FC } from 'react';
import { HeaderContainer, Title } from './TokenHeader.s';
import { Avatar } from '@mui/material';
import { Token } from '../../../types/Types';

interface TokenHeaderProps {
    tokenInfo: Token;
}

const TokenHeader: FC<TokenHeaderProps> = (props) => {
    const { tokenInfo } = props;

    return (
        <HeaderContainer>
            {/* {/* <Avatar alt={tokenInfo.tick} src="/path/to/logo" /> */}
            {/* <Title>{tokenInfo.tick}</Title> */}
        </HeaderContainer>
    );
};

export default TokenHeader;
