import React, { useMemo } from "react";

interface Props {
    title: string;
    bodyClassName?: string;
    bodyPadding?: string | number | [number, number] | [number, number, number, number];
    borderTop?: boolean | undefined;
    roundedBottom?: boolean | undefined;
    children: React.ReactNode | React.ReactNode[];
}

const SubBlock = (props: Props) => {
    const { title, bodyClassName, roundedBottom, children } = props;
    const bodyPadding = props.bodyPadding ?? [0, 2, 2, 2];
    const borderTop = props.borderTop ?? true;
    
    // Memo.
    const headerComputedClassName = useMemo<string>(() => {
        return `border-top-${borderTop ? 1 : 0}`;
    }, [borderTop]);

    const bodyComputedClassName = useMemo<string>(() => {
        const classNames: string[] = [];
        if (bodyClassName) {
            classNames.push(bodyClassName);
        }
    
        if (roundedBottom) {
            classNames.push("rounded-bottom-3");
        } else {
            classNames.push("border-bottom-0");
        }
    
        if (Array.isArray(bodyPadding)) {
            if (bodyPadding.length === 2) {
                const [x, y] = bodyPadding;
                classNames.push(`px-${x} py-${y}`);
            } else {
                const [top, end, bottom, start] = bodyPadding;
                classNames.push(`pt-${top} pe-${end} pb-${bottom} ps-${start}`);
            }
        } else {
            classNames.push(`p-${bodyPadding}`);
        }
    
        return classNames.join(" ");
    }, [bodyClassName]);

    return (
        <div className="sub-block bg-white rounded-3 p-0">
            {/* Header */}
            <div className={`bg-secondary-subtle border border-secondary-subtle px-3
                            ${headerComputedClassName}`}>
                <span className="text-secondary small fw-bold">
                    { title }
                </span>
            </div>

            {/* Body */}
            <div className={`border border-top-0 ${bodyComputedClassName}`}>
                {children}
            </div>
        </div>
    );
};

export default SubBlock;