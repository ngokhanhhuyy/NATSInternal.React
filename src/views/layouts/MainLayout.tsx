import React, { useState, useEffect } from "react";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthenticationStore } from "@/stores/authenticationStore";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useHubClient } from "@/services/hubClient";
import HomeRoutes from "@/router/HomeRoutesComponent";
import { useRouteGenerator } from "@/router/routeGenerator";
import { AuthenticationError } from "@/errors";
import * as styles from "./MainLayout.module.css";

// Layout components.
import Notification from "./topBar/NotificationComponent";
import CurrentUser from "./topBar/CurrentUserComponent";
import MobileNavigationBar from "./sideBar/MobileNavigationBarComponent";
import NavigationBar from "./sideBar/NavigationBarComponent";
import Breadcrumb from "@layouts/BreadcrumbComponent";

const MainLayout = () => {
    // Dependencies.
    const authenticationStore = useAuthenticationStore();
    const initialDataStore = useInitialDataStore();
    const navigate = useNavigate();
    const location = useLocation();
    const hubClient = useHubClient();
    const routeGenerator = useRouteGenerator();

    // State.
    const [isAuthenticated, setAuthenticated] = useState<boolean | null>(null);
    const [isFetching, setFetching] = useState<boolean>(true);

    useEffect(() => {
        authenticationStore
            .isAuthenticatedAsync()
            .then(authenticated => setAuthenticated(authenticated))
            .then(() => initialDataStore.loadDataAsync())
            .then(() => setFetching(false))
            .catch(() => navigate(routeGenerator.getSignInRoutePath()));
        
        const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
            if (event.reason instanceof AuthenticationError) {
                document.location.replace(routeGenerator.getSignInRoutePath());
            }
        };

        window.addEventListener("unhandledrejection", unhandledRejectionHandler);
        return () => {
            if (hubClient.isConnected) {
                hubClient.stopConnection().then(() => { });
            }
            
            window.removeEventListener("unhandledrejection", unhandledRejectionHandler);
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            hubClient.startConnection().then(() => { });
        }
    }, [isAuthenticated]);

    if (isFetching) {
        if (isAuthenticated === false) {
            const serializableLocation = {
                pathname: location.pathname,
                search: location.search,
                hash: location.hash,
            };
    
            return <Navigate to="/signIn" state={{ location: serializableLocation }} />;
        }

        return null;
    }

    return (
        <div className={`container-fluid d-flex flex-column justify-content-center
                        m-0 p-0 h-100 ${styles["mainView"]}`}>
            <div className="row">
                {/* Main logo (top left corner) */}
                <div className="col col-auto d-flex flex-row bg-white border-end border-bottom
                                border-default overflow-hidden ps-3 p-2 align-items-center"
                        id="main-logo" onClick={() => navigate("/")}>
                    <img src="/images/main-logo.png" />
                    <div className="flex-fill d-lg-block d-md-none d-sm-none d-none">
                        <span className="text-primary fs-5 ms-2">NATSInternal</span>
                    </div>
                </div>

                <div className="col bg-white border-bottom border-default p-2 d-flex"
                        id="topbar">
                    <div className="row gx-md-4 gx-sm-3 gx-3 h-100 w-100 flex-row
                                    justify-content-end align-items-center">
                        {/* Search bar */}
                        <div className="col col-auto h-100 flex-fill d-md-flex
                                        d-sm-none d-none">
                            {/* <SearchBar /> */}
                        </div>

                        {/* Add order */}
                        <div className="col col-auto h-100 d-flex align-items-center">
                            <Link to="/" title="Thêm đơn hàng">
                                <i className="bi bi-cart-plus text-primary fs-4"></i>
                            </Link>
                        </div>

                        {/* Add customer */}
                        <div className="col col-auto h-100 d-flex align-items-center">
                            <Link to="/" title="Thêm khách hàng">
                                <i className="bi bi-person-add text-primary fs-4"></i>
                            </Link>
                        </div>

                        {/* Notification */}
                        <div className="col col-auto h-100 d-flex align-items-center">
                            <Notification />
                        </div>

                        {/* Current user + avatar */}
                        <div className="col col-auto h-100">
                            <CurrentUser />
                        </div>

                        {/* Navigation bar + toggler (only display on mobile screen) */}
                        <div className="col col-auto h-100 d-sm-none d-flex">
                            <button className="btn bg-default border border-primary-subtle p-0"
                                    type="button" id="navbar-toggler"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvas-navbar"
                                    aria-controls="offcanvas-navbar"
                                    aria-label="Toggle navigation">
                                <i className="bi bi-list"></i>
                            </button>
                            <MobileNavigationBar />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row flex-fill position-relative">
                {/* Sidebar */}
                <div className="col col-auto d-sm-flex d-none flex-column align-items-center
                                bg-white border-end border-default position-relative"
                        id="sidebar">
                    <NavigationBar keepExpanded={false} sticky />
                </div>

                {/* Main content */}
                <div className="col py-2 px-1 position-relative" id="content">
                    <Breadcrumb />
                    <HomeRoutes />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;