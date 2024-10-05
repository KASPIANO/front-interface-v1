import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Autocomplete, Avatar, Box, InputAdornment, MenuItem, Skeleton } from '@mui/material';
import axios, { CancelTokenSource } from 'axios';
import { debounce } from 'lodash';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchToken } from '../../DAL/BackendDAL';
import { TokenSearchItems } from '../../types/Types';
import { GlobalStyleAutoComplete, GlobalStyleTokenSideBar } from '../../utils/GlobalStyleScrollBar';
import { SearchContainer } from './TokenSearch.s';

const styles = `
  input[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
  }
`;

interface TokenSearchProps {
    setBackgroundBlur: (isFocused: boolean) => void;
    isMobile?: boolean;
}

const TokenSearch: FC<TokenSearchProps> = (props) => {
    const { setBackgroundBlur } = props;
    const [isFocused, setIsFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [tokens, setTokens] = useState<TokenSearchItems[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const transitionDuration = 200;
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/KRC-20') {
            setSearchValue(''); // Clear the search value
        }
    }, [location.pathname]); // Trigger this useEffect whenever the path changes

    const cancelTokenRef = useRef<CancelTokenSource>(null);
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsFocused(false);
            setShowOptions(false);
            setBackgroundBlur(false);
        } else if (event.key === 'Enter') {
            // Handle Enter key press
            if (tokens.length > 0) {
                navigate(`/token/${tokens[0].ticker}`);
                setIsFocused(false);
                setShowOptions(false);
                setBackgroundBlur(false);
                setSearchValue('');
            }
        }
    };
    const loadingArray = useRef(
        Array(5)
            .fill(null)
            .map((_, i) => ({ ticker: `loading-${i}`, logo: `loading-${i}` })),
    ).current;

    const debouncedSearch = useRef(
        debounce(async (query) => {
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel('Operation canceled due to new request.');
            }

            cancelTokenRef.current = axios.CancelToken.source();

            try {
                const resultTokens = await searchToken(query, cancelTokenRef.current.token);
                setTokens(resultTokens);

                setLoading(false);
            } catch (err) {
                if (!axios.isCancel(err)) {
                    // Show Error
                    console.error('An error occurred while searching tickers.');
                    console.error(err);
                    setLoading(false);
                }
            }
        }, 300),
    ).current; // 500ms debounce time

    const handleFetchingTokens = useCallback(
        (query: string) => {
            if (query && query.length > 0) {
                setTokens([]);
                setLoading(true);
                debouncedSearch(query);
            } else {
                if (cancelTokenRef.current) {
                    cancelTokenRef.current.cancel('Operation canceled due to empty search.');
                }
                setTokens([]);
                setLoading(false);
            }
        },
        [debouncedSearch],
    );

    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleFocus = () => {
        handleFetchingTokens(searchValue);
        setIsFocused(true);
        setBackgroundBlur(true);
        setIsTransitioning(true);
        setTimeout(() => {
            setIsTransitioning(false);
            setShowOptions(true);
        }, transitionDuration);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setShowOptions(false);
        setBackgroundBlur(false);
    };

    const handleSearchChange = useCallback(
        (_event: React.SyntheticEvent, value: string) => {
            setSearchValue(value);
            handleFetchingTokens(value);
        },
        [handleFetchingTokens],
    );

    const handleTokenSelect = (_event: any, value: TokenSearchItems | null) => {
        if (value && value.ticker) {
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
        <>
            <GlobalStyleTokenSideBar />
            <Box
                sx={{
                    marginRight: '1.5vw',
                    display: props.isMobile ? { xs: 'flex', md: 'none' } : { xs: 'none', md: 'flex' },
                }}
            >
                <style>{styles}</style>
                <GlobalStyleAutoComplete />
                <Autocomplete
                    sx={{
                        height: '3.5vh',
                        width: isFocused ? '30vw' : '15vw',
                        transition: 'width 0.2s ease',
                        '& .MuiAutocomplete-listbox': {
                            overflowX: 'hidden', // Hide horizontal scrollbar
                        },
                        '& .MuiAutocomplete-popper': {
                            width: '30vw !important', // Force the popper to be the same width as the expanded input
                        },
                    }}
                    open={showOptions && !isTransitioning}
                    autoSelect={false}
                    freeSolo
                    filterOptions={(x) => x}
                    inputValue={searchValue}
                    onKeyDown={handleKeyDown}
                    onInputChange={handleSearchChange}
                    getOptionLabel={(option: TokenSearchItems) => (option.ticker ? option.ticker : '')}
                    onChange={handleTokenSelect}
                    options={showOptions && searchValue ? (loading ? loadingArray : tokens) : []} // Show options only when focused
                    renderOption={(props, option) => (
                        <MenuItem {...props} key={`{option.ticker}`} sx={{ width: '28vw' }}>
                            {loading ? (
                                <Skeleton key={`${option.ticker}-s1`} variant="circular" width={24} height={24} />
                            ) : (
                                <Avatar
                                    key={`${option.ticker}-avatar`}
                                    src={option.logo}
                                    alt={option.ticker}
                                    sx={{ width: 24, height: 24, mr: 1 }}
                                />
                            )}
                            {loading ? (
                                <Skeleton
                                    key={`${option.ticker}-s2`}
                                    variant="text"
                                    width={100}
                                    sx={{ ml: 1, lg: 1, sm: 1 }}
                                />
                            ) : (
                                option.ticker
                            )}
                        </MenuItem>
                    )}
                    renderInput={(params) => (
                        <SearchContainer
                            onKeyDown={handleKeyDown}
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
                                        <SearchRoundedIcon sx={{ fontSize: '0.8rem' }} />
                                    </InputAdornment>
                                ),
                                onKeyDown: handleKeyDown,
                                sx: {
                                    height: isFocused ? '5vh' : '3.5vh',
                                    display: 'flex',
                                    alignItems: 'center',
                                },
                            }}
                            sx={{
                                height: isFocused ? '5vh' : '3.5vh',
                                '& input': {
                                    fontSize: '0.7rem',
                                    textAlign: 'start',
                                },
                                '& input::placeholder': {
                                    fontSize: '0.7rem',
                                    textAlign: 'start',
                                },
                            }}
                        />
                    )}
                />
            </Box>
        </>
    );
};

export default TokenSearch;
