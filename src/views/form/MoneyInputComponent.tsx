import React, { useState, useRef, useMemo, useEffect, useContext } from "react";
import { FormContext } from "./FormComponent";

// Props.
interface Props extends React.ComponentPropsWithoutRef<"input"> {
    min?: number;
    max?: number;
    prefix?: string;
    suffix?: string;
    value: number;
    onValueChanged: (value: number) => void; 
}

// Component.
const MoneyInput = (props: Props) => {
    const { value, onValueChanged, ...rest } = props;

    // Dependencies.
    const formContext = useContext(FormContext);
    const modelState = formContext?.modelState;

    // Computed props.
    const type = useMemo(() => props.type ?? "text", [props.type]);
    const min = useMemo(() => props.min ?? 0, [props.min]);
    const max = useMemo(() => props.max, [props.max]);

    // States.
    const [tempValue, setTempValue] = useState<string>(() => {
        const prefix = props.prefix ?? "";
        const suffix = props.suffix ?? "";
        return prefix + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + suffix;
    });
    const inputElement = useRef<HTMLInputElement>(null!);

    // Effect.
    useEffect(() => {
        const prefix = props.prefix ?? "";
        const suffix = props.suffix ?? "";
        setTempValue(prefix + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + suffix);
    }, [props.prefix, props.suffix, value]);

    useEffect(() => {
        resetCaret();
    }, [props.prefix, props.suffix, tempValue]);

    // Computed.
    const computeClassName = (): string => {
        const classNames: (string | null | undefined)[] = ["form-control", props.className];
        if (props.name) {
            classNames.push(modelState?.inputClassName(props.name));
        }

        return classNames.filter(name => name != null).join(" ");
    };

    // Callbacks.
    const onInput = (event: React.FormEvent<HTMLInputElement>): void => {
        const inputElement = event.target as HTMLInputElement;
        
        // Convert formatted number as string into number without thousand-separators.
        const start = props.prefix?.length ?? 0;
        const end = inputElement.value.length - (props.suffix?.length ?? 0);
        let valueAsString = inputElement.value
            .substring(start, end)
            .replaceAll(" ", "")
            || "0";

        // Validate the value and remove all invalid characters.
        valueAsString = valueAsString.replaceAll(/[^0-9]+/g, "");
        const parsedValue = parseInt(valueAsString);
        
        // Enforce minimum value.
        if (parsedValue < min) {
            valueAsString = min.toString();
        }

        // Enforce maximum value if specified.
        if (max != null && parsedValue > max) {
            valueAsString = max.toString();
        }

        // Add thousand-separators back.
        const formattedNumber = valueAsString
            .replaceAll(/\B(?=(\d{3})+(?!\d))/g, " ");
        const formattedValue = (props.prefix ?? "") + formattedNumber + (props.suffix ?? "");

        // Reflect the formatted value.
        setTempValue(formattedValue);
    };

    const onBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
        const inputElement = event.target as HTMLInputElement;

        // Convert formatted number as string into number without thousand-separators.
        const parsedValue = getNumber(inputElement.value);

        // Reflect the changed value to the passed value.
        if (value != parsedValue) {
            onValueChanged(parsedValue);
        }
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        const inputElement = event.target as HTMLInputElement;
        const isEnterKey = ["Enter", "NumpadEnter"].includes(event.key);
        const isArrowKey = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
            .includes(event.key);

        // Reflect the changed value to the passed value on enter keystroke.
        if (isEnterKey) {
            const parsedValue = getNumber(inputElement.value);
            if (value != parsedValue) {
                onValueChanged(parsedValue);
            }

        // Intercept event when the keystroke is not to edit the value.
        } else if (isArrowKey) {
            event.preventDefault();
        }
    };

    const onMouseDown = (event: React.MouseEvent): void => {
        const inputElement = event.target as HTMLInputElement;
        event.preventDefault();
        inputElement.focus();
    };

    const resetCaret = (): void => {
        let position: number;
        if (props.suffix) {
            position = inputElement.current.value.length - props.suffix.length;
        } else {
            position = inputElement.current.value.length;
        }

        position = position >= 1 ? position : 1;
        inputElement.current.setSelectionRange(position, position);
    };

    const getNumber = (formattedValue: string) => {
        const start = props.prefix?.length ?? 0;
        const end = formattedValue.length - (props.suffix?.length ?? 0);
        const valueAsString = formattedValue.substring(start, end).replaceAll(" ", "");
        return parseInt(valueAsString);
    };

    return (
        <input type={type} name={props.name} {...rest}
            value={tempValue}
            onInput={onInput} onBeforeInput={resetCaret}
            onKeyDown={onKeyDown} onKeyUp={resetCaret}
            onFocus={resetCaret} onBlur={onBlur}
            onMouseDown={onMouseDown}
            className={computeClassName()} ref={inputElement}
        />
    );
};

export default MoneyInput;