// TokenSearch.tsx

import React, { FC, useState } from 'react';
import { InputAdornment, Box, Avatar, Autocomplete, MenuItem } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import debounce from 'lodash/debounce';
import { TokenSearchItems } from '../../types/Types';
import { SearchContainer } from './TokenSearch.s';

const mockTokens: TokenSearchItems[] = [
    { ticker: 'KASPER', logo: '/kasper.svg' },
    { ticker: 'NACHO', logo: '/nacho.svg' },
    { ticker: 'KEKE', logo: '/keke.jpg' },
    { ticker: 'KSPR', logo: '/kspr.jpg' },
];

interface TokenSearchProps {
    setBackgroundBlur: (isFocused: boolean) => void;
}

const TokenSearch: FC<TokenSearchProps> = (props) => {
    const { setBackgroundBlur } = props;
    const [isFocused, setIsFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [tokens, setTokens] = useState<TokenSearchItems[]>(mockTokens);
    const [showOptions, setShowOptions] = useState(false);

    const fetchTokens = debounce((query: string) => {
        const filteredTokens = mockTokens.filter((token) =>
            token.ticker.toLowerCase().includes(query.toLowerCase()),
        );
        setTokens(filteredTokens);
    }, 300);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        fetchTokens(event.target.value);
    };

    const handleFocus = () => {
        setIsFocused(true);
        setTimeout(() => {
            setShowOptions(true);
        }, 1000);
        setBackgroundBlur(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setShowOptions(false);
        setBackgroundBlur(false);
    };

    return (
        <Box
            sx={{
                marginRight: '1.5vw',
            }}
        >
            <Autocomplete
                sx={{
                    height: '3.5vh',
                    width: isFocused ? '30vw' : '15vw',
                    transition: 'width 0.3s ease',
                }}
                freeSolo
                options={showOptions ? tokens : []} // Show options only when focused
                renderOption={(props, option) => (
                    <MenuItem {...props} sx={{ width: '30vw' }}>
                        <Avatar src={option.logo} alt={option.ticker} sx={{ width: 24, height: 24, mr: 1 }} />
                        {option.ticker}
                    </MenuItem>
                )}
                renderInput={(params) => (
                    <SearchContainer
                        {...params}
                        placeholder="Search KRC-20 Tokens"
                        value={searchValue}
                        onChange={handleSearchChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon sx={{ fontSize: '1vw' }} />
                                </InputAdornment>
                            ),
                            sx: {
                                height: isFocused ? '5vh' : '3.5vh',
                                display: 'flex',
                                alignItems: 'center',
                            },
                        }}
                        sx={{
                            height: isFocused ? '5vh' : '3.5vh',
                            '& input': {
                                fontSize: '0.8vw',
                                textAlign: 'start',
                                width: '30vw',
                            },
                            '& input::placeholder': {
                                fontSize: '0.8vw',
                                textAlign: 'start',
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default TokenSearch;
