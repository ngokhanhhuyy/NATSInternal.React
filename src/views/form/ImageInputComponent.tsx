import React, { useState, useRef, useMemo, useContext, type ComponentPropsWithoutRef } from "react";
import { FormContext } from "./FormComponent";
import { usePhotoUtility } from "@/utilities/photoUtility";

interface TextInputProps extends ComponentPropsWithoutRef<"input"> {
    name: string;
    defaultSrc: string;
    url?: string | null;
    allowDelete?: boolean;
    onValueChanged(file: string | null): any;
}

const ImageInput: React.FC<TextInputProps> = (props: TextInputProps) => {
    // Dependencies.
    const photoUtility = useMemo(usePhotoUtility, []);
    const formContext = useContext(FormContext);
    const modelState = useMemo(() => formContext?.modelState, [formContext?.modelState]);
    const isLoading = useMemo(() => {
        return formContext?.isSubmitting || formContext?.isDeleting;
    }, [formContext?.isSubmitting, formContext?.isDeleting]);

    // States and computed.
    const url = useMemo<string | null>(() => props.url ?? null, [props.url]);
    const [source, setSource] = useState<string | null>(() => url);
    const allowDelete = useMemo<boolean>(() => props.allowDelete ?? true, [props.allowDelete]);
    const inputElement = useRef<HTMLInputElement>(null!);
    const [fileAsBase64, setFileAsBase64] = useState<string | null>(null);

    const deleteButtonVisible = useMemo<boolean>(() => {
        return allowDelete && fileAsBase64 != null;
    }, [allowDelete, fileAsBase64]);

    const thumbnailPreviewClass = useMemo<string>(() => {
        const names: string[] = [];
        if (modelState?.isValidated) {
            if (modelState.hasError("avatarFile")) {
                names.push("bg-danger bg-opacity-10 border-danger");
            }
            names.push("bg-success bg-opacity-10 border-success");
        }
        
        return names.join(" ");
    }, [modelState]);

    const thumbnailPreviewUrl = useMemo<string>(() => {
        if (isLoading) {
            return photoUtility.getDefaultPlainPhotoUrl();
        }

        return source ?? props.defaultSrc;
    }, [isLoading, source, props.defaultSrc]);

    // Callbacks.
    const onInputElementValueChanged = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const file = files[0];
            const [sourceResult, base64ForJson] = await photoUtility.fileToBase64Strings(file);
            setSource(sourceResult);
            props.onValueChanged(base64ForJson);
            setFileAsBase64(source);
        } else {
            setSource(null);
            setFileAsBase64(null);
            props.onValueChanged(null);
        }
    };
    
    const onEditButtonClicked = () => {
        inputElement.current.click();
    };
    
    const onDeleteButtonClicked = () => {
        setSource(null);
        setFileAsBase64(null);
        inputElement.current.value = "";
    };

    return (
        <div className="thumbnail-container position-relative overflow-visible"
                style={{ width: "150px", height: "150px" }}>
            <img className={`img-thumbnail ${thumbnailPreviewClass}`}
                    src={thumbnailPreviewUrl}
                    style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: 1,
                        objectFit: "cover",
                        objectPosition: "50% 50%",
                        overflow: "hidden"
                    }} />
            <input type="file" name={props.name} className="d-none"
                    accept="image/png, image/jpeg, image/jpg"
                    ref={inputElement} onChange={onInputElementValueChanged} />
            <button className={`btn btn-outline-primary btn-sm edit-button position-absolute
                                ${isLoading ? "placeholder disabled" : ""}`}
                    disabled={isLoading}
                    type="button" onClick={onEditButtonClicked}
                    style={{ top: "0", right: "0", transform: "translate(30%, -30%)" }}>
                <i className={`bi bi-pencil-square ${isLoading ? "opacity-0" : ""}`} />
            </button>

            {allowDelete && (
                <button
                    className={`btn btn-outline-danger btn-sm delete-button position-absolute
                                ${isLoading ? "placeholder disabled" : ""}`}
                    type="button"
                    disabled={isLoading}
                    style={{
                        display: deleteButtonVisible ? "none" : "unset",
                        bottom: 0,
                        right: 0,
                        transform: "translate(30%, 30%)"
                    }}
                    onClick={onDeleteButtonClicked}
                >
                    <i className={`bi bi-trash3 ${isLoading ? "opacity-0" : ""}`} />
                </button>
            )}
        </div>
    );
};

export default ImageInput;