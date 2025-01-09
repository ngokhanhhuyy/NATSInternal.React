import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import type { BreadcrumbItem } from "@/router/HomeRoutesComponent";
import { useRouteGenerator } from "@/router/routeGenerator";


const Breadcrumb = () => {
    const location = useLocation();
    const breadcrumbStore = useBreadcrumbStore();
    const items = useMemo(() => breadcrumbStore.items ?? [], [breadcrumbStore.items]);
    const routeGenerator = useMemo(useRouteGenerator, []);

    const homeIconClassName = useMemo<string>(() => {
        if (location.pathname !== "/") {
            return "bi bi-house-fill";
        }

        return "bi bi-house";
    }, [location.pathname]);

    const smallScreenContent = useMemo<React.ReactNode>(() => {
        if (items.length > 0) {
            return (
                <>
                    <Link className="btn text-primary p-0"
                            to={items[0].to ?? routeGenerator.getHomeRoutePath()}>
                        <i className="bi bi-chevron-left fs-2" />
                    </Link>

                    <span className="text-primary fw-bold text-end">
                        {items[items.length - 1].text.toUpperCase()}
                    </span>
                </>
            );
        }

        return (
            <>
                <i className="bi bi-house fs-2 text-primary ms-2" />
                <span className="text-primary fw-bold text-end">
                    TRANG CHỦ
                </span>
            </>
        );
    }, [items]);

    return (
        <div className="container-fluid pb-0 px-2 pt-1" id="breadcrumb">
            <div className="row g-3">
                <div className="col col-12">
                    <div className="bg-white border rounded-3 overflow-hidden">
                        {/* Large screen */}
                        <div className="d-md-flex d-none flex-md-row flex-column flex-md-wrap
                                        align-items-md-center align-items-start
                                        position-relative px-3 py-2">
                            <Link to="/" style={{textDecoration: "none"}}
                                    className="flex-shrink-0 ms-2 ps-1 d-flex
                                            align-items-center small">
                                <i className={`text-primary fs-6 ${homeIconClassName}`}/>
                                <span className="ms-2">Trang chủ</span>
                            </Link>
                            {items.map((item, index) => (
                                <div className="flex-shrink-0 small" key={index}>
                                    {items.length && (
                                        <i className="bi bi-caret-right-fill
                                                    text-primary mx-3"/>
                                    )}

                                    <ItemText item={item}/>
                                </div>
                            ))}
                        </div>

                        {/* Small screen */}
                        <div className="d-md-none d-flex align-items-center ps-2 p-1 pe-4
                                        justify-content-between position-relative">
                            {smallScreenContent}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;

const ItemText = ({item}: { item: BreadcrumbItem }) => {
    if (item.to) {
        return <Link to={item.to} style={{textDecoration: "none"}}>{item.text}</Link>;
    }

    return <span className="bg-primary text-white px-2 py-1 rounded-3">{item.text}</span>;
};