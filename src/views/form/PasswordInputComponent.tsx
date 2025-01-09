import React, { useContext, type ComponentPropsWithoutRef } from "react";
import { FormContext } from "./FormComponent";

interface Props extends ComponentPropsWithoutRef<"input"> {
    name?: string;
    value: string;
    onValueChanged(newValue: string): any;
}

const PasswordInput = ({ name, value, onValueChanged, className, ...props }: Props) => {
    // Dependencies.
    const formContext = useContext(FormContext);
    const modelState = formContext?.modelState;
    const isInitialLoading = formContext?.isInitialLoading ?? false;

    // Computed.
    const getComputedClassName = () => {
        const names: (string | null | undefined)[] = ["form-control", className];
        if (name && modelState) {
            names.push(modelState.inputClassName(name));
        }

        return names.filter(n => n).join(" ");
    };

    // Callback.
    const onInput = (event: React.ChangeEvent<HTMLInputElement>) =>{
        onValueChanged(event.target.value);
    };

    return (
        <input  {...props} type="password" name={name}
                placeholder={isInitialLoading ? "" : props.placeholder}
                className={getComputedClassName()}
                value={value} onInput={onInput} />
    );
};

export default PasswordInput;