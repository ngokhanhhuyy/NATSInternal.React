import React, { ReactNode } from "react";
import { usePaginationUtility, type PaginationRange } from "@/utilities/paginationUtility";
import * as styles from "./MainPaginatorComponent.module.css";

const paginationUtility = usePaginationUtility();

// Interfaces.
interface PaginationRanges {
    largeScreen: PaginationRange,
    smallScreen: PaginationRange,
}

interface Props {
    page: number;
    pageCount: number;
    isReloading: boolean;
    onClick: (page: number) => any;
}

const MainPaginator = (props: Props) => {
    const paginationRanges: PaginationRanges = {
        largeScreen: paginationUtility.getPaginationRange({
            currentPage: props.page,
            pageCount: props.pageCount,
            visibleButtons: 5
        }),
        smallScreen: paginationUtility.getPaginationRange({
            currentPage: props.page,
            pageCount: props.pageCount,
            visibleButtons: 3
        }),
    };

    const computeClassName = () => {
        if (props.isReloading) {
            return "opacity-50 pe-none";
        }

        return "";
    };

    const computePageButtonActualPageValue = (page: number): number => {
        return page + (paginationRanges.largeScreen.startingPage - 1);
    };

    const computePageButtonClassName = (buttonPage: number): string => {
        let className: string = "";
        if (buttonPage === props.page) {
            className += styles["active"];
        }
        
        const exceedLeft = buttonPage < paginationRanges.smallScreen.startingPage;
        const exceedRight = buttonPage > paginationRanges.smallScreen.endingPage;
        if (exceedLeft || exceedRight) {
            className += " d-sm-flex d-none";
        }
        return className;
    };

    const handlePageButtonClick = (buttonPage: number): void => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        props.onClick(buttonPage);
    };

    const renderPageWithNumberButtons = (): ReactNode[] => {
        const startingPage = paginationRanges.largeScreen.startingPage;
        const endingPage = paginationRanges.largeScreen.endingPage;
        return Array
            .from(
                { length: endingPage - (startingPage - 1) },
                (_, index) => index + startingPage)
            .map(page => (
                <button className={`btn mx-1 btn-outline-primary ${styles["pageButton"]} ` +
                                    computePageButtonClassName(page)}
                        type="button"
                        onClick={() => handlePageButtonClick(page)}
                        key={page}>
                    {computePageButtonActualPageValue(page)}
                </button>
            ));
    };

    return (
        <div className={`d-flex flex-row justify-content-center ${computeClassName()}`}>
            <button className={`btn mx-1 btn-outline-primary ${styles["pageButton"]}`}
                    type="button"
                    disabled={props.page === 1}
                    onClick={() => handlePageButtonClick(1)}>
                <span className="d-md-inline d-none">Trang đầu</span>
                <span className="d-md-none d-inline">Đầu</span>
            </button>
            {renderPageWithNumberButtons()}
            <button className={`btn mx-1 btn-outline-primary ${styles["pageButton"]}`}
                    type="button"
                    disabled={props.page === props.pageCount}
                    onClick={() => handlePageButtonClick(props.pageCount)}>
                <span className="d-md-inline d-none">Trang cuối</span>
                <span className="d-md-none d-inline">Cuối</span>
            </button>
        </div>
    );
};

export default MainPaginator;