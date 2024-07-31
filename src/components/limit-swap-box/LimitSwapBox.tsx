import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import React from 'react';
import {
    AmountInput,
    BalanceInfo,
    CurrencyImage,
    CurrencySelector,
    CurrencyText,
    Heading,
    InputContainer,
    Label,
    Section,
    SwapBoxContainer,
    SwapButton,
    SwitchButton,
} from './LimitSwapBox.s';

const SwapBox: React.FC = () => (
    <SwapBoxContainer>
        <Heading>Limit Order</Heading>
        <Section>
            <Label>You&apos;re selling</Label>
            <InputContainer>
                <CurrencySelector>
                    <CurrencyImage src="/kaspa.svg" alt="KAS" />
                    <CurrencyText>KAS</CurrencyText>
                    <KeyboardArrowDownRoundedIcon style={{ color: 'white', marginLeft: '8px' }} />
                </CurrencySelector>
                <AmountInput type="text" placeholder="0.00" />
            </InputContainer>
            <BalanceInfo>
                <span>Balance: 0.00 KAS</span>
            </BalanceInfo>
        </Section>
        <SwitchButton>
            <SwapHorizRoundedIcon />
        </SwitchButton>
        <Section>
            <Label>You&apos;re buying</Label>
            <InputContainer>
                <CurrencySelector>
                    <CurrencyImage src="/token.svg" alt="TOKEN" />
                    <CurrencyText>Token</CurrencyText>
                    <KeyboardArrowDownRoundedIcon style={{ color: 'white', marginLeft: '8px' }} />
                </CurrencySelector>
                <AmountInput type="text" placeholder="0.00" />
            </InputContainer>
            <BalanceInfo>
                <span>Balance: 0.00 Token</span>
            </BalanceInfo>
        </Section>
        <SwapButton>Connect Wallet</SwapButton>
    </SwapBoxContainer>
);

export default SwapBox;
