import React from "react";
import { Link, type LinkProps } from "react-router-dom";

// Props.
export interface PlaceholderLinkProps {
    to?: string | undefined;
    isPlaceholder: boolean;
    width?: number;
    small?: boolean;
}

type Props = PlaceholderLinkProps
    & Omit<LinkProps, "to">
    & React.RefAttributes<HTMLAnchorElement>;

// Component.
const PlaceholderLink = (props: Props) => {
    const { to, isPlaceholder, className, children, ...rest } = props;

    // Computed.
    const computeClassName = () => {
        const classNames: (string | undefined)[] = [className, ];

        if (!to) {
            classNames.push("disabled");
        }

        return classNames.filter(n => n).join(" ");
    };

    return (
        <Link className={computeClassName()} to={to ?? ""} {...rest}>
            {/* Placeholder */}
            {isPlaceholder && (
                <span className="opacity-0">
                    {children}
                </span>
            )}

            {/* Children */}
            {!isPlaceholder && children}
        </Link>
    );
};

export default PlaceholderLink;