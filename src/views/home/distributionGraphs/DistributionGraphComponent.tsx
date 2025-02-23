import React from "react";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Props.
interface Props {
    blockTitle: string;
    model: ItemProps[];
    className?: string;
}

export interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
    type: "expense" | "cost" | "consultant" | "order" | "treatment";
    displayName?: (displayNameGetter: ((key: string) => string)) => string;
    amount: number;
    percentage: number;
}

const DistributionGraph = (props: Props) => {
    return (
        <MainBlock
            title={props.blockTitle}
            className={`${props.className ?? ""}`}
            bodyPadding={[2, 3, 3, 3]}
        >
            {props.model.map((item, index) => (
                <Item
                    {...item}
                    className={index < props.model.length - 1 ? "mb-3" : undefined}
                    key={item.type}
                />
            ))}
        </MainBlock>
    );
};

const Item = (props: ItemProps) => {
    // Dependencies.
    const getDisplayName = useInitialDataStore(store => store.getDisplayName);
    const amountUtility = useAmountUtility();

    // Computed.
    const { type, displayName, amount, percentage, ...rest } = props;

    const color = ((): string => {
        switch (props.type) {
            case "expense":
                return "purple";
            case "cost":
                return "orange";
            case "consultant":
                return "primary";
            case "order":
                return "success";
            case "treatment":
                return "danger";
        }
    })();

    const labelText = (() => {
        if (props.displayName) {
            return props.displayName(getDisplayName);
        }

        return getDisplayName(props.type);
    })();
    
    return (
        <div {...rest}>
            <div className={`d-flex justify-content-between text-${color}`}>
                {/* Label */}
                <span className="fw-bold">
                    {labelText}
                </span>

                {/* Detail */}
                <span className="small">
                    {amountUtility.getDisplayText(props.amount)} ({props.percentage}%)
                </span>
            </div>

            
            {/* Progress Bar */}
            <div
                className="progress"
                role="progressbar"
                aria-label="Example with label"
                aria-valuenow={0} aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className={`progress-bar progress-bar-striped bg-${color} text-light`}
                    style={{ width: `${props.percentage}%` }}
                >
                    {props.percentage}%
                </div>
            </div>
        </div>
    );
};

export default DistributionGraph;