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
    setChangeTotalMintsActive: (value: boolean) => void;
    setChangeMCActive: (value: boolean) => void;
    setChangeTotalHoldersActive: (value: boolean) => void;
    setChangeVolumeUsd: (value: boolean) => void;
}

const marginMapperByHeader = {
    Ticker: '13%',
    Age: '9.5%',
    Price: '11.5%',
    'Market Cap': '14.3%',
    Minted: '10%',
    Holders: '9%',
    'Fair Mint': '20%',
    Volume: '10%',
};

const marginLeft = {
    Ticker: '6%',
    Age: 0,
    Price: 0,
    'Market Cap': 0,
    Minted: 0,
    Holders: 0,
    'Fair Mint': '0',
};

const disableSort = (name: string) =>
    name === 'Ticker' ||
    name === 'Age' ||
    name === 'Minted' ||
    name === 'Holders' ||
    name === 'Market Cap' ||
    name === 'Price' ||
    name === 'Volume';

export const GridHeader: FC<GridHeaderProps> = (props) => {
    const {
        name,
        activeHeader,
        setActiveHeader,
        onSortBy,
        sortField,
        setChangeTotalMintsActive,
        setChangeMCActive,
        setChangeTotalHoldersActive,
        setChangeVolumeUsd,
    } = props;
    const [currentFilterState, setCurrentFilterState] = useState<FilterState>(FilterState.NONE);

    const handleUpClick = () => {
        setActiveHeader(name);
        setCurrentFilterState(FilterState.UP);
        onSortBy(sortField, true);
        setChangeMCActive(true);
        setChangeTotalHoldersActive(true);
        setChangeTotalMintsActive(true);
        setChangeVolumeUsd(true);
    };

    const handleDownClick = () => {
        setActiveHeader(name);
        setCurrentFilterState(FilterState.DOWN);
        onSortBy(sortField, false);
        setChangeTotalMintsActive(true);
        setChangeMCActive(true);
        setChangeTotalHoldersActive(true);
        setChangeVolumeUsd(true);
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
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{name}</Typography>
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
