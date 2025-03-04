import React from "react";
import { Link } from "react-router-dom";

// Props.
interface CreateLinkProps extends React.ComponentPropsWithoutRef<"a"> {
    to: string;
    canCreate: boolean | undefined;
    disabled?: boolean | undefined;
    hideText?: boolean;
}

const CreatingLink = (props: CreateLinkProps) => {
    // Computed.
    const computeClassName = () => {
        const classNames = ["btn btn-primary btn-sm"];
        if (props.className) {
            classNames.push(props.className);
        }

        if (props.disabled) {
            classNames.push("disabled pe-none");
        }

        return classNames.join(" ");
    };

    if (!props.canCreate) {
        return null;
    }

    return (
        <Link className={computeClassName()} to={props.to} >
            <i className="bi bi-plus-lg"></i>
            {!props.hideText && <span className="ms-1">Tạo mới</span>}
        </Link>
    );
};

export default CreatingLink;