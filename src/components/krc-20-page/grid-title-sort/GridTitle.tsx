import React, { useState } from 'react';
import {
    HeaderContainer,
    SortButtonGroup,
    SortFirstButton,
    SortLastButton,
    SortMiddleButton,
} from './GridTitle.s';
import { Typography } from '@mui/material';

const GridTitle: React.FC = () => {
    const [selectedSort, setSelectedSort] = useState<string>('10m');

    const handleSortChange = (sortOption: string) => {
        setSelectedSort(sortOption);
    };

    return (
        <HeaderContainer>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.5vw' }}>Top KRC-20</Typography>
            <SortButtonGroup variant="contained">
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
