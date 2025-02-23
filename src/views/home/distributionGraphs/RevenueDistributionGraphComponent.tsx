import React, { useMemo } from "react";
import type { DailyStatsDetailModel } from "@/models/stats/dailyStatsDetailModel";

// Shared component.
import  DistributionGraph, { type ItemProps }
    from "./DistributionGraphComponent";

// Props.
interface RevenueDistributionGraphProps {
    model: DailyStatsDetailModel[];
}

const RevenueDistributionGraph = (props: RevenueDistributionGraphProps) => {
    // Computed.
    const distributionGraphProps = useMemo((): ItemProps[] => {
        const consultantRevenue = props.model
            .map(stats => stats.consultantGrossRevenue)
            .reduce((total, current) => total + current);
        const orderRevenue = props.model
            .map(stats => stats.retailGrossRevenue)
            .reduce((total, current) => total + current);
        const treatmentRevenue = props.model
            .map(stats => stats.treatmentGrossRevenue)
            .reduce((total, current) => total + current);
        const totalRevenue = consultantRevenue + orderRevenue + treatmentRevenue;
        const consultantPercentage = Math.round(consultantRevenue / totalRevenue * 100);
        const orderPercentage = Math.round(orderRevenue / totalRevenue * 100);
        const treatmentPercentage = 100 - (consultantPercentage + orderPercentage);
        return [
            {
                type: "consultant",
                amount: consultantRevenue,
                percentage: consultantPercentage
            },
            {
                type: "order",
                amount: orderRevenue,
                percentage: orderPercentage
            },
            {
                type: "treatment",
                amount: treatmentRevenue,
                percentage: treatmentPercentage
            }
        ];
    }, [props.model]);

    return (
        <DistributionGraph
            blockTitle="Cơ cấu doanh thu"
            model={distributionGraphProps}
        />);
};

export default RevenueDistributionGraph;