import React, { useMemo } from "react";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "@layouts/MainBlockComponent";

// Props.
interface PercentageGraphProps {
    items?: ItemProps[];
    title: string;
    totalAmountClassName?: string;
    showTotalAmount?: boolean;
    showPercentageGraph?: boolean;
    isReloading: boolean;
}

interface ItemProps {
    displayName: (getDisplayName: (key: string) => string) => string;
    color: "primary" | "success" | "warning" | "danger" | "orange" | "purple" | "black";
    amount: number;
    formatter?: (amount: number) => string;
}

const PercentageGraphTesting = (props: PercentageGraphProps) => {
    // Dependencies.
    const amountUtility = useAmountUtility();
    const getDisplayName = useInitialDataStore(store => store.getDisplayName);

    // Computed props.
    const showTotalAmount = props.showTotalAmount ?? true;
    const showPercentageGraph = props.showPercentageGraph ?? true;

    // Computed.
    const totalAmount = useMemo<number>(() => {
        if (props.items == null) {
            return 0;
        }

        return props.items.reduce((total, evaluatingItem) => total + evaluatingItem.amount, 0);
    }, [props.items]);

    const percentageList = useMemo<number[]>(() => {
        const percentageItems: number[] = [];
        if (props.items == null || !showPercentageGraph) {
            return percentageItems;
        }

        let stackingAmount = 0;
        for (let index = 0; index < props.items.length; index++) {
            const item = props.items[index];
            if (index < props.items.length - 1) {
                const percentage = Math.round(item.amount / totalAmount * 100);
                percentageItems.push(percentage);
                stackingAmount += percentage;
            } else {
                percentageItems.push(100 - stackingAmount);
            }
        }

        return percentageItems;
    }, [props.items]);

    const containerClassName = ((): string => {
        const classNames: string[] = ["d-flex flex-column"];
        if (props.isReloading) {
            classNames.push("opacity-50 pe-none");
        }

        return classNames.join(" ");
    })();

    const totalAmountClassName = ((): string | undefined => {
        if (!showTotalAmount) {
            return;
        }
        const classNames = ["fs-2 text-end mx-3 mt-3 mb-2"];
        if (props.totalAmountClassName) {
            classNames.push(props.totalAmountClassName);
        }

        if (totalAmount === 0) {
            classNames.push("text-secondary opacity-75");
        }

        if (props.items != null) {
            classNames.push("pb-2 border-bottom");
        }

        return classNames.join(" ");
    })();

    const computeLegendItemClassName = (item: ItemProps, index: number): string => {
        const classNames = [
            "d-flex flex-row justify-content-between px-3",
            `text-${item.color}`
        ];

        const isLastIndex = index === props.items!.length - 1;
        if (!showTotalAmount && index === 0) {
            classNames.push("mt-2");
        } else if ((!showPercentageGraph || totalAmount === 0) && isLastIndex) {
            classNames.push("mb-2");
        }

        return classNames.join(" ");
    };

    const computeLegendIconClassName = (item: ItemProps): string => {
        return `bg-${item.color} rounded-circle me-2 d-inline-block`;
    };

    const computeAmountClassName = (item: ItemProps): string | undefined => {
        return item.amount !== 0 ? undefined : "text-secondary opacity-75";
    };

    const computeAmountText = (item: ItemProps): string => {
        if (item.formatter) {
            return item.formatter(item.amount);
        }

        return amountUtility.getDisplayText(item.amount);
    };

    const computeProgressBarSegmentClassName = (item: ItemProps) => {
        const classNames = [`progress-bar bg-${item.color}`];
        if (item.color === "warning") {
            classNames.push("text-dark");
        } else {
            classNames.push("text-light");
        }

        return classNames.join(" ");
    };

    return (
        <MainBlock title={props.title} bodyPadding={0}>
            <div className={containerClassName}>
                {/* Total amount */}
                {showTotalAmount && (
                    <span className={totalAmountClassName}>
                        {amountUtility.getDisplayText(totalAmount)}
                    </span>
                )}

                {props.items?.map((item, index) => (
                    <div className={computeLegendItemClassName(item, index)} key={index}>
                        <div className="d-flex align-items-center">
                            <span
                                className={computeLegendIconClassName(item)}
                                style={{width: 8, height: 8, aspectRatio: 1}}
                            />
                            <span className="fw-bold">
                                {item.displayName(getDisplayName)}
                            </span>
                        </div>
                        <span className={computeAmountClassName(item)}>
                            {computeAmountText(item)}
                        </span>
                    </div>
                ))}
                
                {showPercentageGraph && totalAmount > 0 && props.items && (
                    <div className="progress mt-2 mx-3 mb-3">
                        {props.items.map((item, index) => (
                            <div
                                className={computeProgressBarSegmentClassName(item)}
                                role="progressbar"
                                style={{ width: `${percentageList[index]}%` }}
                                key={index}
                            >
                                    {percentageList[index] > 7 && `${percentageList[index]}%`}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainBlock>
    );
};

export default PercentageGraphTesting;