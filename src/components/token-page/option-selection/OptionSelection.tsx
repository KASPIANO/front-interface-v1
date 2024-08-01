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
    const [currentOptions, setCurrentOptions] = useState([]);

    useEffect(() => {
        let optionsMapped: OptionSelectionItem[] = [];

        if (
            Array.isArray(props.options) &&
            (typeof props.options[0] === 'string' || typeof props.options[0] === 'number')
        ) {
            optionsMapped = props.options.map((item) => ({
                label: item.toString(),
                value: item,
            }));
        } else {
            optionsMapped = props.options as OptionSelectionItem[];
        }

        setCurrentOptions(optionsMapped);
    }, [props.options]);

    return (
        <OptionSelectionGroup>
            {currentOptions.map((item) => (
                <OptionSelectionButton
                    key={item.value}
                    className={item.value === props.value ? 'selected' : ''}
                    onClick={() => props.onChange(item.value)}
                >
                    {item.label || item.value}
                </OptionSelectionButton>
            ))}
        </OptionSelectionGroup>
    );
};

export default OptionSelection;
