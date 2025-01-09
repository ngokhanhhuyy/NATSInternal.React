import React, { useMemo } from "react";
import { IModelState as IModelErrorState } from "@/hooks/modelStateHook";

interface InputProps {
    modelErrorState: IModelErrorState;
    value: string,
    onValueChanged: (value: string) => void;
    propertyName: "userName" | "password";
}

function Input({ modelErrorState, value, onValueChanged, propertyName }: InputProps) {
    // Memo.
    const className = useMemo<string | undefined>(() => {
        return `form-control ${modelErrorState.inputClassName(propertyName)}`;
    }, [modelErrorState]);

    // Functions.
    function onInput(event: React.ChangeEvent<HTMLInputElement>): void {
        onValueChanged(event.target.value);
    }
    
    return (
        <input type={propertyName === "userName" ? "text" : "password"}
                className={className} placeholder=""
                value={value} onInput={onInput} />
    );
}

export default Input;