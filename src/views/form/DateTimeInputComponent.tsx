import React, { useState, useMemo, useEffect, useContext } from "react";
import { FormContext } from "./FormComponent";
import { DateTimeInputModel } from "@/models/dateTime/dateTimeInputModel";

// Props.
export interface DateTimeInputProps
        extends Omit<React.ComponentPropsWithoutRef<"input">, "value"> {
    name?: string;
    value: DateTimeInputModel;
    onValueChanged(value: DateTimeInputModel): any;
}

// Component.
const DateTimeInput = (props: DateTimeInputProps) => {
    const { name, value, onValueChanged, disabled, ...rest } = props;

    // Dependency.
    const formContext = useContext(FormContext);

    // States.
    const [tempValue, setTempValue] = useState<string>(() => value.dateTime);
    
    // Effect.
    useEffect(() => setTempValue(value.dateTime), [value]);

    // Memo.
    const modelState = formContext?.modelState;
    const isLoading = formContext?.isSubmitting || formContext?.isDeleting;

    const computedClassName = useMemo<string>(() => {
        const names: (string | null | undefined)[] = ["form-control"];
        if (name && !disabled && modelState?.inputClassName(name)) {
            names.push(modelState.inputClassName(name));
        }

        return names.filter(n => n != null).join(" ");
    }, [name, name && modelState?.inputClassName(name)]);

    // Callback.
    const onInput = (event: React.FormEvent<HTMLInputElement>): void => {
        setTempValue((event.target as HTMLInputElement).value);
    };

    const onBlur = (): void => {
        onValueChanged(value.from({ dateTime: tempValue }));
    };

    return (
        <input
            type="datetime-local"
            className={computedClassName}
            {...rest}
            value={isLoading ? "" : tempValue}
            onInput={onInput} onBlur={onBlur}
        />
    );
};

export default DateTimeInput;