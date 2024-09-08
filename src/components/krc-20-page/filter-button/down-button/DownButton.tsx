import { FC } from 'react';
import { ActiveIconButton, StyledExpandMoreRoundedIcon, DisabledIconButton } from '../FilterButton.s';

interface ButtonProps {
    onClick: () => void;
    isActive: boolean;
}

export const DownButton: FC<ButtonProps> = ({ onClick, isActive }) =>
    isActive ? (
        <ActiveIconButton size="small" onClick={onClick}>
            <StyledExpandMoreRoundedIcon />
        </ActiveIconButton>
    ) : (
        <DisabledIconButton size="small" onClick={onClick}>
            <StyledExpandMoreRoundedIcon />
        </DisabledIconButton>
    );
