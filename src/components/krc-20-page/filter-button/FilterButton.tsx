import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
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
    isActive: boolean;
    setActiveHeader: () => void;
}

export const FilterButton: FC<FilterButtonProps> = (props) => {
    const { onFilterClick, isActive, setActiveHeader } = props;
    const [filterState, setFilterState] = useState(FilterState.NONE);

    useEffect(() => {
        if (!isActive) {
            setFilterState(FilterState.NONE);
        }
    }, [isActive]);

    const toggleFilterIcon = () => {
        if (filterState === FilterState.UP) {
            setFilterState(FilterState.DOWN);
            return FilterState.DOWN;
        } else if (filterState === FilterState.DOWN) {
            setFilterState(FilterState.NONE);
            return FilterState.NONE;
        } else {
            setFilterState(FilterState.UP);
            return FilterState.UP;
        }
    };

    const handleOnFilterClick = () => {
        toggleFilterIcon();
        setActiveHeader();
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
