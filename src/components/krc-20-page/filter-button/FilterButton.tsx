import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import {
    DisabledIconButton,
    ActiveIconButton,
    StyledExpandMoreRoundedIcon,
    StyledExpandLessRoundedIcon,
} from './FilterButton.s';
import { FilterState } from '../../../types/Types';

interface FilterButtonProps {
    onFilterClick: (filterState: FilterState) => void;
    isActive: boolean;
    setActiveHeader: () => void;
    currentFilterState: FilterState;
}

export const FilterButton: FC<FilterButtonProps> = (props) => {
    const { onFilterClick, isActive, setActiveHeader, currentFilterState } = props;
    const [filterState, setFilterState] = useState(currentFilterState);

    useEffect(() => {
        setFilterState(currentFilterState);
    }, [currentFilterState]);

    useEffect(() => {
        if (!isActive) {
            setFilterState(FilterState.NONE);
        }
    }, [isActive]);

    const toggleFilterIcon = () => {
        let newState: FilterState;
        if (filterState === FilterState.UP) {
            newState = FilterState.DOWN;
        } else if (filterState === FilterState.DOWN) {
            newState = FilterState.NONE;
        } else {
            newState = FilterState.UP;
        }
        return newState;
    };

    const handleOnFilterClick = () => {
        const newState = toggleFilterIcon();
        if (newState !== filterState) {
            setFilterState(newState);
            setActiveHeader();
            onFilterClick(newState);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {filterState === FilterState.UP ? (
                <ActiveIconButton size="small" onClick={handleOnFilterClick}>
                    <StyledExpandLessRoundedIcon />
                </ActiveIconButton>
            ) : (
                <DisabledIconButton size="small" onClick={handleOnFilterClick}>
                    <StyledExpandLessRoundedIcon />
                </DisabledIconButton>
            )}
            {filterState === FilterState.DOWN ? (
                <ActiveIconButton size="small" onClick={handleOnFilterClick}>
                    <StyledExpandMoreRoundedIcon />
                </ActiveIconButton>
            ) : (
                <DisabledIconButton size="small" onClick={handleOnFilterClick}>
                    <StyledExpandMoreRoundedIcon />
                </DisabledIconButton>
            )}
        </Box>
    );
};
