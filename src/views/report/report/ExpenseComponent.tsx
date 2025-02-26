import React from "react";
import { useAmountUtility } from "@/utilities/amountUtility";

// Child component.
import PercentageGraph from "./percentageGraph/PercentageGraphComponent";

// Props.
interface ExpenseProps<TDetail extends IStatsDetailModel> {
    model: TDetail;
}

// Component.
const Expense = <TDetail extends IStatsDetailModel>(props: ExpenseProps<TDetail>) => {
    // Dependencies.
    const amountUtility = useAmountUtility();

    // Computed.
    const consultantPercentage = (() => {
        return Math.round(props.model.consultantGrossRevenue / props.model.grossRevenue * 100);
    })();

    const retailPercentage = (() => {
        return Math.round(props.model.retailGrossRevenue / props.model.grossRevenue * 100);
    })();

    const treatmentPercentage = (() => {
        return 100 - (consultantPercentage + retailPercentage);
    })();

    const header = (() => {
        return (
            <span className="fw-bold small me-2">
                {amountUtility.getDisplayText(props.model.grossRevenue)}
            </span>
        );
    })();

    return (
        <PercentageGraph
            model={[
                {
                    displayName: (getDisplayName) => getDisplayName("consultant"),
                    color: "primary",
                    amount: props.model.consultantGrossRevenue,
                    percentage: consultantPercentage
                },
                {
                    displayName: () => "Bán lẻ",
                    color: "success",
                    amount: props.model.retailGrossRevenue,
                    percentage: retailPercentage
                },
                {
                    displayName: (getDisplayName) => getDisplayName("treatment"),
                    color: "danger",
                    amount: props.model.treatmentGrossRevenue,
                    percentage: treatmentPercentage
                },
            ]}
            header={header}
        />
    );
};

export default Expense;