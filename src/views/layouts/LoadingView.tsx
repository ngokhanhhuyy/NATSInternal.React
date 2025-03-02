import React, { useMemo } from "react";
import * as styles from "@layouts/LoadingView.module.css";

// const LoadingView = () => {
//     const computeClassName = () => {
//         const classNames = [
//             styles["container"],
//             "border rounded-3"
//         ];

//         return classNames.filter(name => name).join(" ");
//     };

//     return (
//         <div className={computeClassName()}>
//             <div className="rounded-circle overflow-visible position-relative">
//                 <img src="/images/main-logo.png" className={styles["loadingLogo"]}/>
//                 <div className={styles["border"]}/>
//             </div>
//         </div>
//     );
// };

const LoadingView = () => {
    const computeClassName = () => {
        const classNames = [
            styles["container"],
            "shadow-sm"
        ];

        return classNames.filter(name => name).join(" ");
    };

    return (
        <div className={computeClassName()}>
            <div className="col col-12 d-flex justify-content-center
                            rounded-circle overflow-visible position-relative">
                <div className={styles["border"]}/>
                <img
                    src="/images/main-logo-transparent.png"
                    className={styles["loadingLogo"]}
                />
            </div>
        </div>
    );
};

interface LoadingDetailBlockProps extends React.ComponentPropsWithoutRef<"div"> {
    hasHeader?: boolean;
    paragraphCount?: number;
    children?: React.ReactNode | React.ReactNode[];
}

