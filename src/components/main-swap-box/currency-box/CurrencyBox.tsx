import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { FormControl } from '@mui/material';
import { FC, HTMLAttributes, useState } from 'react';
import { TokenResponse } from '../../../types/Types';
import { StyledAmountInput, StyledInputContainer, TokensAutocomplete } from './CurrencyBox.s';

interface CurrencyBoxProps {
    active: boolean;
    paying: string;
    setPaying: (value: string) => void;
    tokens: TokenResponse[];
}

const CurrencyBox: FC<CurrencyBoxProps> = (props) => {
    const { paying, setPaying, tokens } = props;
    const [isActive, setIsActive] = useState(false);
    return (
        <StyledInputContainer
            active={isActive}
            onMouseEnter={() => setIsActive(true)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            onMouseLeave={() => setIsActive(false)}
        >
            <FormControl>
                <TokensAutocomplete
                    id="token-autocomplete"
                    options={tokens}
                    getOptionLabel={(option: TokenResponse) => option.tick}
                    renderInput={() => <></>}
                    renderOption={(
                        _props: HTMLAttributes<HTMLLIElement> & { key: any },
                        option: TokenResponse,
                    ) => (
                        <img
                            src={option.logo}
                            alt={option.tick}
                            style={{ width: 24, height: 24, marginRight: 10 }}
                        />
                    )}
                    popupIcon={<KeyboardArrowDownRoundedIcon />}
                    disableCloseOnSelect
                    ListboxProps={{ style: { fontSize: '0.8vw' } }}
                    autoSelect={false}
                    value={'Kas'}
                />
            </FormControl>

            <StyledAmountInput
                type="text"
                placeholder="0.00"
                value={paying}
                onFocus={() => setPaying('true')}
                onBlur={() => setPaying('false')}
                onChange={(e) => setPaying(e.target.value)}
            />
        </StyledInputContainer>
    );
};

export default CurrencyBox;
