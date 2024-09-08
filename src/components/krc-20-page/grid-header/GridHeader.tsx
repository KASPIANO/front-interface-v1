import { Typography, Box } from '@mui/material';
import { FC } from 'react';
import { FilterState } from '../../../types/Types';
import { DownButton } from '../filter-button/down-button/DownButton';
import { UpButton } from '../filter-button/up-button/UpButton';

interface GridHeaderProps {
    name: string;
    headerFunction: (filterState: FilterState) => void;
    activeHeader: string;
    setActiveHeader: (value: string) => void;
    currentFilterState: FilterState;
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

export const GridHeader: FC<GridHeaderProps> = ({
    name,
    headerFunction,
    activeHeader,
    setActiveHeader,
    currentFilterState,
}) => (
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
                    onClick={() => {
                        setActiveHeader(name);
                        headerFunction(FilterState.UP);
                    }}
                    isActive={activeHeader === name && currentFilterState === FilterState.UP}
                />
                <DownButton
                    onClick={() => {
                        setActiveHeader(name);
                        headerFunction(FilterState.DOWN);
                    }}
                    isActive={activeHeader === name && currentFilterState === FilterState.DOWN}
                />
            </Box>
        )}
    </th>
);
