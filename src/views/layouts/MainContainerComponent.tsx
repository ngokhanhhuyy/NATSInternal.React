import React from "react";
import { usePageLoadProgressBarStore } from "@/stores/pageLoadProgressBarStore";

// Props.
interface MainContainerProps extends React.ComponentPropsWithRef<"div"> {
    isInitialLoading?: boolean;
    as?: "div" | "form" | "ul";
}

const MainContainer = (props: MainContainerProps) => {
    const { className, children, isInitialLoading, as, ...rest } = props;

    // Dependencies.
    const isLoading = usePageLoadProgressBarStore(store => store.phase === "waiting");

    // Computed
    const computeClassName = () => {
        const classNames = [className];
        if (isInitialLoading) {
            classNames.push("d-none");
        } else if (isLoading) {
            classNames.push("opacity-50 pe-none");
        }
        
        return classNames.filter(name => name).join(" ");
    };

    const computeStyle = (): React.CSSProperties => {
        return { transition: "opacity 0.2s ease" };
    };

    return (
        <div
            {...rest}
            className={`container-fluid d-flex flex-column px-2 pb-1 ${computeClassName()}`}
            style={computeStyle()}
        >
            {children}
        </div>
    );
};

export default MainContainer;