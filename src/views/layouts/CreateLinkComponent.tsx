import React from "react";
import { Link } from "react-router-dom";

// Props.
interface CreateLinkProps extends React.ComponentPropsWithoutRef<"a"> {
    to: string;
    canCreate: boolean | undefined;
    isPlaceholder?: boolean | undefined;
    disabled?: boolean | undefined;
    hideText?: boolean;
}

const CreatingLink = (props: CreateLinkProps) => {
    const { to, canCreate,isPlaceholder, disabled } = props;

    if (!canCreate) {
        return null;
    }

    if (isPlaceholder) {
        const className = `btn btn-primary btn-sm placeholder disabled ${props.className}`;
        return (
            <button type="button" className={className}>
                <span className="opacity-0">
                    <i className="bi bi-plus-lg"></i>
                    {!props.hideText && <span className="ms-1">Tạo mới</span>}
                </span>
            </button>
        );
    }
    return (
        <Link className={`btn btn-primary btn-sm ${props.className}
                        ${disabled ? "disabled pe-none" : ""}`}
                to={to} >
            <i className="bi bi-plus-lg"></i>
            {!props.hideText && <span className="ms-1">Tạo mới</span>}
        </Link>
    );
};

export default CreatingLink;