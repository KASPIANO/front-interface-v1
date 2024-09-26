import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuIcon from '@mui/icons-material/Menu';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import { Avatar, Drawer, IconButton, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../main';
import { ThemeModes } from '../../utils/Utils';
import TokenSearch from '../token-search/TokenSearch';
import { ConnectButton, Logo, NavbarContainer, NavButton, NavCenter } from './NavBar.s';

interface NavbarProps {
    walletAddress: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
    network: string;
    walletBalance: number;
    walletConnected: boolean;
    setBackgroundBlur: (isFocused: boolean) => void;
    backgroundBlur: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
    walletBalance,
    walletConnected,
    disconnectWallet,
    connectWallet,
    setBackgroundBlur,
    backgroundBlur,
}) => {
    const [activePage, setActivePage] = useState('/KRC-20');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const themeContext = useContext(ThemeContext);
    const navigate = useNavigate();
    const isDarkMode = themeContext.themeMode === ThemeModes.DARK;

    useEffect(() => {
        setActivePage(window.location.pathname);
    }, []);

    const handleNavButtonClick = (page: string) => {
        setActivePage(page);
        navigate(page);
        setDrawerOpen(false); // Close drawer on navigation in mobile
    };

    const formatNumberWithCommas = (value: number) => value.toLocaleString();

    const handleConnectButton = () => {
        if (walletConnected) disconnectWallet();
        else connectWallet();
    };

    return (
        <NavbarContainer sx={{ height: backgroundBlur ? '9vh' : '7vh', display: 'flex', alignItems: 'center' }}>
            {/* Responsive Hamburger Menu for Mobile */}
            <IconButton
                sx={{ display: { xs: 'flex', md: 'none' }, marginRight: 'auto' }}
                onClick={() => setDrawerOpen(true)}
            >
                <MenuIcon />
            </IconButton>

            {/* Logo and Connect Button on the left */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <ConnectButton
                    onClick={handleConnectButton}
                    sx={{ marginLeft: '1vw', display: { xs: 'flex', md: 'none' } }}
                >
                    {walletConnected ? 'Disconnect' : 'Connect'}
                </ConnectButton>
                <Logo
                    onClick={() => handleNavButtonClick('/KRC-20')}
                    sx={{ display: 'flex', alignItems: 'center', marginRight: '1vw' }}
                >
                    <Avatar
                        src="/Logo.png"
                        sx={{
                            width: '6.5vh',
                            height: '6.5vh',
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{ display: { xs: 'none', md: 'block' }, marginLeft: '0.5vw', fontWeight: 'bold' }}
                    >
                        Kaspiano
                    </Typography>
                </Logo>
            </div>

            {/* Drawer Menu */}
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <List>
                    {['KRC-20', 'deploy', 'portfolio', 'airdrop'].map((page) => (
                        <ListItem key={page} onClick={() => handleNavButtonClick(page)}>
                            <ListItemText primary={page.charAt(0).toUpperCase() + page.slice(1)} />
                        </ListItem>
                    ))}
                    {/* Include TokenSearch in the Drawer */}
                    <ListItem>
                        <TokenSearch isMobile={true} setBackgroundBlur={setBackgroundBlur} />
                    </ListItem>
                    {/* Wallet Balance */}
                    <ListItem>
                        <Typography variant="body1" style={{ fontSize: '0.8rem', marginRight: '1vw' }}>
                            {formatNumberWithCommas(walletBalance)} KAS
                        </Typography>
                    </ListItem>
                    {/* Theme Toggle */}
                    <ListItem>
                        <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'} placement="bottom">
                            <IconButton onClick={themeContext.toggleThemeMode}>
                                {isDarkMode ? <LightModeRoundedIcon /> : <NightlightRoundIcon />}
                            </IconButton>
                        </Tooltip>
                    </ListItem>
                </List>
            </Drawer>

            {/* Full Navigation for Larger Screens */}
            <NavCenter sx={{ display: { xs: 'none', md: 'flex' } }}>
                {['KRC-20   ', 'deploy', 'portfolio', 'airdrop'].map((page) => (
                    <NavButton
                        key={page}
                        isActive={activePage === page}
                        onClick={() => handleNavButtonClick(page)}
                    >
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                    </NavButton>
                ))}
            </NavCenter>
            <TokenSearch isMobile={false} setBackgroundBlur={setBackgroundBlur} />
            <Typography variant="body1" style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                {formatNumberWithCommas(walletBalance)} KAS
            </Typography>
            <Tooltip
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                placement="bottom"
                sx={{ display: { xs: 'none', md: 'flex' } }}
            >
                <IconButton onClick={themeContext.toggleThemeMode}>
                    {isDarkMode ? <LightModeRoundedIcon /> : <NightlightRoundIcon />}
                </IconButton>
            </Tooltip>
            <ConnectButton
                onClick={handleConnectButton}
                sx={{ marginLeft: '0.2rem', display: { xs: 'none', md: 'flex' } }}
            >
                {walletConnected ? 'Disconnect' : 'Connect'}
            </ConnectButton>
        </NavbarContainer>
    );
};

export default Navbar;
