import React, { useContext, type ComponentPropsWithoutRef } from "react";
import { FormContext } from "./FormComponent";

interface TextInputProps extends ComponentPropsWithoutRef<"input"> {
    type?: "text" | "number" | "tel" | "email" | "url";
    regex?: string;
    value: string;
    onValueChanged: (newValue: string) => void;
}

function TextInputComponent(props: TextInputProps) {
    const { className, type, regex, name, value, onValueChanged, ...rest } = props;
    
    // Dependency.
    const formContext = useContext(FormContext);
    const modelState = formContext?.modelState;
    const isInitialLoading = formContext?.isInitialLoading ?? false;

    // Computed.
    const getComputedClassName = () => {
        const classNames: (string | null | undefined)[] = ["form-control", className];
        if (name && modelState?.inputClassName(name)) {
            classNames.push(modelState.inputClassName(name));
        }

        if (isInitialLoading) {
            classNames.push("pe-none");
        }
        
        return classNames.filter(name => name != null).join(" ");
    };

    // Callback.
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const inputElement = event.target;
        const value = inputElement.value;
        
        if (regex != null) {
            inputElement.value = value.replace(new RegExp(`[^${regex}]`, "g"), "");
        }
    
        if (type === "tel") {
            inputElement.value = value.replace(new RegExp("[^$0-9_]", "g"), "");
        }
    
        if (type === "email") {
            inputElement.value = value
                .replace(new RegExp("[^$a-zA-Z0-9!#$%&'*+/=?^_`{|}~@.\\-]", "g"), "");
        }
    
        onValueChanged?.(inputElement.value);
    };

    return (
        <input {...rest} className={getComputedClassName()} type={type} name={name}
                placeholder={isInitialLoading ? "" : props.placeholder}
                value={isInitialLoading ? "" : value}
                onChange={handleInput }/>
    );
}

export default TextInputComponent;