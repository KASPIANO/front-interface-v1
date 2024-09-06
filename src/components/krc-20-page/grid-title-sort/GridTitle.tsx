import { Typography, IconButton, Box, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import WhatshotIcon from '@mui/icons-material/Whatshot'; // Fire icon from MUI
import {
    HeaderContainer,
    NextPageButton,
    PrevPageButton,
    SortButtonGroup,
    SortFirstButton,
    SortLastButton,
    SortMiddleButton,
} from './GridTitle.s';

const GridTitle: React.FC = () => {
    const [selectedSort, setSelectedSort] = useState<string>('10m');
    const [page, setPage] = useState<number>(1);

    const handleSortChange = (sortOption: string) => {
        setSelectedSort(sortOption);
        // Call function to sort by time
        console.log('Sort by:', sortOption);
    };

    const handleMintingRateSort = () => {
        // Handle sorting by minting rate
        console.log('Sort by minting rate');
    };

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
        console.log('Next Page:', page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
            console.log('Previous Page:', page - 1);
        }
    };

    return (
        <HeaderContainer>
            {/* Fire Icon Button for Minting Rate Sort */}

            <Typography sx={{ fontWeight: 'bold', fontSize: '1.5vw', marginLeft: '1vw' }}>Top KRC-20</Typography>

            {/* Pagination Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PrevPageButton onClick={handlePrevPage} disabled={page === 1}>
                    Prev
                </PrevPageButton>
                <NextPageButton onClick={handleNextPage}>Next</NextPageButton>
            </Box>

            {/* Sort Time Period Buttons */}
            <Tooltip title="Sort by the pace and change of minting activity. Mint heat-map.">
                <IconButton
                    onClick={handleMintingRateSort}
                    sx={{ marginLeft: 'auto' }}
                    aria-label="sort by minting rate"
                >
                    <WhatshotIcon sx={{ color: 'red' }} />
                </IconButton>
            </Tooltip>

            <SortButtonGroup variant="contained" sx={{ marginLeft: '1vw' }}>
                <SortFirstButton
                    selected={selectedSort === '10m'}
                    sx={{
                        '&.MuiButtonGroup-firstButton': {
                            backgroundColor:
                                selectedSort === '10m' ? 'rgba(111, 199, 186, 0.8)' : 'rgba(111, 199, 186, 0.25)',
                        },
                    }}
                    onClick={() => handleSortChange('10m')}
                >
                    10m
                </SortFirstButton>
                <SortMiddleButton selected={selectedSort === '1h'} onClick={() => handleSortChange('1h')}>
                    1h
                </SortMiddleButton>
                <SortMiddleButton selected={selectedSort === '6h'} onClick={() => handleSortChange('6h')}>
                    6h
                </SortMiddleButton>
                <SortMiddleButton selected={selectedSort === '1d'} onClick={() => handleSortChange('1d')}>
                    1d
                </SortMiddleButton>
                <SortMiddleButton selected={selectedSort === '7d'} onClick={() => handleSortChange('7d')}>
                    7d
                </SortMiddleButton>
                <SortLastButton selected={selectedSort === '30d'} onClick={() => handleSortChange('30d')}>
                    30d
                </SortLastButton>
            </SortButtonGroup>
        </HeaderContainer>
    );
};

export default GridTitle;
