// SlippageControl.tsx
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { ButtonGroup, SlippageSetting, SlippageText } from './BoxSettings.s';

interface SlippageControlProps {
    slippageMode: string;
    slippageValue: string;
    openSlippageModal: () => void;
}

interface SlippageControlProps {
    slippageMode: string;
    slippageValue: string;
    openSlippageModal: () => void;
}

const SlippageControl: React.FC<SlippageControlProps> = (props) => {
    const { slippageMode, slippageValue, openSlippageModal } = props;
    return (
        <ButtonGroup>
            <Tooltip title="Refresh Price" placement="top">
                <IconButton>
                    <RefreshRoundedIcon />
                </IconButton>
            </Tooltip>
            <SlippageSetting>
                <SlippageText> {`Slippage: ${slippageMode} ${slippageValue}`}</SlippageText>
            </SlippageSetting>
            <Tooltip title="Slippage Settings" placement="top">
                <IconButton onClick={openSlippageModal}>
                    <SettingsRoundedIcon />
                </IconButton>
            </Tooltip>
        </ButtonGroup>
    );
};

export default SlippageControl;
