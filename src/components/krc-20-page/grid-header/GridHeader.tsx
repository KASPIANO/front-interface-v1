import { Typography, Box } from '@mui/material';
import { FC, useState } from 'react';
import { FilterState } from '../../../types/Types';
import { DownButton } from '../filter-button/down-button/DownButton';
import { UpButton } from '../filter-button/up-button/UpButton';

interface GridHeaderProps {
    name: string;
    sortField: string;
    activeHeader: string;
    setActiveHeader: (value: string) => void;
    onSortBy: (field: string, asc: boolean) => void;
}

const marginMapperByHeader = {
    Ticker: '17.5%',
    Age: '12%',
    Supply: '12%',
    Minted: '13.5%',
    Holders: '14%',
    'Fair Mint': '26%',
};

const marginLeft = {
    Ticker: '5%',
    Age: 0,
    Supply: 0,
    Minted: 0,
    Holders: 0,
    'Fair Mint': '0',
};

const disableSort = (name: string) =>
    name === 'Ticker' || name === 'Age' || name === 'Minted' || name === 'Holders';

export const GridHeader: FC<GridHeaderProps> = (props) => {
    const { name, activeHeader, setActiveHeader, onSortBy, sortField } = props;
    const [currentFilterState, setCurrentFilterState] = useState<FilterState>(FilterState.NONE);

    const handleUpClick = () => {
        setActiveHeader(name);
        setCurrentFilterState(FilterState.UP);
        onSortBy(sortField, true);
    };

    const handleDownClick = () => {
        setActiveHeader(name);
        setCurrentFilterState(FilterState.DOWN);
        onSortBy(sortField, false);
    };

    return (
        <th
            style={{
                display: 'flex',
                justifyContent: 'flex-start',
                minWidth: marginMapperByHeader[name],
                marginLeft: marginLeft[name],
            }}
        >
            <Typography sx={{ fontWeight: 600, fontSize: '1.2vw' }}>{name}</Typography>
            {disableSort(name) && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <UpButton
                        onClick={handleUpClick}
                        isActive={activeHeader === name && currentFilterState === FilterState.UP}
                    />
                    <DownButton
                        onClick={handleDownClick}
                        isActive={activeHeader === name && currentFilterState === FilterState.DOWN}
                    />
                </Box>
            )}
        </th>
    );
};
