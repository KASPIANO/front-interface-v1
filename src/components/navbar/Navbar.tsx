import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
    ConnectButton,
    Logo,
    NavbarContainer,
    NavButton,
    NavButtons,
    NavCenter,
    NetworkSelect,
    SearchContainer,
    WalletBalance,
} from './NavBar.s';
import InputAdornment from '@mui/material/InputAdornment';
import { FormControl, IconButton, MenuItem, Tooltip, Typography } from '@mui/material';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';

interface NavbarProps {
    walletAddress: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
    network: string;
    onNetworkChange: (network: string) => void;
    walletBalance: number;
    walletConnected: boolean;
    toggleDarkMode: () => void;
    darkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
    const {
        walletBalance,
        walletConnected,
        darkMode,
        toggleDarkMode,
        network,
        onNetworkChange,
        disconnectWallet,
        connectWallet,
    } = props;
    const [activePage, setActivePage] = useState('/');
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const networkLogo = !darkMode
        ? 'https://kaspa.org/wp-content/uploads/2023/08/Kaspa-LDSP-Dark-Full-Color.svg'
        : 'https://kaspa.org/wp-content/uploads/2023/06/Kaspa-LDSP-Dark-Reverse.svg';

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleNavButtonClick = (page: string) => {
        setActivePage(page);
        navigate(page);
    };

    return (
        <NavbarContainer>
            <Logo>
                <Link to="/">
                    <img src="/logo.svg" alt="Logo" width={150} height={60} />
                </Link>
            </Logo>
            <NavCenter>
                <NavButtons>
                    <NavButton isActive={activePage === '/'} onClick={() => handleNavButtonClick('/')}>
                        KRC-20
                    </NavButton>
                    <NavButton isActive={activePage === 'deploy'} onClick={() => handleNavButtonClick('deploy')}>
                        Deploy
                    </NavButton>
                    <NavButton
                        isActive={activePage === 'portfolio'}
                        onClick={() => handleNavButtonClick('portfolio')}
                    >
                        Portfolio
                    </NavButton>
                </NavButtons>
            </NavCenter>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <SearchContainer
                    type="search"
                    placeholder={'Search KRC-20 Tokens'}
                    value={''}
                    onChange={(event) => setSearchValue(event.target.value)}
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
                        {walletBalance} KAS
                    </Typography>
                </WalletBalance>
                <ConnectButton onClick={walletConnected ? disconnectWallet : connectWallet}>
                    {walletConnected ? 'Disconnect' : 'Connect'}
                </ConnectButton>
                <FormControl variant="outlined" size="small" sx={{ marginLeft: '1vw' }}>
                    <NetworkSelect
                        value={network}
                        onChange={(event) => onNetworkChange(event.target.value as string)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value="mainnet">
                            <img src={networkLogo} alt="Mainnet" style={{ width: '20px', marginRight: '8px' }} />
                            Mainnet
                        </MenuItem>
                        <MenuItem value="testnet">
                            <img src={networkLogo} alt="Testnet" style={{ width: '20px', marginRight: '8px' }} />
                            Testnet
                        </MenuItem>
                    </NetworkSelect>
                </FormControl>
                {darkMode ? (
                    <Tooltip title={'Light Mode'} placement="bottom">
                        <IconButton sx={{ padding: '4px' }} onClick={toggleDarkMode}>
                            <LightModeRoundedIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title={'Dark Mode'} placement="bottom">
                        <IconButton sx={{ padding: '4px' }} onClick={toggleDarkMode}>
                            <NightlightRoundIcon />
                        </IconButton>
                    </Tooltip>
                )}
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
