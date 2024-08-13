import { FC, useRef, useState } from 'react';
import { InputAdornment, Box, Avatar, Autocomplete, MenuItem } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { TokenSearchItems } from '../../types/Types';
import { SearchContainer } from './TokenSearch.s';
import { useNavigate } from 'react-router-dom';

const styles = `
  input[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
  }
`;
const mockTokens: TokenSearchItems[] = [
    { ticker: 'SIRIUS', logo: '/kasper.svg' },
    { ticker: 'NOCBDC', logo: '/nacho.svg' },
    { ticker: 'KSBULL', logo: '/keke.jpg' },
    { ticker: 'SIONE', logo: '/kspr.jpg' },
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
    const navigate = useNavigate();

    // const fetchTokens = debounce((query: string) => {
    //     const filteredTokens = mockTokens.filter((token) =>
    //         token.ticker.toLowerCase().includes(query.toLowerCase()),
    //     );
    //     setTokens(filteredTokens);
    // }, 300);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleFocus = () => {
        setIsFocused(true);
        setBackgroundBlur(true);
        setTimeout(() => {
            setShowOptions(true);
        }, 600);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setShowOptions(false);
        setBackgroundBlur(false);
    };

    const handleSearchChange = (_event: React.SyntheticEvent, value: string) => {
        if (value.length === 0) {
            setTokens(mockTokens);
            setSearchValue('');
        } else {
            setSearchValue(value);
            // fetchTokens(value);
        }
    };

    const handleTokenSelect = (_event: any, value: TokenSearchItems | null) => {
        if (value) {
            navigate(`/token/${value.ticker}`);
            setIsFocused(false);
            setShowOptions(false);
            setBackgroundBlur(false);
            setSearchValue('');
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }
    };

    return (
        <Box
            sx={{
                marginRight: '1.5vw',
            }}
        >
            <style>{styles}</style>
            <Autocomplete
                sx={{
                    height: '3.5vh',
                    width: isFocused ? '30vw' : '15vw',
                    transition: 'width 0.2s ease',
                }}
                autoSelect={false}
                freeSolo
                inputValue={searchValue}
                onInputChange={handleSearchChange}
                getOptionLabel={(option: TokenSearchItems) => (option.ticker ? option.ticker : '')}
                onChange={handleTokenSelect}
                options={showOptions ? tokens : []} // Show options only when focused
                renderOption={(props, option) => (
                    <MenuItem {...props} key={option.ticker} sx={{ width: '30vw' }}>
                        <Avatar src={option.logo} alt={option.ticker} sx={{ width: 24, height: 24, mr: 1 }} />
                        {option.ticker}
                    </MenuItem>
                )}
                renderInput={(params) => (
                    <SearchContainer
                        {...params}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Search KRC-20 Tokens"
                        inputRef={inputRef}
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
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
