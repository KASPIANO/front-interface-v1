import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuIcon from '@mui/icons-material/Menu';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import {
    Avatar,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../main';
import { ThemeModes } from '../../utils/Utils';
import TokenSearch from '../token-search/TokenSearch';
import { ConnectButton, Logo, NavbarContainer, NavButton, NavCenter, WalletBalance } from './NavBar.s';
import { NavbarLayouts } from './NavbarLayouts';

interface NavbarProps {
    walletAddress: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
    network: string;
    onNetworkChange: (network: string) => void;
    walletBalance: number;
    walletConnected: boolean;
    setBackgroundBlur: (isFocused: boolean) => void;
    backgroundBlur: boolean;
}
const Navbar: React.FC<NavbarProps> = (props) => {
    const { walletBalance, walletConnected, disconnectWallet, connectWallet, setBackgroundBlur, backgroundBlur } =
        props;
    const [activePage, setActivePage] = useState('/');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const themeContext = useContext(ThemeContext);
    const navigate = useNavigate();

    const darkmode = themeContext.themeMode === ThemeModes.DARK;

    useEffect(() => {
        setActivePage(window.location.pathname);
    }, []);

    const handleNavButtonClick = (page: string) => {
        setActivePage(page);
        navigate(page);
        setDrawerOpen(false); // Close the drawer when a menu item is clicked
    };

    const formatNumberWithCommas = (value: number) => {
        const [integerPart] = value.toString().split('.');
        return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleConnectButton = () => {
        if (walletConnected) {
            disconnectWallet();
        } else {
            connectWallet();
        }
    };

    const toggleDrawer = (open) => {
        setDrawerOpen(open);
    };

    const LogoComponent = (
        <Logo onClick={() => handleNavButtonClick('/')} sx={{ display: 'flex', alignContent: 'center' }}>
            <Avatar
                src="/Logo.png"
                sx={{
                    width: '6.5vh',
                    height: '6.5vh',
                    marginTop: '0.8vh',
                    marginRight: '0.2vw',
                }}
            />
            <Typography variant="body2">Kaspiano</Typography>
        </Logo>
    );
    const SearchComponent = <TokenSearch setBackgroundBlur={setBackgroundBlur} />;

    const WalletComponent = (
        <>
            <WalletBalance>
                <Typography variant="body1" style={{ fontSize: '1vw', marginRight: '1vw' }}>
                    {formatNumberWithCommas(walletBalance)} KAS
                </Typography>
            </WalletBalance>
            <ConnectButton onClick={handleConnectButton}>
                {walletConnected ? 'Disconnect' : 'Connect'}
            </ConnectButton>
        </>
    );

    const ThemeComponent = darkmode ? (
        <Tooltip title={'Light Mode'} placement="bottom">
            <IconButton onClick={themeContext.toggleThemeMode}>
                <LightModeRoundedIcon />
            </IconButton>
        </Tooltip>
    ) : (
        <Tooltip title={'Dark Mode'} placement="bottom">
            <IconButton onClick={themeContext.toggleThemeMode}>
                <NightlightRoundIcon />
            </IconButton>
        </Tooltip>
    );

    const MenuComponent = (
        <>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ display: { xs: 'block', md: 'none' }, marginLeft: 'auto' }}
                onClick={() => toggleDrawer(true)}
            >
                <MenuIcon />
            </IconButton>
            <NavCenter sx={{ display: { xs: 'none', md: 'flex' } }}>
                <NavButton isActive={activePage === '/'} onClick={() => handleNavButtonClick('/')}>
                    KRC-20
                </NavButton>
                <NavButton isActive={activePage === '/deploy'} onClick={() => handleNavButtonClick('deploy')}>
                    Deploy
                </NavButton>
                <NavButton
                    isActive={activePage === '/portfolio'}
                    onClick={() => handleNavButtonClick('portfolio')}
                >
                    Portfolio
                </NavButton>
            </NavCenter>
        </>
    );
    const menuItems = (
        <>
            {isMobile && SearchComponent}
            <List>
                <ListItem onClick={() => handleNavButtonClick('/')}>
                    <ListItemText primary="KRC-20" />
                </ListItem>
                <ListItem onClick={() => handleNavButtonClick('/deploy')}>
                    <ListItemText primary="Deploy" />
                </ListItem>
                <ListItem onClick={() => handleNavButtonClick('/portfolio')}>
                    <ListItemText primary="Portfolio" />
                </ListItem>
            </List>
            {isMobile && WalletComponent}
            {isMobile && ThemeComponent}
        </>
    );
    return (
        <NavbarContainer sx={{ height: backgroundBlur ? '9vh' : '7vh' }}>
            <NavbarLayouts
                LogoComponent={LogoComponent}
                MenuComponent={MenuComponent}
                SearchComponent={SearchComponent}
                ThemeComponent={ThemeComponent}
                WalletComponent={WalletComponent}
            />
            <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
                {menuItems}
            </Drawer>
        </NavbarContainer>
    );
};

export default Navbar;
