import { Box } from '@mui/material';
import { FC, useState } from 'react';
import {
    DisabledIconButton,
    ActiveIconButton,
    StyledExpandMoreRoundedIcon,
    StyledExpandLessRoundedIcon,
} from './FilterButton.s';

enum FilterState {
    UP = 'UP',
    DOWN = 'DOWN',
    NONE = 'NONE',
}

interface FilterButtonProps {
    onFilterClick: () => void;
}

export const FilterButton: FC<FilterButtonProps> = (props) => {
    const { onFilterClick } = props;
    const [filterState, setFilterState] = useState(FilterState.NONE);

    const toggleFilterIcon = () => {
        if (filterState === FilterState.UP) {
            setFilterState(FilterState.DOWN);
        } else if (filterState === FilterState.DOWN) {
            setFilterState(FilterState.NONE);
        } else {
            setFilterState(FilterState.UP);
        }
    };

    const handleOnFilterClick = () => {
        toggleFilterIcon();
        onFilterClick();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {filterState === FilterState.UP || filterState === FilterState.NONE ? (
                <DisabledIconButton size="small" onClick={handleOnFilterClick}>
                    <StyledExpandLessRoundedIcon />
                </DisabledIconButton>
            ) : (
                <ActiveIconButton size="small" onClick={handleOnFilterClick}>
                    <StyledExpandLessRoundedIcon />
                </ActiveIconButton>
            )}
            {filterState === FilterState.DOWN || filterState === FilterState.NONE ? (
                <DisabledIconButton size="small" onClick={handleOnFilterClick}>
                    <StyledExpandMoreRoundedIcon />
                </DisabledIconButton>
            ) : (
                <ActiveIconButton size="small" onClick={handleOnFilterClick}>
                    <StyledExpandMoreRoundedIcon />
                </ActiveIconButton>
            )}
        </Box>
    );
};
