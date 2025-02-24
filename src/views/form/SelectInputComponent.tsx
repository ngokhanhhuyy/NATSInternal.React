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

    // Computed.
    const computeClassName = () => {
        const classNames: (string | undefined | null)[] = ["form-select", props.className];
        if (name) {
            classNames.push(modelState?.inputClassName(name));
        }
        
        return classNames.filter(n => n).join(" ");
    };

    const computeOptions = () => {
        return options.map((option, index) => (
            <option value={option.value} key={index}>
                {option.displayName ?? option.value}
            </option>
        ));
    };

    return (
        <select {...rest} className={computeClassName()}
                value={formContext?.isSubmitting || formContext?.isDeleting ? "" : value}
                onInput={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    onValueChanged(event.target.value);
                }}>
            {computeOptions()}
        </select>
    );
}

export default SelectInput;