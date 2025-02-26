import React from "react";

// Child component.
import PercentageGraph from "./percentageGraph/PercentageGraphComponent";

// Props.
interface DebtProps<TDetail extends IStatsDetailModel> {
    model: TDetail;
    isReloading: boolean;
}

// Component.
const Debt = <TDetail extends IStatsDetailModel>(props: DebtProps<TDetail>) => {
    return (
        <PercentageGraph
            items={[
                {
                    displayName: (getDisplayName) => getDisplayName("debtIncurrence"),
                    color: "danger",
                    amount: props.model.debtIncurredAmount,
                },
                {
                    displayName: (getDisplayName) => getDisplayName("debtPayment"),
                    color: "success",
                    amount: props.model.debtPaidAmount,
                },
            ]}
            title="Nợ"
            showPercentageGraph={false}
            showTotalAmount={false}
            isReloading={props.isReloading}
        />
    );
};

export default Debt;