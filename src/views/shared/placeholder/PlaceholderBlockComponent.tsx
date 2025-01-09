import React from "react";

interface PlaceholderBlockProps extends React.ComponentPropsWithoutRef<"div"> {
    hasHeader?: boolean;
    titleWidth?: number;
    children?: React.ReactNode | React.ReactNode[];
}

const PlaceholderBlock = (props: PlaceholderBlockProps) => {
    const hasHeader = props.hasHeader ?? true;
    const bodyClassName = (() => {
        const classNames: (string | undefined)[] = [props.className];
        
        if (hasHeader) {
            classNames.push("border-top-0 rounded-top-0");
        }

        return classNames.filter(name => name).join(" ");
    })();

    return (
        <div className="block w-100 d-flex flex-column placeholder-glow">
            {hasHeader && (
                <div className="block-header bg-primary-subtle border border-primary-subtle
                                rounded-3 rounded-bottom-0 d-flex justify-content-start
                                align-items-center px-3 text-primary"
                        style={{ height: "45px" }}>
                    <span className="placeholder" style={{ width: props.titleWidth ?? 250 }}/>
                </div>
            )}

            <div className={`block-body bg-white border rounded-3 row g-3 p-2
                            ${bodyClassName}`}>
                {props.children}
            </div>
        </div>
    );
};

export default PlaceholderBlock;