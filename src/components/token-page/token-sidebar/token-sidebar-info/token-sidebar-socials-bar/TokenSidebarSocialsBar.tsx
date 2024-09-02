import { FC } from 'react';
import { TokenSidebarSocialsBarGroup, TokenSidebarSocialsBarButton } from './TokenSidebarSocialsBar.s';
import TelegramIcon from '@mui/icons-material/Telegram';
import LanguageIcon from '@mui/icons-material/Language';
import XIcon from '@mui/icons-material/X';

export type TokenSidebarSocialsBarOptions = {
    telegram?: string;
    website?: string;
    x?: string;
};

const socialIcons: { [key: string]: JSX.Element } = {
    telegram: <TelegramIcon sx={{ height: '1.1vw', width: '1.1vw', marginRight: '2px' }} />,
    website: <LanguageIcon sx={{ height: '1.1vw', width: '1.1vw', marginRight: '2px' }} />,
    x: <XIcon sx={{ height: '1.1vw', width: '1.1vw', marginRight: '2px' }} />,
};
interface TokenSidebarSocialsBarProps {
    options: TokenSidebarSocialsBarOptions;
}

const TokenSidebarSocialsBar: FC<TokenSidebarSocialsBarProps> = (props) => {
    const openLink = (link: string) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

    return (
        <TokenSidebarSocialsBarGroup>
            {Object.keys(props.options).map((key) => (
                <TokenSidebarSocialsBarButton key={key} onClick={() => openLink(props.options[key])}>
                    {socialIcons[key]}
                    {capitalizeFirstLetter(key) === 'X' ? '' : capitalizeFirstLetter(key)}
                </TokenSidebarSocialsBarButton>
            ))}
        </TokenSidebarSocialsBarGroup>
    );
};

export default TokenSidebarSocialsBar;
