import React from "react";

// Props.
interface PlaceholderTextProps extends React.ComponentPropsWithoutRef<"span"> {
    isPlaceholder?: boolean;
    color?: "primary" | "success" | "danger" | "secondary";
    width: number;
    small?: boolean;
}

// Component.
const PlaceholderText = (props: PlaceholderTextProps) => {
    const { isPlaceholder, color, width, small, className, style, children, ...rest } = props;

    // Computed.
    const computeClassName = (): string => {
        const names = ["placeholder", className];
        if (color) {
            names.push(`bg-${color}`);
        }

        if (small) {
            names.push("placeholder-sm");
        }

        return names.filter(n => n).join(" ");
    };

    const computeStyle = (): React.CSSProperties => {
        if (!style) {
            return { width };
        }

        return { ...style, width };
    };

    if (isPlaceholder || !children) {
        return <span className={computeClassName()} style={computeStyle()} {...rest}  />;
    }

    return (
        <span {...rest}>{children}</span>
    );
};

export default PlaceholderText;