import React, { useState } from 'react';
import { HeaderContainer, Title, SortButtonGroup, SortButton } from './GridTitle.s';
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
                <SortButton
                    sx={{
                        backgroundColor:
                            selectedSort === '10m' ? 'rgba(111, 199, 186, 0.8)' : 'rgba(111, 199, 186, 0.25)',
                    }}
                    onClick={() => handleSortChange('10m')}
                >
                    10m
                </SortButton>
                <SortButton onClick={() => handleSortChange('1h')}>1h</SortButton>
                <SortButton onClick={() => handleSortChange('6h')}>6h</SortButton>
                <SortButton onClick={() => handleSortChange('1d')}>1d</SortButton>
                <SortButton onClick={() => handleSortChange('7d')}>7d</SortButton>
                <SortButton onClick={() => handleSortChange('30d')}>30d</SortButton>
            </SortButtonGroup>
        </HeaderContainer>
    );
};

export default GridTitle;
