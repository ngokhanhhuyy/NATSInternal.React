import React, { startTransition, type ComponentPropsWithoutRef } from "react";
import { useNavigate } from "react-router-dom";

export interface MainBlockProps extends ComponentPropsWithoutRef<"div"> {
    title: string;
    color?: "primary" | "success" | "danger";
    header?: React.ReactNode;
    headerClassName?: string;
    closeButton?: boolean;
    paginator?: boolean;
    children: React.ReactNode | React.ReactNode[];
    bodyClassName?: string;
    bodyStyle?: React.CSSProperties;
    bodyPadding?: string | number | [number, number] | [number, number, number, number];
    bodyBorder?: boolean;
}

const MainBlock = (props: MainBlockProps) => {
    const navigate = useNavigate();
    const color = props.color ?? "primary";
    const bodyPadding = props.bodyPadding ?? [0, 2, 2, 2];
    const bodyBorder = props.bodyBorder ?? true;

    const getHeaderClass = (): string => {
        let className = `bg-${color}-subtle border-${color}-subtle text-${color}`;
        if (props.headerClassName) {
            className += ` ${props.headerClassName}`;
        }
        return className;
    };

    const getBodyClass = (): string | undefined => {
        const classNames: string[] = ["block-body container-fluid"];
        if (props.bodyClassName) {
            classNames.push(props.bodyClassName);
        }

        if (bodyBorder) {
            classNames.push("border border-top-0");
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

        if (classNames.length) {
            return classNames.join(" ");
        }
    };

    const getHeader = () => {
        if (!props.header && props.closeButton) {
            return (
                <div className="me-2" style={{ cursor: "pointer" }}
                        onClick={() => startTransition(() => navigate(-1))}>
                    <i className={`bi bi-x-lg text-${color}`}></i>
                </div>
            );
        }

        return props.header;
    };

    return (
        <div className={`block bg-white rounded-3 p-0 d-flex flex-column
                        ${props.className ?? ""}`}>
            {/* Header */}
            <div className={`block-header bg-opacity-25 border ps-3 p-2 rounded-top-3
                        d-flex align-items-center flex-shrink-0 ${getHeaderClass()}`}
                    style={{ height: "45px" }}>
                <div className={`small fw-bold flex-fill me-2 pt-1 text-${props.color}`}>
                    { props.title.toUpperCase() }
                </div>
                {getHeader()}
            </div>

            {/* Body */}
            <div
                className={`rounded-bottom-3 flex-fill ${getBodyClass()}`}
                style={props.bodyStyle}
            >
                {props.children}
            </div>
        </div>
    );
};

export default MainBlock;