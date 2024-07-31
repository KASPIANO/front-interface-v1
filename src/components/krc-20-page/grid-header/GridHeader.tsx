import { Typography } from '@mui/material';
import { FC } from 'react';
import { FilterButton } from '../filter-button/FilterButton';
import { TableHeader } from '../grid-krc-20/Krc20Grid.s';

interface GridHeaderProps {
    name: string;
    headerFunction: () => void;
}

export const GridHeader: FC<GridHeaderProps> = ({ name, headerFunction }) => (
    <TableHeader
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '11vw',
        }}
    >
        <Typography>{name}</Typography>
        {<FilterButton onFilterClick={headerFunction} />}
    </TableHeader>
);
