import React from "react";

// Child component.
import PercentageGraph from "./percentageGraph/PercentageGraphComponent";

// Props.
interface CostProps<TDetail extends IStatsDetailModel> {
    model: TDetail;
    isReloading: boolean;
}

// Component.
const Cost = <TDetail extends IStatsDetailModel>(props: CostProps<TDetail>) => {
    return (
        <PercentageGraph
            items={[
                {
                    displayName: () => "Nhập hàng",
                    color: "orange",
                    amount: props.model.supplyCost
                },
                {
                    displayName: () => "Vận chuyển",
                    color: "purple",
                    amount: props.model.shipmentCost
                }
            ]}
            totalAmountClassName="text-primary"
            title="Chi phí nhập hàng"
            isReloading={props.isReloading}
        />
    );
};

export default Cost;