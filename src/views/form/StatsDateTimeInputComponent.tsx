import React, { useState, useEffect, useContext } from "react";
import { FormContext } from "./FormComponent";
import { StatsDateTimeInputModel } from "@/models/dateTime/statsDateTimeInputModel";

// Props.
export interface DateTimeInputProps
        extends Omit<React.ComponentPropsWithoutRef<"input">, "value"> {
    name: string;
    value: StatsDateTimeInputModel;
    onValueChanged(value: StatsDateTimeInputModel): any;
}

// Component.
const StatsDateTimeInput = (props: DateTimeInputProps) => {
    // Dependencies.
    const formContext = useContext(FormContext);
    const modelState = formContext?.modelState;

    // States.
    const [tempValue, setTempValue] = useState<string>(() => props.value.dateTime);
    
    // Effect.
    useEffect(() => setTempValue(props.value.dateTime), [props.value]);

    // Computed.
    const computeInputClassName = () => {
        const names: (string | null | undefined)[] = ["form-control"];

        if (props.value.isSpecified) {
            names.push("border-end-0");
        }

        if (props.name && props.value.isSpecified && modelState?.inputClassName(props.name)) {
            names.push(modelState?.inputClassName(props.name));
        }

        return names.filter(n => n != null).join(" ");
    };

    const computeButtonIconClassName = (): string => {
        return `bi bi-${props.value.isSpecified ? "x-lg" : "pencil-square"}`;
    };

    // Callback.
    const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
        setTempValue((event.target as HTMLInputElement).value);
    };

    const handleBlur = (): void => {
        props.onValueChanged(props.value.from({ dateTime: tempValue }));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            (event.target as HTMLInputElement).blur();
        }
    };

    const toggleEnabled = (): void => {
        props.onValueChanged(props.value.from({ isSpecified: !props.value.isSpecified }));
    };

    return (
        <>
            <div className="input-group">
                <input {...props}
                    type={props.value.isSpecified ? "datetime-local" : "text"}
                    className={computeInputClassName()}
                    disabled={!props.value.isSpecified}
                    value={props.value.isSpecified ? tempValue : props.value.initialDateTime}
                    onInput={handleInput}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
                
                <button type="button"
                        className={`btn btn-${props.value.isSpecified ? "danger" : "primary"}`}
                        onClick={toggleEnabled}>
                    <i className={computeButtonIconClassName()} />
                    <span className="d-sm-inline d-none ms-2">
                        {props.value.isSpecified ? "Huỷ" : "Sửa"}
                    </span>
                </button>
            </div>
        </>
    );
};

export default StatsDateTimeInput;