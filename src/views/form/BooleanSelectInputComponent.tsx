import React from "react";

// Child component.
import SelectInput, { type SelectInputProps, } from "./SelectInputComponent";

export interface BooleanSelectInputProps
        extends Omit<SelectInputProps, "value" | "onValueChanged" | "options"> {
    trueDisplayName?: string;
    falseDisplayName?: string;
    value: boolean | undefined;
    onValueChanged: (value: boolean) => void;
}

const BooleanSelectInput = (props: BooleanSelectInputProps) => {
    const { value, onValueChanged, trueDisplayName, falseDisplayName, ...rest } = props;
    const options =  [
        { value: "true", displayName: trueDisplayName ?? "true" },
        { value: "false", displayName: falseDisplayName ?? "false" },
    ];

    return (
        <SelectInput {...rest}
            options={options}
            value={value?.toString() ?? ""}
            onValueChanged={value => {
                const parsedValue = JSON.parse(value) as boolean;
                onValueChanged?.(parsedValue);
            }}
        />
    );
};

export default BooleanSelectInput;