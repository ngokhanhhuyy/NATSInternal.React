import React from "react";

interface Props {
    text: string;
    required?: boolean;
}

const Label = ({ text, required }: Props) => {
    const getComputedClassName = (): string => {
        let className = "form-label small fw-bold";
        if (required) {
            className += " required";
        }

        return className;
    };

    return <label className={getComputedClassName()}>{text}</label>;
};

export default Label;