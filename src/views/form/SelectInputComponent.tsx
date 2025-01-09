import React, { useContext } from "react";
import { FormContext } from "./FormComponent";

export interface SelectInputOption {
    value: string | undefined;
    displayName?: string;
}

export interface SelectInputProps extends React.ComponentPropsWithoutRef<"select"> {
    name: string;
    options: SelectInputOption[];
    value: string;
    onValueChanged: (newValue: string) => void;
}

function SelectInput(props: SelectInputProps) {
    const { name, options, value, onValueChanged, ...rest } = props;

    // Dependencies.
    const formContext = useContext(FormContext);
    const modelState = formContext?.modelState;
    const isInitialLoading = formContext?.isInitialLoading ?? false;

    // Computed.
    const computeClassName = () => {
        const classNames: (string | undefined | null)[] = ["form-select", props.className];
        if (name) {
            classNames.push(modelState?.inputClassName(name));
        }

        if (isInitialLoading) {
            classNames.push("pe-none");
        }
        
        return classNames.filter(n => n).join(" ");
    };

    const computeOptions = () => {
        if (isInitialLoading) {
            return null;
        }

        return options.map(option => (
            <option value={option.value} key={option.value}>
                {option.displayName ?? option.value}
            </option>
        ));
    };

    return (
        <select {...rest} className={computeClassName()}
                value={isInitialLoading ? "" : value}
                onInput={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    onValueChanged(event.target.value);
                }}>
            {computeOptions()}
        </select>
    );
}

export default SelectInput;