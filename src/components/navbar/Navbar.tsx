// import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
// import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { FormControl, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { ThemeContext } from '../../main';
// import { formatNumberWithCommas, ThemeModes } from '../../utils/Utils';
import {
    ConnectButton,
    Logo,
    NavbarContainer,
    NavButton,
    NavButtons,
    NavCenter,
    NetworkSelect,
    NetworkSelectItem,
    SearchContainer,
    WalletBalance,
} from './NavBar.s';

interface NavbarProps {
    walletAddress: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
    network: string;
    onNetworkChange: (network: string) => void;
    walletBalance: number;
    walletConnected: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
    const { walletBalance, walletConnected, network, onNetworkChange, disconnectWallet, connectWallet } = props;
    const [activePage, setActivePage] = useState('/');
    // const themeContext = useContext(ThemeContext);
    const [, setSearchValue] = useState('');
    const navigate = useNavigate();
    // const darkmode = themeContext.themeMode === ThemeModes.DARK;

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleNavButtonClick = (page: string) => {
        setActivePage(page);
        navigate(page);
    };

    const formatNumberWithCommas = (value: number) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const handleConnectButton = () => {
        if (walletConnected) {
            disconnectWallet();
        } else {
            connectWallet();
        }
    };

    return (
        <NavbarContainer>
            <Logo>
                <Link to="/">
                    <img src="/logo.svg" alt="Logo" width={150} height={60} />
                </Link>
            </Logo>
            <NavCenter>
                <NavButton isActive={activePage === '/'} onClick={() => handleNavButtonClick('/')}>
                    KRC-20
                </NavButton>
                <NavButton isActive={activePage === 'deploy'} onClick={() => handleNavButtonClick('deploy')}>
                    Deploys
                </NavButton>
                <NavButton isActive={activePage === 'portfolio'} onClick={() => handleNavButtonClick('portfolio')}>
                    Portfolio
                </NavButton>
            </NavCenter>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <SearchContainer
                    type="search"
                    placeholder={'Search KRC-20 Tokens'}
                    value={''}
                    onChange={(event) => handleSearch(event as React.ChangeEvent<HTMLInputElement>)}
                    sx={{
                        '& input': {
                            fontSize: '1.1vw',
                        },
                        '& input::placeholder': {
                            fontSize: '1.1vw',
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon sx={{ fontSize: '3vh', color: 'white' }} />
                            </InputAdornment>
                        ),
                        style: {
                            height: '3.5vh',
                            width: '20vw',
                        },
                    }}
                />
                <WalletBalance>
                    <Typography variant="body1" style={{ fontSize: '1vw', marginRight: '1vw' }}>
                        {formatNumberWithCommas(walletBalance)} KAS
                    </Typography>
                </WalletBalance>
                <ConnectButton onClick={() => handleConnectButton()}>
                    {walletConnected ? 'Disconnect' : 'Connect'}
                </ConnectButton>
                <FormControl variant="outlined" size="small" sx={{ marginLeft: '1vw' }}>
                    <NetworkSelect
                        value={network}
                        onChange={(event) => onNetworkChange(event.target.value as string)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <NetworkSelectItem value="mainnet">Mainnet</NetworkSelectItem>
                        <NetworkSelectItem value="testnet">Testnet</NetworkSelectItem>
                    </NetworkSelect>
                </FormControl>
                {/* {darkmode ? (
                    <Tooltip title={'Light Mode'} placement="bottom">
                        <IconButton sx={{ padding: '2px' }} onClick={themeContext.toggleThemeMode}>
                            <LightModeRoundedIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title={'Dark Mode'} placement="bottom">
                        <IconButton sx={{ padding: '2px' }} onClick={themeContext.toggleThemeMode}>
                            <NightlightRoundIcon />
                        </IconButton>
                    </Tooltip>
                )} */}
            </div>
            {/* {isModalOpen && (
                <TokenSearchModal
                    tokens={tokens}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handleTokenSelect}
                />
            )} */}
        </NavbarContainer>
    );
};

export default Navbar;
