import React from "react";

// Child component.
import PercentageGraph from "./percentageGraph/PercentageGraphComponent";

// Props.
interface RevenueProps<TDetail extends IStatsDetailModel> {
    model: TDetail;
    isReloading: boolean;
}

// Component.
const Revenue = <TDetail extends IStatsDetailModel>(props: RevenueProps<TDetail>) => {
    return (
        <PercentageGraph
            items={[
                {
                    displayName: (getDisplayName) => getDisplayName("consultant"),
                    color: "success",
                    amount: props.model.consultantGrossRevenue,
                },
                {
                    displayName: () => "Bán lẻ",
                    color: "purple",
                    amount: props.model.retailGrossRevenue,
                },
                {
                    displayName: (getDisplayName) => getDisplayName("treatment"),
                    color: "danger",
                    amount: props.model.treatmentGrossRevenue,
                },
            ]}
            totalAmountClassName="text-primary"
            title="Doanh thu"
            isReloading={props.isReloading}
        />
    );
};

export default Revenue;