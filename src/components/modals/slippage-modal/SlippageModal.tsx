import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import React, { ChangeEvent, useState } from 'react';
import {
    CloseButton,
    CustomInputContainer,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalTitle,
    ModeButton,
    PercentInput,
    PercentSign,
    SaveButton,
    SlippageButton,
} from './SlippageModal.s';

interface SlippageModalProps {
    onClose: () => void;
    onSave: (mode: string, slippage: string) => void;
}

const SlippageModal: React.FC<SlippageModalProps> = ({ onClose, onSave }) => {
    const [mode, setMode] = useState('Auto');
    const [slippage, setSlippage] = useState('Auto');
    const [customValue, setCustomValue] = useState('');

    const handleSlippageClick = (value: string) => {
        setSlippage(value);
    };

    const handleCustomInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/%/g, '');
        if (value === '' || (/^(\d{1,2}(\.\d{0,2})?)?$/.test(value) && parseFloat(value) <= 10)) {
            setCustomValue(value);
        }
    };

    const handleSaveSettings = () => {
        const value = slippage === 'Custom' ? `${customValue}%` : slippage;
        onSave(mode, value);
        onClose();
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Slippage Settings</ModalTitle>
                    <CloseButton onClick={onClose}>
                        <CloseRoundedIcon />
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <label>Mode:</label>
                        <div style={{ display: 'flex', marginTop: '10px' }}>
                            <ModeButton active={mode === 'Auto'} onClick={() => setMode('Auto')}>
                                Auto
                            </ModeButton>
                            <ModeButton active={mode === 'Fixed'} onClick={() => setMode('Fixed')}>
                                Fixed
                            </ModeButton>
                        </div>
                    </div>
                    {mode === 'Auto' && (
                        <div style={{ marginTop: '20px' }}>
                            <label>Max Slippage:</label>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '10px',
                                }}
                            >
                                <SlippageButton
                                    active={slippage === 'Auto'}
                                    onClick={() => handleSlippageClick('Auto')}
                                    style={{ justifyContent: 'center' }}
                                >
                                    Auto
                                </SlippageButton>
                                <SlippageButton
                                    active={slippage === 'Custom'}
                                    onClick={() => handleSlippageClick('Custom')}
                                >
                                    Custom
                                    <CustomInputContainer>
                                        <PercentInput
                                            type="text"
                                            placeholder="0.00"
                                            value={customValue}
                                            onChange={handleCustomInputChange}
                                        />
                                        <PercentSign>%</PercentSign>
                                    </CustomInputContainer>
                                </SlippageButton>
                            </div>
                            <p
                                style={{
                                    marginTop: '20px',
                                    fontSize: '12px',
                                    color: '#6a7179',
                                }}
                            >
                                {slippage === 'Auto'
                                    ? 'Kaspiano will automatically choose the optimal slippage for your transaction(s).'
                                    : 'Kaspiano will automatically choose the optimal slippage for your transaction(s), but with a set maximum.'}
                            </p>
                        </div>
                    )}
                    {mode === 'Fixed' && (
                        <div style={{ marginTop: '20px' }}>
                            <label>Slippage:</label>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '10px',
                                }}
                            >
                                <SlippageButton
                                    active={slippage === '0.3%'}
                                    onClick={() => handleSlippageClick('0.3%')}
                                >
                                    0.3%
                                </SlippageButton>
                                <SlippageButton
                                    active={slippage === '0.5%'}
                                    onClick={() => handleSlippageClick('0.5%')}
                                >
                                    0.5%
                                </SlippageButton>
                                <SlippageButton
                                    active={slippage === '1%'}
                                    onClick={() => handleSlippageClick('1%')}
                                >
                                    1%
                                </SlippageButton>
                                <SlippageButton
                                    active={slippage === 'Custom'}
                                    onClick={() => handleSlippageClick('Custom')}
                                >
                                    Custom
                                    {slippage === 'Custom' && (
                                        <CustomInputContainer>
                                            <PercentInput
                                                type="text"
                                                placeholder="0.00"
                                                value={customValue}
                                                onChange={handleCustomInputChange}
                                            />
                                            <PercentSign>%</PercentSign>
                                        </CustomInputContainer>
                                    )}
                                </SlippageButton>
                            </div>
                            <p
                                style={{
                                    marginTop: '20px',
                                    fontSize: '12px',
                                    color: '#6a7179',
                                }}
                            >
                                Manually set the slippage you are comfortable with for your transaction(s).
                            </p>
                        </div>
                    )}
                    <SaveButton onClick={handleSaveSettings}>Save Settings</SaveButton>
                </ModalBody>
            </ModalContent>
        </ModalOverlay>
    );
};

export default SlippageModal;
