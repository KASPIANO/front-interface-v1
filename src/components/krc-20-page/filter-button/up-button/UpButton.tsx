import { FC } from 'react';
import { ActiveIconButton, DisabledIconButton, StyledExpandLessRoundedIcon } from '../FilterButton.s';

interface ButtonProps {
    onClick: () => void;
    isActive: boolean;
}

export const UpButton: FC<ButtonProps> = ({ onClick, isActive }) =>
    isActive ? (
        <ActiveIconButton size="small" onClick={onClick}>
            <StyledExpandLessRoundedIcon />
        </ActiveIconButton>
    ) : (
        <DisabledIconButton size="small" onClick={onClick}>
            <StyledExpandLessRoundedIcon />
        </DisabledIconButton>
    );
