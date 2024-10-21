import { Typography, IconButton, Box, Tooltip } from '@mui/material';
import { FC } from 'react';
import {
    HeaderContainer,
    NextPageButton,
    PrevPageButton,
    SortButtonGroup,
    SortFirstButton,
    SortLastButton,
    SortMiddleButton,
} from './GridTitle.s';
import { FireIcon } from './FireIcon';

interface TokenGridTitleProps {
    timeInterval: string;
    setTimeInterval: (timeInterval: string) => void;
    currentPage: number;
    totalPages?: number;
    onPageChange?: (newPage: number) => void;
    onSortBy: (field: string, asc: boolean) => void;
    isLoading: boolean;
    setActiveHeader: (value: string) => void;
    changeTotalMintsDisabled: boolean;
    setChangeTotalMintsActive: (value: boolean) => void;
}

const GridTitle: FC<TokenGridTitleProps> = (props) => {
    const {
        timeInterval,
        setTimeInterval,
        onSortBy,
        onPageChange,
        currentPage,
        totalPages,
        setActiveHeader,
        changeTotalMintsDisabled,
        setChangeTotalMintsActive,
    } = props;

    const handleSortChange = (sortOption: string) => {
        setTimeInterval(sortOption);
    };

    const handleMintingRateSort = () => {
        // Handle sorting by minting rate
        const orderedBy = changeTotalMintsDisabled ? 'changeTotalMints' : 'ticker';
        const orderedByAsc = orderedBy !== 'ticker';
        setChangeTotalMintsActive(!changeTotalMintsDisabled);
        setActiveHeader('');
        onSortBy(orderedBy, orderedByAsc);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <HeaderContainer>
            {/* Fire Icon Button for Minting Rate Sort */}

            <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', marginLeft: '1vw' }}>Top KRC-20</Typography>

            {/* Pagination Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PrevPageButton onClick={handlePrevPage} disabled={currentPage === 0}>
                    Prev
                </PrevPageButton>
                <NextPageButton onClick={handleNextPage}>Next</NextPageButton>
            </Box>

            {/* Sort Time Period Buttons */}
            <Tooltip title="Sort by the pace and change of minting activity. Mint heat-map.">
                <IconButton
                    onClick={handleMintingRateSort}
                    sx={{
                        marginLeft: 'auto',
                    }}
                    aria-label="sort by minting rate"
                >
                    <FireIcon selected={!changeTotalMintsDisabled} />
                    {/* <WhatshotRoundedIcon
                        sx={{
                            color: '#ff0000',
                            borderRadius: '12px',
                            backgroundColor: changeTotalMintsDisabled ? 'transparent' : 'rgba(255, 0, 0, 0.35)',
                        }}
                    /> */}
                </IconButton>
            </Tooltip>

            <SortButtonGroup variant="contained" sx={{ marginLeft: '1vw' }}>
                <SortFirstButton
                    selected={timeInterval === '1m'}
                    sx={{
                        '&.MuiButtonGroup-firstButton': {
                            backgroundColor:
                                timeInterval === '1m' ? 'rgba(111, 199, 186, 0.8)' : 'rgba(111, 199, 186, 0.25)',
                        },
                    }}
                    onClick={() => handleSortChange('1m')}
                >
                    1m
                </SortFirstButton>
                <SortMiddleButton selected={timeInterval === '5m'} onClick={() => handleSortChange('5m')}>
                    5m
                </SortMiddleButton>
                <SortMiddleButton selected={timeInterval === '10m'} onClick={() => handleSortChange('10m')}>
                    10m
                </SortMiddleButton>
                <SortMiddleButton selected={timeInterval === '30m'} onClick={() => handleSortChange('30m')}>
                    30m
                </SortMiddleButton>
                <SortMiddleButton selected={timeInterval === '1h'} onClick={() => handleSortChange('1h')}>
                    1h
                </SortMiddleButton>
                <SortMiddleButton selected={timeInterval === '6h'} onClick={() => handleSortChange('6h')}>
                    6h
                </SortMiddleButton>
                <SortMiddleButton selected={timeInterval === '12h'} onClick={() => handleSortChange('12h')}>
                    12h
                </SortMiddleButton>
                <SortMiddleButton selected={timeInterval === '1d'} onClick={() => handleSortChange('1d')}>
                    1d
                </SortMiddleButton>
                <SortMiddleButton selected={timeInterval === '7d'} onClick={() => handleSortChange('7d')}>
                    7d
                </SortMiddleButton>
                <SortLastButton selected={timeInterval === '30d'} onClick={() => handleSortChange('30d')}>
                    30d
                </SortLastButton>
            </SortButtonGroup>
        </HeaderContainer>
    );
};

export default GridTitle;
