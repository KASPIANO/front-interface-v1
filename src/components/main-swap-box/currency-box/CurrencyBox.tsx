import { FormControl } from '@mui/material';
import { FC } from 'react';
import { TokenResponse } from '../../../types/Types';
import { StyledAmountInput, StyledInputContainer } from './CurrencyBox.s';

interface CurrencyBoxProps {
    active: boolean;
    paying: string;
    setPaying: (value: string) => void;
    tokens: TokenResponse[];
}

const CurrencyBox: FC<CurrencyBoxProps> = (props) => {
    const { active, paying, setPaying } = props;

    return (
        <StyledInputContainer active={active}>
            <FormControl>
                {/* <TokensAutocomplete
                    id="token-autocomplete"
                    options={tokens}
                    getOptionLabel={(option: TokenResponse) => option.tick}
                    renderOption={(option: TokenResponse) => (
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
                    onChange={onGroupChange}
                /> */}
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
