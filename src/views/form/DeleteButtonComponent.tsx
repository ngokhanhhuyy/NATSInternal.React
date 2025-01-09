import React, { useContext } from "react";
import { FormContext } from "./FormComponent";

const DeleteButton = () => {
    // Dependencies.
    const formContext = useContext(FormContext);

    if (formContext?.isSubmitting) {
        return (
            <button type="button" disabled
                    className="btn btn-outline-danger px-4 placeholder disabled">
                <div className="opacity-0">
                    <i className="bi bi-trash3 me-1"></i>
                    <span>Xoá</span>
                </div>
            </button>
        );
    }

    return (
        <button type="button" className="btn btn-outline-danger px-4"
                disabled={formContext?.isDeleting}
                onClick={() => formContext!.delete()}>
            {/* Spinner */}
            {formContext?.isDeleting && (
                <>
                    <span className="spinner-border spinner-border-sm me-2"
                            aria-hidden="true" />
                    <span role="status">Đang xoá ...</span>
                </>
            )}

            {/* Content */}
            {!formContext?.isDeleting && (
                <>
                    <i className="bi bi-trash3 me-1"></i>
                    <span>Xoá</span>
                </>
            )}
        </button>
    );
};

export default DeleteButton;