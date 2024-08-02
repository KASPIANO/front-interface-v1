import { FC } from 'react';

import { TokenSidebarSocialsBarButton, TokenSidebarSocialsBarGroup } from './TokenSidebarSocialsBar.s';

export type TokenSidebarSocialsBarOptions = {
    [socialName: string]: string;
};

interface TokenSidebarSocialsBarProps {
    options: TokenSidebarSocialsBarOptions;
}

const TokenSidebarSocialsBar: FC<TokenSidebarSocialsBarProps> = (props) => {
    const openLink = (link) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };
    
    return (
    <TokenSidebarSocialsBarGroup>
        {Object.keys(props.options).map((key) => (
            <TokenSidebarSocialsBarButton key={key} onClick={() => openLink(props.options[key])}>{key || props.options[key]}</TokenSidebarSocialsBarButton>
        ))}
    </TokenSidebarSocialsBarGroup>
)};

export default TokenSidebarSocialsBar;
