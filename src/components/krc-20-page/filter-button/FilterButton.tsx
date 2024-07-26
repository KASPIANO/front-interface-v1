import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton } from '@mui/material';
import { FC, useState } from 'react';

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
        <IconButton onClick={handleOnFilterClick}>
            {filterState === FilterState.UP && <KeyboardArrowUpIcon />}
            {filterState === FilterState.DOWN && <KeyboardArrowDownIcon />}
            {filterState === FilterState.NONE && <HorizontalRuleIcon />}
        </IconButton>
    );
};
