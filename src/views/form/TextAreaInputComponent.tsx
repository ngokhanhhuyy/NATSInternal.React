import React, { useContext, type ComponentPropsWithoutRef } from "react";
import { FormContext } from "./FormComponent";

interface TextAreaInputProps extends ComponentPropsWithoutRef<"textarea"> {
    name: string;
    value: string;
    onValueChanged: (newValue: string) => void;
}

function TextAreaInputComponent(props: TextAreaInputProps) {
    const { name, value, onValueChanged, ...rest } = props;

    // Dependencies.
    const formContext = useContext(FormContext);
    const modelState = formContext?.modelState;
    const isInitialLoading = formContext?.isInitialLoading ?? false;

    // Memo.
    const computeClassName = () => {
        const classNames = ["form-control", props.className];
        if (name) {
            classNames.push(modelState?.inputClassName(name) ?? "");
        }
        
        return classNames.filter(name => name != null).join(" ");
    };

    return (
        <textarea  {...rest} className={computeClassName()} name={name}
                style={{ minHeight: "150px" }}
                placeholder={isInitialLoading ? "" : props.placeholder}
                value={isInitialLoading ? "" : value}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                    onValueChanged?.(event?.target.value);
                }}/>
    );
}

export default TextAreaInputComponent;