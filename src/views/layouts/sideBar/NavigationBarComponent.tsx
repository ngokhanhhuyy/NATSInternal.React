import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePageLoadProgressBarStore } from "@/stores/pageLoadProgressBarStore";
import * as styles from "./NavigationBarComponent.module.css";

interface Props {
    keepExpanded: boolean;
    sticky?: boolean;
}

const NavigationBar = ({ keepExpanded, sticky }: Props) => {
    // Dependencies.
    const location = useLocation();
    const progressBarPhase = usePageLoadProgressBarStore(store => store.phase);

    // Computed.
    const currentRouteName = useMemo<string>(() => {
        return location.pathname.split("/")[1];
    }, [location.pathname]);

    const className: string = (() => {
        const names: string[] = [];

        if (progressBarPhase === "waiting") {
            names.push("pe-none");
        }
    
        if (keepExpanded) {
            names.push("keep-expanded");
        }
    
        if (sticky) {
            names.push("sticky");
        }
    
        return names.join(" ");
    })();

    const getRouteLinkClassName = (routeName: string): string | undefined => {
        return routeName === currentRouteName ? "selected" : undefined;
    };

    return (
        <ul className={`w-100 ${className} ${styles["navigationBar"]}`} id="navbar">
            <li className={getRouteLinkClassName("")}>
                <Link to={"/"}>
                    <i className="bi bi-house"></i>
                    <span>Trang chủ</span>
                </Link>
            </li>
            <li className={getRouteLinkClassName("customers")}>
                <Link to={"/customers"}>
                    <i className="bi bi-person-circle"></i>
                    <span>Khách hàng</span>
                </Link>
            </li>
            <li className={getRouteLinkClassName("products")}>
                <Link to={"/products"}>
                    <i className="bi bi-box-seam"></i>
                    <span>Sản phẩm</span>
                </Link>
            </li>
            <li className={getRouteLinkClassName("supplies")}>
                <Link to={"/supplies"}>
                    <i className="bi bi-truck"></i>
                    <span>Nhập hàng</span>
                </Link>
            </li>
            <li className={getRouteLinkClassName("orders")}>
                <Link to={"/orders"}>
                    <i className="bi bi-cart4"></i>
                    <span>Đơn hàng</span>
                </Link>
            </li>
            <li className={getRouteLinkClassName("treatments")}>
                <Link to={"/treatments"}>
                    <i className="bi bi-magic"></i>
                    <span>Liệu trình</span>
                </Link>
            </li>
            <li className={getRouteLinkClassName("consultants")}>
                <Link to={"/consultants"}>
                    <i className="bi bi-patch-question"></i>
                    <span>Tư vấn</span>
                </Link>
            </li>
            <li className={getRouteLinkClassName("debts")}>
                <Link to={"/debts"}>
                    <i className="bi bi-hourglass-bottom"></i>
                    <span>Khoản nợ</span>
                </Link>
            </li>
            <li className={getRouteLinkClassName("expenses")}>
                <Link to={"/expenses"}>
                    <i className="bi bi-cash-coin"></i>
                    <span>Chi phí</span>
                </Link>
            </li>
            <li className={getRouteLinkClassName("report")}>
                <Link to={"/report"}>
                    <i className="bi bi-graph-up-arrow"></i>
                    <span>Báo cáo</span>
                </Link>
            </li>
            <li className={getRouteLinkClassName("users")}>
                <Link to={"/users"}>
                    <i className="bi bi-person-badge"></i>
                    <span>Nhân viên</span>
                </Link>
            </li>
        </ul>
    );
};

export default NavigationBar;