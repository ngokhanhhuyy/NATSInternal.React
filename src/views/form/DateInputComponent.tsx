import React, { useState, useRef, useContext } from "react";
import { FormContext } from "./FormComponent";
import { DateInputModel } from "@/models/dateTime/dateInputModel";

// Interface.
export interface DateTimeInputProps
        extends Omit<React.ComponentPropsWithoutRef<"input">, "value"> {
    name: string;
    value: DateInputModel;
    onValueChanged(newValue: DateInputModel): void;
}

// Component.
const DateInput = ({ name, value, onValueChanged, ...props }: DateTimeInputProps) => {
    // Dependencies.
    const formContext = useContext(FormContext);
    const modelState = formContext?.modelState;
    const isInitialLoading = formContext?.isInitialLoading ?? false;
    
    // Internal states.
    const [tempValue, setTempValue] = useState(() => value.date);
    const inputElement = useRef<HTMLInputElement>(null!);

    // Computed.
    const computeClassName = () => {
        const classNames: (string | undefined | null)[] = [
            "form-control",
            name && modelState?.inputClassName(name)
        ];
        
        if (props.className) {
            classNames.push(props.className);
        }

        classNames.push("text-white");

        return classNames.join(" ");
    };

    // Functions
    // function enforceMinValue(): void {
    //     if (props.min == null || !inputElement.current.value.length) {
    //         return;
    //     }

    //     if (dateTimeUtility.compareDates(inputElement.current.value, props.min) === -1) {
    //         inputElement.current.value = props.min;
    //     }
    // }
    
    // function enforceMaxValue(): void {
    //     if (props.max == null || !inputElement.current.value.length) {
    //         return;
    //     }
    
    //     if (dateTimeUtility.compareDates(inputElement.current.value, props.max) === 1) {
    //         inputElement.current.value = props.max;
    //     }
    // }

    const onBlur = (): void => {
        // enforceMinValue();
        // enforceMaxValue();
        onValueChanged(value.from({ date: tempValue }));
    };
    
    const onInput = (event: React.FormEvent<HTMLInputElement>): void => {
        setTempValue((event.target as HTMLInputElement).value);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            inputElement.current.blur();
        }
    };

    return (
        <input type={isInitialLoading ? "text" : "date"}
                className={computeClassName()}
                value={isInitialLoading ? "" : value.date}
                name={name} ref={inputElement}
                onBlur={onBlur} onInput={onInput} onKeyDown={onKeyDown} />
    );
};

export default DateInput;