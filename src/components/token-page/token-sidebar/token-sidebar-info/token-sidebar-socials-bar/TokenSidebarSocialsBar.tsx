import { FC } from 'react';
import { TokenSidebarSocialsBarGroup, TokenSidebarSocialsBarButton } from './TokenSidebarSocialsBar.s';
import TelegramIcon from '@mui/icons-material/Telegram';
import LanguageIcon from '@mui/icons-material/Language';
import XIcon from '@mui/icons-material/X';

export type TokenSidebarSocialsBarOptions = {
    [socialName: string]: string;
};

const socialIcons: { [key: string]: JSX.Element } = {
    Telegram: <TelegramIcon sx={{ height: '1.1vw', width: '1.1vw', marginRight: '2px' }} />,
    Website: <LanguageIcon sx={{ height: '1.1vw', width: '1.1vw', marginRight: '2px' }} />,
    Twitter: <XIcon sx={{ height: '1.1vw', width: '1.1vw', marginRight: '2px' }} />,
};
interface TokenSidebarSocialsBarProps {
    options: TokenSidebarSocialsBarOptions;
}

const TokenSidebarSocialsBar: FC<TokenSidebarSocialsBarProps> = (props) => {
    const openLink = (link: string) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    return (
        <TokenSidebarSocialsBarGroup>
            {Object.keys(props.options).map((key) => (
                <TokenSidebarSocialsBarButton key={key} onClick={() => openLink(props.options[key])}>
                    {socialIcons[key]} {key}
                </TokenSidebarSocialsBarButton>
            ))}
        </TokenSidebarSocialsBarGroup>
    );
};

export default TokenSidebarSocialsBar;
