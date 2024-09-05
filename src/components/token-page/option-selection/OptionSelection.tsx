import { FC, useEffect, useState } from 'react';
import { OptionSelectionButton, OptionSelectionGroup } from './OptionSelection.s';

type OptionSelectionItem = {
    label: string | null;
    value: string | number;
};

interface OptionSelectionProps {
    options: OptionSelectionItem[] | string[] | number[];
    value: string | number;
    onChange: (value: string | number) => void;
}

const OptionSelection: FC<OptionSelectionProps> = (props) => {
    const { options, value, onChange } = props;
    const [currentOptions, setCurrentOptions] = useState([]);

    useEffect(() => {
        let optionsMapped: OptionSelectionItem[] = [];

        if (Array.isArray(options) && (typeof options[0] === 'string' || typeof options[0] === 'number')) {
            optionsMapped = options.map((item) => ({
                label: item.toString(),
                value: item,
            }));
        } else {
            optionsMapped = options as OptionSelectionItem[];
        }

        setCurrentOptions(optionsMapped);
    }, [options]);

    return (
        <OptionSelectionGroup>
            {currentOptions.map((item) => (
                <OptionSelectionButton
                    key={item.value}
                    className={item.value === value ? 'selected' : ''}
                    onClick={() => onChange(item.value)}
                >
                    {item.label || item.value}
                </OptionSelectionButton>
            ))}
        </OptionSelectionGroup>
    );
};

export default OptionSelection;
