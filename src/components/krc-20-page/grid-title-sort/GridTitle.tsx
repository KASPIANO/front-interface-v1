import { Typography, IconButton, Box, Tooltip, CircularProgress } from '@mui/material';
import { FC, useState } from 'react';
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded';
import {
    HeaderContainer,
    NextPageButton,
    PrevPageButton,
    SortButtonGroup,
    SortFirstButton,
    SortLastButton,
    SortMiddleButton,
} from './GridTitle.s';

interface TokenGridTitleProps {
    timeInterval: string;
    setTimeInterval: (timeInterval: string) => void;
    currentPage: number;
    totalPages?: number;
    onPageChange?: (newPage: number) => void;
    onSortBy: (field: string, asc: boolean) => void;
    isLoading: boolean;
}

const GridTitle: FC<TokenGridTitleProps> = (props) => {
    const { timeInterval, setTimeInterval, onSortBy, isLoading, onPageChange, currentPage, totalPages } = props;

    const [changeTotalMintsDisabled, sethCangeTotalMintsActive] = useState(true);

    const handleSortChange = (sortOption: string) => {
        setTimeInterval(sortOption);
    };

    const handleMintingRateSort = () => {
        // Handle sorting by minting rate

        const orederBy = changeTotalMintsDisabled ? 'changeTotalMints' : 'ticker';
        sethCangeTotalMintsActive(!changeTotalMintsDisabled);
        onSortBy(orederBy, true);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <HeaderContainer>
            {/* Fire Icon Button for Minting Rate Sort */}

            <Typography sx={{ fontWeight: 'bold', fontSize: '1.5vw', marginLeft: '1vw' }}>Top KRC-20</Typography>

            {/* Pagination Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PrevPageButton onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </PrevPageButton>
                <NextPageButton onClick={handleNextPage}>Next</NextPageButton>
            </Box>

            {/* Sort Time Period Buttons */}
            <Tooltip title="Sort by the pace and change of minting activity. Mint heat-map.">
                {isLoading ? (
                    <CircularProgress sx={{ marginLeft: 'auto' }} />
                ) : (
                    <IconButton
                        onClick={handleMintingRateSort}
                        sx={{
                            marginLeft: 'auto',
                            backgroundColor: changeTotalMintsDisabled ? 'transparent' : '#ffcccc',
                        }}
                        aria-label="sort by minting rate"
                    >
                        <WhatshotRoundedIcon
                            sx={{
                                color: changeTotalMintsDisabled ? '#000000' : '#ff0000',
                            }}
                        />
                    </IconButton>
                )}
            </Tooltip>

            <SortButtonGroup variant="contained" sx={{ marginLeft: '1vw' }}>
                <SortFirstButton
                    selected={timeInterval === '10m'}
                    sx={{
                        '&.MuiButtonGroup-firstButton': {
                            backgroundColor:
                                timeInterval === '10m' ? 'rgba(111, 199, 186, 0.8)' : 'rgba(111, 199, 186, 0.25)',
                        },
                    }}
                    onClick={() => handleSortChange('10m')}
                >
                    10m
                </SortFirstButton>
                <SortMiddleButton selected={timeInterval === '1h'} onClick={() => handleSortChange('1h')}>
                    1h
                </SortMiddleButton>
                <SortMiddleButton selected={timeInterval === '6h'} onClick={() => handleSortChange('6h')}>
                    6h
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
