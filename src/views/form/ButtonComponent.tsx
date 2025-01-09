import React from "react";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    isPlaceholder?: boolean | undefined;
}

const Button = ({ isPlaceholder, type, className, children, ...rest }: ButtonProps) => {
    // Computed.
    const getComputedClassName = () => {
        const classNames: (string | undefined)[] = [className];
        if (isPlaceholder) {
            classNames.push("placeholder disabled"); 
        }

        return classNames.filter(name => name).join(" ");
    };

    return (
        <button type={type ?? "button"} className={getComputedClassName()} {...rest}>
            {isPlaceholder && (
                <span className="opacity-0">
                    {children}
                </span>
            )}

            {!isPlaceholder && children}
        </button>
    );
};

export default Button;