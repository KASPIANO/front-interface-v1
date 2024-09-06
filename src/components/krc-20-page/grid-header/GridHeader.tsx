import { Typography } from '@mui/material';
import { FC } from 'react';
import { FilterButton } from '../filter-button/FilterButton';
import { FilterState } from '../../../types/Types';

interface GridHeaderProps {
    name: string;
    headerFunction: (filterState: FilterState) => void;
    activeHeader: string;
    setActiveHeader: (value: string) => void;
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

const disableSort = (name) => name === 'Ticker' || name === 'Age' || name === 'Minted' || name === 'Holders';

export const GridHeader: FC<GridHeaderProps> = ({ name, headerFunction, activeHeader, setActiveHeader }) => (
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
            <FilterButton
                onFilterClick={headerFunction}
                isActive={activeHeader === name}
                setActiveHeader={() => setActiveHeader(name)}
            />
        )}
    </th>
);
