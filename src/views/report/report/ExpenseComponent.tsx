import React from "react";

// Child component.
import PercentageGraph from "./percentageGraph/PercentageGraphComponent";

// Props.
interface ExpenseProps<TDetail extends IStatsDetailModel> {
    model: TDetail;
    isReloading: boolean;
}

// Component.
const Expense = <TDetail extends IStatsDetailModel>(props: ExpenseProps<TDetail>) => {
    return (
        <PercentageGraph
            items={[
                {
                    displayName: () => "Điện, nước, wifi, rác, ...",
                    color: "success",
                    amount: props.model.utilitiesExpenses,
                },
                {
                    displayName: () => "Trang thiết bị",
                    color: "danger",
                    amount: props.model.equipmentExpenses,
                },
                {
                    displayName: () => "Mặt bằng",
                    color: "purple",
                    amount: props.model.officeExpense,
                },
                {
                    displayName: () => "Lương thưởng nhân viên",
                    color: "orange",
                    amount: props.model.staffExpense,
                }
            ]}
            totalAmountClassName="text-primary"
            title="Chi phí vận hành"
            isReloading={props.isReloading}
        />
    );
};

export default Expense;