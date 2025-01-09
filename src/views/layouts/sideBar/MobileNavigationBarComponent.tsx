import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Offcanvas } from "bootstrap";
import NavigationBar from "./NavigationBarComponent";
import * as styles from "./MobileNavigationBarComponent.module.css";

const MobileNavigationBar = () => {
    const location = useLocation();
    const offcanvasElement = useRef<HTMLDivElement | null>(null);
    const offcanvas = useRef<Offcanvas | null>(null);

    useEffect(() => {
        if (offcanvasElement.current) {
            offcanvas.current = new Offcanvas(offcanvasElement.current);
        }

        return () => {
            if (offcanvas.current) {
                offcanvas.current.dispose();
            }
        };
    }, [offcanvasElement]);

    useEffect(() => {
        if (offcanvas.current) {
            offcanvas.current.hide();
        }
    }, [location.pathname]);

    return (
        <div className={`offcanvas offcanvas-end ${styles["offcanvasNavigationBar"]}`}
                tabIndex={-1} id="offcanvas-navbar" ref={offcanvasElement}>
            <div className="offcanvas-body">
                <NavigationBar keepExpanded={true} />
            </div>
        </div>
    );
};

export default MobileNavigationBar;