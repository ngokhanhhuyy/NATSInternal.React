import React, { type ComponentPropsWithoutRef } from "react";
import type { IModelState } from "@/hooks/modelStateHook";

// Props.
interface ValidationMessageProps extends ComponentPropsWithoutRef<"span"> {
    name: string;
    modelState: IModelState;
}

function ValidationMessage({ name, modelState }: ValidationMessageProps) {
    // Computed.
    const getComputedClassName = () => {
        if (!modelState) {
            return "";
        }

        let resultName = modelState.messageClass(name) ?? "";
        if (!modelState.hasError(resultName)) {
            resultName += " d-none";
        }

        return resultName;
    };

    if (!modelState) {
        return null;
    }

    return (
        <span className={getComputedClassName()}>
            { modelState.getMessage(name) }
        </span>
    );
}

export default ValidationMessage;