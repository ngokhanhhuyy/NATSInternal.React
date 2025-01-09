import React from "react";

// Props.
interface MainContainerProps extends React.ComponentPropsWithoutRef<"div"> {
    isInitialLoading?: boolean;
}

const MainContainer = (props: MainContainerProps) => {
    const { className, children, isInitialLoading, ...rest } = props;

    const computeClassName = () => {
        const names = [
            className,
            isInitialLoading ? "d-none" : undefined
        ];

        return names.filter(name => name).join(" ");
    };

    return (
        <div className={`container-fluid d-flex flex-column px-2 pb-1 ${computeClassName()}`}
            {...rest}>
            {children}
        </div>
    );
};

export default MainContainer;