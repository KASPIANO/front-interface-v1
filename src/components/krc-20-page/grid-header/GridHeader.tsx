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
    Ticker: '21.5%',
    Age: '13%',
    Supply: '13.7%',
    Minted: '14%',
    Holders: '15%',
    'Fair Mint': '16%',
};

const disableSort = (name) => name === 'Ticker' || name === 'Age' || name === 'Minted' || name === 'Holders';

export const GridHeader: FC<GridHeaderProps> = ({ name, headerFunction, activeHeader, setActiveHeader }) => (
    <th
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: marginMapperByHeader[name],
        }}
    >
        <Typography sx={{ fontWeight: 600, fontSize: '2.8vh' }}>{name}</Typography>
        {disableSort(name) && (
            <FilterButton
                onFilterClick={headerFunction}
                isActive={activeHeader === name}
                setActiveHeader={() => setActiveHeader(name)}
            />
        )}
    </th>
);
