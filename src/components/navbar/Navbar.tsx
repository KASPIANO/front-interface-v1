import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
    ConnectButton,
    Logo,
    NavbarContainer,
    NavButton,
    NavButtons,
    NavCenter,
    SearchContainer,
} from './NavBar.s';
import InputAdornment from '@mui/material/InputAdornment';
import { TokenResponse } from '../../types/Types';

interface Token {
    symbol: string;
    name: string;
    logoURI: string;
}

interface NavbarProps {
    walletAddress: string | null;
    connectWallet: () => void;
    tokens: TokenResponse[];
    network: string;
    onNetworkChange: (network: string) => void;
}

const Navbar: React.FC<NavbarProps> = (props) => {
    const { walletAddress, connectWallet } = props;
    const [activePage, setActivePage] = useState('Swap');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleTokenSelect = (token: Token) => {
        console.log('Selected token:', token);
        setIsModalOpen(false);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
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
                    <NavButton isActive={activePage === 'Swap'} onClick={() => setActivePage('Swap')}>
                        Trade
                    </NavButton>
                    <NavButton
                        isActive={activePage === 'Limit Order'}
                        onClick={() => setActivePage('Limit Order')}
                    >
                        Resources
                    </NavButton>
                    <NavButton isActive={activePage === 'positions'} onClick={() => setActivePage('positions')}>
                        Positions
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
                <ConnectButton onClick={connectWallet}>
                    {walletAddress ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-4)}` : 'Connect'}
                </ConnectButton>
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
