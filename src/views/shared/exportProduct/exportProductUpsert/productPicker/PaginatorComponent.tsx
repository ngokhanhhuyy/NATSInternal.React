import React from "react";

// Props.
interface PaginatorProps {
    page: number;
    pageCount: number;
    onClick: (page: number) => void;
}

// Component.
const Paginator = ({ page, pageCount, onClick }: PaginatorProps) => {
    // Computed.
    const isBackButtonDisabled = page === 1;
    const backButtonClassName = isBackButtonDisabled ? "opacity-25" : "";

    const isNextButtonDisabled = page === pageCount;
    const nextButtonClassName = isNextButtonDisabled ? "opacity-25" : "";

    const pageDisplayText = `Trang ${page}/${pageCount}`;

    return (
        <div className="d-flex justify-content-center align-items-center pagination">
            {/* Back button */}
            <button className={`btn btn-outline-primary btn-sm ${backButtonClassName}`}
                    type="button"
                    disabled={isBackButtonDisabled}
                    onClick={() => onClick(page - 1)}>
                <i className="bi bi-chevron-left"></i>
            </button>

            {/* Page number */}
            <div className="border rounded px-3 py-1 mx-2 small">
                {pageDisplayText}
            </div>

            {/* Next button */}
            <button className={`btn btn-outline-primary btn-sm
                                ${nextButtonClassName}`}
                    type="button"
                    disabled={isNextButtonDisabled}
                    onClick={() => onClick(page + 1)}>
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    );
};

export default Paginator;