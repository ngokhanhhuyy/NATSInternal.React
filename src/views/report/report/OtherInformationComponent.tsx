import React from "react";

// Child component.
import PercentageGraph from "./percentageGraph/PercentageGraphComponent";

// Props.
interface OtherInformationProps<TDetail extends IStatsDetailModel> {
    model: TDetail;
    isReloading: boolean;
}

// Component.
const OtherInformation = <TDetail extends IStatsDetailModel>
        (props: OtherInformationProps<TDetail>) => {
    return (
        <PercentageGraph
            items={[
                {
                    displayName: () => "Khách hàng mới",
                    color: "success",
                    amount: props.model.newCustomers,
                    formatter: (amount) => `${amount} khách`
                },
                {
                    displayName: () => "Thuế VAT đã thu",
                    color: "purple",
                    amount: props.model.vatCollectedAmount,
                },
            ]}
            title="Thông tin khác"
            showPercentageGraph={false}
            showTotalAmount={false}
            isReloading={props.isReloading}
        />
    );
};

export default OtherInformation;