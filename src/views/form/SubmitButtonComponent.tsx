import React, { useContext } from "react";

// Form component.
import { FormContext } from "@form/FormComponent";
import Button from "./ButtonComponent";

// Props.
interface SubmitButtonProps extends Omit<React.ComponentPropsWithoutRef<"button">, "type"> {
    children?: React.ReactNode | React.ReactNode[];
}

// Component.
const SubmitButton = ({ children }: SubmitButtonProps) => {
    const formContext = useContext(FormContext);
    const isInitialLoading = formContext?.isInitialLoading;

    return (
        <Button type="submit" className="btn btn-primary" isPlaceholder={isInitialLoading}>
            {children}
            {!children && (
                <>
                    <i className="bi bi-floppy mx-2"></i>
                    <span className="me-2">Lưu</span>
                </>
            )}
        </Button>
    );
};

export default SubmitButton;