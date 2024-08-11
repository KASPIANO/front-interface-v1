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
    Ticker: '16vw',
    Age: '9vw',
    Supply: '10.5vw',
    Minted: '10vw',
    Holders: '11vw',
    'Fair Mint': '12vw',
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
        <Typography sx={{ fontWeight: 600, fontSize: '2.4vh' }}>{name}</Typography>
        {disableSort(name) && (
            <FilterButton
                onFilterClick={headerFunction}
                isActive={activeHeader === name}
                setActiveHeader={() => setActiveHeader(name)}
            />
        )}
    </th>
);