const LoadingDetailBlock = (props: LoadingDetailBlockProps) => {
    const hasHeader = props.hasHeader ?? true;
    const paragraphCount = props.paragraphCount ?? 3;
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
                    <span className="placeholder col-xl-3 col-md-4 col-sm-5 col-6"/>
                </div>
            )}

            <div className={`block-body bg-white border rounded-3 row g-3 p-2 placeholder-glow
                            ${bodyClassName}`}>
                {props.children}
                {!props.children && Array.from(Array(paragraphCount).keys()).map(index => (
                    <div className="col col-12" key={index}>
                        <span className="placeholder" style={{ width: "80px" }} /><br/>
                        <span className="placeholder text-primary"
                                style={{ width: "150px" }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

interface LoadingListProps extends React.ComponentPropsWithoutRef<"div"> {
    color?: "primary" | "success" | "danger";
    hasHeader?: boolean;
    hasThumbnail?: boolean,
    thumbnailSize?: number;
    thumbnailClassName?: string;
    detailSecondaryTextLineCount?: number;
    length?: number;
};

const LoadingListBlock = (props: LoadingListProps) => {
    // Computed props.
    const color = props.color ?? "primary";
    const hasHeader = props.hasHeader ?? false;
    const hasThumbnail = props.hasThumbnail ?? false;
    const detailSecondaryTextLineCount = props.detailSecondaryTextLineCount ?? 2;
    const length = props.length ?? 15;

    // Computed.
    const computeThumbnailStyle = () => {
        const thumbnailSize = props.thumbnailSize ?? 45;
        return { width: `${thumbnailSize}px`, height: `${thumbnailSize}px` };
    };

    const computeThumbnailClassName = () => {
        return props.thumbnailClassName ?? "";
    };
    

    const computeBodyClassName = () => {
        if (hasHeader) {
            return "border-top-0 rounded-top-0";
        }

        return "";
    };

    const renderDetailText = () => {
        if (!detailSecondaryTextLineCount) {
            return null;
        }

        return (
            <p className="card-text placeholder-glow">
                {Array.from(Array(detailSecondaryTextLineCount).keys()).map(key => (
                    <React.Fragment key={key}>
                        <span className="placeholder small"
                                style={{ width: `${Math.random() * 50 + 50}px` }} />
                        <br/>
                    </React.Fragment >
                ))}
            </p>
        );
    };

    return (
        <div className={`block w-100 d-flex flex-column placeholder-glow
                        ${props.className ?? ""}`}>
            {hasHeader && (
                <div className={`block-header bg-${color}-subtle border border-${color}-subtle
                                rounded-3 rounded-bottom-0 d-flex justify-content-start
                                align-items-center px-3 text-${color}`}
                        style={{ height: "45px" }}>
                    <span className="placeholder col-xl-3 col-md-4 col-sm-5 col-6"/>
                </div>
            )}

            <div className={`block-body bg-white border rounded-3 ${computeBodyClassName()}`}>
                <ul className="list-group list-group-flush">
                    {props.children && Array.from(Array(length).keys()).map(index => (
                        <React.Fragment key={index}>
                            {props.children}
                        </React.Fragment>
                    ))}
                    {!props.children && Array.from(Array(length).keys()).map(index => (
                        <li className="list-group-item bg-transparent
                                        d-flex align-items-center"
                                key={index}>
                            {/* Thumbnail */}
                            {hasThumbnail && (
                                <img src="/images/default_plain.jpg"
                                        className={`me-2 ${computeThumbnailClassName}`}
                                        style={computeThumbnailStyle()} />
                            )}

                            {/* Detail text */}
                            <div className="flex-fill ms-2 placeholder-glow">
                                <h5 className={`card-title placeholder-glow text-${color}`}>
                                    <span className="placeholder col-2"></span>
                                </h5>
                                
                                {renderDetailText()}
                            </div>

                            {/* Button */}
                            <button className={`btn btn-outline-${color} btn-sm placeholder
                                                disabled col-sm-1 col-2`}
                                    type="button"
                                    style={{ minWidth: "fit-content" }}>
                                <i className="bi bi-circle opacity-0" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

type LoadingFiltersBlockProps = {
    mode: "SearchTextBox" | "SelectInputs";
    selectInputCount?: 3 | 2;
}

const LoadingFiltersBlock = (props: LoadingFiltersBlockProps) => {
    const { mode } = props;
    const selectInputCount = useMemo<number>(() => {
        return props.selectInputCount ?? 3;
    }, [props.selectInputCount]);

    const bodyContentElement = useMemo<React.ReactNode>(() => {
        if (mode === "SelectInputs") {
            if (selectInputCount === 3) {
                return Array.from(Array(3).keys()).map(key => (
                    <div className="col col-lg-4 col-md-12 col-sm-12 col-12" key={key}>
                        <p className="card-text placeholder-glow">
                            <span className="placeholder col-6"></span>
                        </p>
                        <input className="form-input w-100" disabled />
                    </div>
                ));
            }

            return Array.from(Array(2).keys()).map(key => (
                <div className="col col-md-6 col-sm-12 col-12" key={key}>
                    <p className="card-text placeholder-glow">
                        <span className="placeholder col-6"></span>
                    </p>
                    <input className="form-input w-100" disabled />
                </div>
            ));
        }

        return (
            <>
                <div className="col">
                    <div className="input-group">
                        <input className="form-control border-end-0" />
                        <button className="btn btn-outline-primary placeholder disabled">
                            <i className="bi bi-sliders opacity-0"></i>
                        </button>
                    </div>
                </div>
                <div className="col col-auto">
                    <div className="btn btn-primary disabled placeholder">
                        <i className="bi bi-search opacity-0"></i>
                        <span className="ms-2 d-sm-inline d-none opacity-0">
                            Tìm kiếm
                        </span>
                    </div>
                </div>
            </>
        );
    }, [mode]);

    return (
        <div className="block w-100 d-flex flex-column placeholder-glow">
            {/* Header */}
            <div className="block-header bg-primary-subtle border border-primary-subtle
                            rounded-3 rounded-bottom-0 d-flex justify-content-between
                            align-items-center ps-3 pe-2 text-primary"
                    style={{ height: "45px" }}>
                {/* Title */}
                <span className="placeholder col-xl-3 col-md-4 col-sm-5 col-6"/>

                {/* Button */}
                <button className="btn btn-primary btn-sm disabled placeholder">
                    <i className="bi bi-plus-lg opacity-0"></i>
                    <span className="opacity-0 ms-1">Tạo mới</span>
                </button>
            </div>

            {/* Body */}
            <div className="block-body bg-white border border-top-0
                            rounded-3 rounded-top-0 row g-3 p-2">
                {bodyContentElement}
            </div>
        </div>
    );
};

export default LoadingView;
export { LoadingView, LoadingDetailBlock, LoadingListBlock, LoadingFiltersBlock };