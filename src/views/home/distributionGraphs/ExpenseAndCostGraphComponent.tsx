import React, { useMemo } from "react";
import type { DailyStatsDetailModel } from "@/models/stats/dailyStatsDetailModel";

// Shared component.
import  DistributionGraph, { type ItemProps }
    from "./DistributionGraphComponent";

// Props.
interface ExpenseAndCostGraphProps {
    model: DailyStatsDetailModel[];
}

const ExpenseAndCostGraph = (props: ExpenseAndCostGraphProps) => {
    // Computed.
    const distributionGraphProps = useMemo((): ItemProps[] => {
        const expenseAmount = props.model
            .map(stats => stats.expenses)
            .reduce((total, current) => total + current);
        const costAmount = props.model
            .map(stats => stats.cost)
            .reduce((total, current) => total + current);
        const totalRevenue = expenseAmount + costAmount;
        const expensePercentage = Math.round(expenseAmount / totalRevenue * 100);
        const costExpense = Math.round(costAmount / totalRevenue * 100);
        return [
            {
                type: "expense",
                displayName: () => "Vận hành",
                amount: expenseAmount,
                percentage: expensePercentage
            },
            {
                type: "cost",
                displayName: () => "Nhập hàng",
                amount: costAmount,
                percentage: costExpense
            },
        ];
    }, [props.model]);

    return (
        <DistributionGraph
            blockTitle="Cơ cấu chi phí"
            model={distributionGraphProps}
        />
    );
};

export default ExpenseAndCostGraph;