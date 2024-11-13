import { Typography, IconButton, Box, Tooltip, Button } from '@mui/material';
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
import WhatshotIcon from '@mui/icons-material/Whatshot';

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
    setChangeMCActive: (value: boolean) => void;
    changeMCDisabled: boolean;
    setChangeTotalHoldersActive: (value: boolean) => void;
    changeTotalHoldersDisabled: boolean;
    changeVolumeUsd: boolean;
    setChangeVolumeUsd: (value: boolean) => void;
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
        setChangeMCActive,
        changeMCDisabled,
        setChangeTotalHoldersActive,
        changeTotalHoldersDisabled,
        changeVolumeUsd,
        setChangeVolumeUsd,
    } = props;

    const handleSortChange = (sortOption: string) => {
        setTimeInterval(sortOption);
    };

    const handleMintingRateSort = () => {
        // Handle sorting by minting rate
        const orderedBy = changeTotalMintsDisabled ? 'changeTotalMints' : 'volumeUsd';
        if (changeTotalMintsDisabled) {
            setChangeMCActive(true);
            setChangeTotalHoldersActive(true);
            setChangeVolumeUsd(true);
        }
        setChangeTotalMintsActive(!changeTotalMintsDisabled);
        setActiveHeader('');
        onSortBy(orderedBy, true);
    };

    const handleMCChange = () => {
        // Handle sorting by minting rate
        const orderedBy = changeMCDisabled ? 'changeMarketCap' : 'volumeUsd';
        if (changeMCDisabled) {
            setChangeTotalMintsActive(true);
            setChangeTotalHoldersActive(true);
            setChangeVolumeUsd(true);
        }
        setChangeMCActive(!changeMCDisabled);
        setActiveHeader('');
        onSortBy(orderedBy, true);
    };
    const handleHoldersChange = () => {
        // Handle sorting by minting rate
        const orderedBy = changeTotalHoldersDisabled ? 'changeTotalHolders' : 'volumeUsd';
        if (changeTotalHoldersDisabled) {
            setChangeTotalMintsActive(true);
            setChangeMCActive(true);
            setChangeVolumeUsd(true);
        }
        setChangeTotalHoldersActive(!changeTotalHoldersDisabled);
        setActiveHeader('');
        onSortBy(orderedBy, true);
    };
    const handleChangeVolumeUsd = () => {
        // Handle sorting by minting rate
        const orderedBy = changeVolumeUsd ? 'changeVolumeUsd' : 'volumeUsd';
        if (changeVolumeUsd) {
            setChangeTotalMintsActive(true);
            setChangeMCActive(true);
            setChangeTotalHoldersActive(true);
        }
        setChangeVolumeUsd(!changeVolumeUsd);
        setActiveHeader('');
        onSortBy(orderedBy, true);
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
            <Tooltip title="Sort by the percentage change in trading volume over the selected timeframe to identify trending assets.">
                <Button
                    variant="contained"
                    onClick={handleChangeVolumeUsd}
                    sx={{
                        borderRadius: '0.2rem',
                        marginLeft: 'auto',
                        fontSize: '0.65rem',
                        padding: '2px 5px',
                        opacity: changeVolumeUsd ? 0.6 : 1,
                        display: 'flex',
                        marginRight: '0.4rem',
                        alignItems: 'center',
                        gap: '4px', // Adds space between the icon and text
                    }}
                    aria-label="sort by Volume Change"
                >
                    Trending
                    <WhatshotIcon sx={{ color: '#FFFFFF', fontSize: '1rem' }} /> {/* White fire icon */}
                </Button>
            </Tooltip>
            <Tooltip title="Sort by the market cap change within the selected timeframe.">
                <Button
                    variant="contained"
                    onClick={handleMCChange}
                    sx={{
                        borderRadius: '0.2rem',
                        fontSize: '0.65rem',
                        padding: '2px 5px',
                        marginRight: '0.4rem',
                        opacity: changeMCDisabled ? 0.6 : 1,
                    }}
                    aria-label="sort by MC Change"
                >
                    MC Change
                </Button>
            </Tooltip>
            <Tooltip title="Sort by the total holders change within the selected timeframe.">
                <Button
                    variant="contained"
                    onClick={handleHoldersChange}
                    aria-label="sort by Price Change"
                    sx={{
                        borderRadius: '0.2rem',
                        padding: '2px 5px',
                        fontSize: '0.65rem',
                        opacity: changeTotalHoldersDisabled ? 0.6 : 1,
                    }}
                >
                    Holders Change
                </Button>
            </Tooltip>
            <Tooltip title="Sort by the pace and change of minting activity. Mint heat-map.">
                <IconButton
                    onClick={handleMintingRateSort}
                    sx={{
                        marginLeft: '0.2rem',
                    }}
                    aria-label="sort by minting rate"
                >
                    <FireIcon selected={!changeTotalMintsDisabled} />{' '}
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
