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
const StatsDateTimeInput = ({ name, value, onValueChanged, ...rest }: DateTimeInputProps) => {
    // Dependencies.
    const formContext = useContext(FormContext);
    const modelState = formContext?.modelState;

    // States.
    const [tempValue, setTempValue] = useState<string>(() => value.dateTime);
    
    // Effect.
    useEffect(() => setTempValue(value.dateTime), [value]);

    // Computed.
    const computeInputClassName = () => {
        const names: (string | null | undefined)[] = ["form-control"];

        if (value.isSpecified) {
            names.push("border-end-0");
        }

        if (name) {
            names.push(modelState?.inputClassName(name));
        }

        return names.filter(n => n != null).join(" ");
    };

    // Callback.
    const handleInput = (event: React.FormEvent<HTMLInputElement>): void => {
        setTempValue((event.target as HTMLInputElement).value);
    };

    const handleBlur = (): void => {
        onValueChanged(value.from({ dateTime: tempValue }));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            (event.target as HTMLInputElement).blur();
        }
    };

    const toggleEnabled = (): void => {
        onValueChanged(value.from({ isSpecified: !value.isSpecified }));
    };

    return (
        <>
            <div className="input-group">
                <input {...rest}
                    type={value.isSpecified ? "datetime-local" : "text"}
                    className={computeInputClassName()}
                    disabled={!value.isSpecified}
                    value={value.isSpecified ? tempValue : value.initialDateTime}
                    onInput={handleInput}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
                
                <button type="button"
                        className={`btn btn-${value.isSpecified ? "danger" : "primary"}`}
                        onClick={toggleEnabled}>
                    <i className={`bi bi-${value.isSpecified ? "x-lg" : "pencil-square"}`} />
                    <span className="d-sm-inline d-none ms-2">
                        {value.isSpecified ? "Huỷ" : "Sửa"}
                    </span>
                </button>
            </div>
        </>
    );
};

export default StatsDateTimeInput;