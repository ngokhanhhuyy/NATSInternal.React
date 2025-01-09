import React, { useMemo, useContext } from "react";
import { FormContext } from "./FormComponent";

interface ValidationMessageProps {
    name: string;
}

function ValidationMessage({ name }: ValidationMessageProps) {
    // Depdencies.
    const formContext = useContext(FormContext);
    const modelState = useMemo(() => formContext?.modelState, [formContext?.modelState]);

    // Computed.
    const message = modelState?.getMessage(name) ?? "";
    const className = modelState?.messageClass(name) ?? undefined;
    const style = { display: modelState?.isValidated ? "inline" : "none" };

    return (
        <span className={className} style={style}>
            {message}
        </span>
    );
}

export default ValidationMessage;