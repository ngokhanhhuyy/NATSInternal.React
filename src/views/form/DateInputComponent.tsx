import React, { useRef, useContext } from "react";
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
    
    // Internal states.
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
    
    const onChange = (event: React.FormEvent<HTMLInputElement>): void => {
        onValueChanged(value.from({ date: (event.target as HTMLInputElement).value }));
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            inputElement.current.blur();
        }
    };

    return (
        <input
            type="date"
            className={computeClassName()}
            value={value.date}
            name={name} ref={inputElement}
            onChange={onChange}
            onKeyDown={onKeyDown}
        />
    );
};

export default DateInput;