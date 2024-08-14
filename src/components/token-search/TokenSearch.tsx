import React, { FC,  useRef, useState } from 'react';
import { InputAdornment, Box, Avatar, Autocomplete, MenuItem, Skeleton } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { TokenSearchItems } from '../../types/Types';
import { SearchContainer } from './TokenSearch.s';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { searchToken } from '../../DAL/BackendDAL';
import axios, { CancelTokenSource } from 'axios';

const styles = `
  input[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
      appearance: none;
  }
`;

interface TokenSearchProps {
    setBackgroundBlur: (isFocused: boolean) => void;
}

const TokenSearch: FC<TokenSearchProps> = (props) => {
    const { setBackgroundBlur } = props;
    const [isFocused, setIsFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [tokens, setTokens] = useState<TokenSearchItems[]>([]);
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const cancelTokenRef = useRef<CancelTokenSource>(null);

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
        }, 500),
    ).current; // 500ms debounce time

    const handleFetchingTokens = (query: string) => {
        if (query && query.length > 0) {
            setLoading(true);
            debouncedSearch(query);
        } else {
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel('Operation canceled due to empty search.');
            }
            setTokens([]);
        }
    };

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
            setSearchValue('');
        } else {
            setSearchValue(value);
        }

        handleFetchingTokens(value);
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
                filterOptions={(x) => x}
                inputValue={searchValue}
                onInputChange={handleSearchChange}
                getOptionLabel={(option: TokenSearchItems) => (option.ticker ? option.ticker : '')}
                onChange={handleTokenSelect}
                options={showOptions ? (loading ? loadingArray : tokens) : []} // Show options only when focused
                renderOption={(props, option) => (
                    <MenuItem {...props} key={option.ticker} sx={{ width: '30vw' }}>
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
                            <Skeleton key={`${option.ticker}-s2`} variant="text" width={100} sx={{ ml: 1 }} />
                        ) : (
                            option.ticker
                        )}
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
