import React, { useMemo, useContext } from "react";
import { FormContext } from "./FormComponent";
import { Mask } from "maska";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
    type?: "text" | "tel" | "number";
    min?: number;
    max?: number;
    name: string;
    allowNegative?: boolean;
    decimalPrecision?: number;
    value: number;
    onValueChanged(value: number): any;
}

const NumberInputComponent = (props: Props) => {
    // Props.
    const { value, onValueChanged, ...rest } = props;
    const type = useMemo(() => props.type ?? "text", [props.type]);

    // Dependencies.
    const formContext = useContext(FormContext);
    const modelState = useMemo(() => formContext?.modelState, [formContext?.modelState]);
    const isLoading = useMemo(() => {
        return formContext?.isInitialLoading
            || formContext?.isSubmitting
            || formContext?.isDeleting;
    }, [formContext?.isInitialLoading, formContext?.isSubmitting, formContext?.isDeleting]);

    // Memo.
    const mask = useMemo(() => new Mask({
        number: {
            locale: "vi",
            fraction: props.decimalPrecision ?? 0,
            unsigned: !props.allowNegative
        }
    }), [props.decimalPrecision, props.allowNegative]);

    // Computed.
    const getComputedValue = () => {
        return mask.masked(value.toLocaleString()).replaceAll(".", " ");
    };

    const getComputedClassName = () => {
        const names: (string | null | undefined)[] = props.className ? [props.className] : [];
        if (props.name) {
            names.push(modelState?.inputClassName(props.name));
        }
    
        return names.filter(n => n).join(" ");
    };

    // Callback.
    const onInput = (event: React.FormEvent<HTMLInputElement>): void => {
        const inputElement = (event.target as HTMLInputElement);
        if (!inputElement.value.length) {
            inputElement.value = "0";
        } else {
            inputElement.value = mask.masked(inputElement.value).replaceAll(".", " ");
            const length = inputElement.value.length;
            inputElement.setSelectionRange(length, length);
        }
    };

    const onChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const inputElement = event.target as HTMLInputElement;
        const parsedValue = Number(mask.unmasked(inputElement.value));
        if (isNaN(parsedValue)) {
            onValueChanged(0);
        } else {
            onValueChanged(parsedValue);
        }
    };

    if (isLoading) {
        return <input type="text" name={props.name} className="form-control" disabled />;
    }

    return (
        <input type={type} value={getComputedValue()} {...rest}
                onInput={onInput} onChange={onChanged}
                className={`form-control ${getComputedClassName}`} />
    );
};

export default NumberInputComponent;