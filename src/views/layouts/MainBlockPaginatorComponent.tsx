import React, { useMemo } from "react";

interface Props {
    color?: "primary" | "success" | "danger";
    page: number;
    onPageChanged: (page: number) => any;
    pageCount: number;
    onPageCountChanged?: (page: number) => any;
    onPreviousButtonClicked?: () => any;
    onNextButtonClicked?: () => any;
}

const MainBlockPaginator = (props: Props) => {
    const color = props.color ?? "primary";
    
    // Computed.
    const previousButtonDisabled = useMemo<boolean>(() => {
        return props.pageCount === 0 || props.page === 1;
    }, [props.pageCount, props.page]);

    const nextButtonDisabled = useMemo<boolean>(() => {
        return props.pageCount === 0 || props.page === props.pageCount;
    }, [props.pageCount, props.page]);

    // Callbacks.
    const onPreviousButtonClicked = (): void => {
        props.onPageChanged(props.page - 1);
        props.onPreviousButtonClicked?.();
    };

    const onNextButtonClicked = (): void => {
        props.onPageChanged(props.page + 1);
        props.onNextButtonClicked?.();
    };

    return (
        <>
            {/* Previous button */}
            <button className={`btn btn-sm btn-outline-${color}`}
                    disabled={previousButtonDisabled}
                    onClick={onPreviousButtonClicked}>
                <i className="bi bi-chevron-left"></i>
            </button>

            {/* Page number */}
            <div className={`bg-white border rounded rounded-1 mx-1 p-1 px-2 small
                            border-${color} text-${color}`}>
                Trang {props.page}/{props.pageCount}
            </div>

            {/* Next button */}
            <button className={`btn btn-sm btn-outline-${color}`}
                    disabled={nextButtonDisabled}
                    onClick={onNextButtonClicked}>
                <i className="bi bi-chevron-right"></i>
            </button>
        </>
    );
};

export default MainBlockPaginator;