import React, { useContext } from "react";

// Form component.
import { FormContext } from "@form/FormComponent";

// Props.
interface SubmitButtonProps extends Omit<React.ComponentPropsWithoutRef<"button">, "type"> {
    children?: React.ReactNode | React.ReactNode[];
}

// Component.
const SubmitButton = ({ children }: SubmitButtonProps) => {
    const formContext = useContext(FormContext);
    
    // Computed.
    const isDisabled = formContext?.isSubmitting
        || formContext?.isDeleting
        || (formContext && !formContext.isModelDirty);

    return (
        <button
            type="submit"
            className="btn btn-primary"
            disabled={!!isDisabled}
        >
            {children ?? (
                <>
                    <i className="bi bi-floppy mx-2" />
                    <span className="me-2">Lưu</span>
                </>
            )}
        </button>
    );
};

export default SubmitButton;