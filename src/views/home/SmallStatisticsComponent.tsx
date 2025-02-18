import React from "react";
import { MonthlyStatsBasicModel } from "@/models/stats/monthlyStatsBasicModel";

// Props.
interface Props {
    title: string;
    unit: string;
    color: "primary" | "success" | "danger" | "purple";
    thisMonthStats: MonthlyStatsBasicModel | undefined;
    lastMonthStats: MonthlyStatsBasicModel | undefined;
    statsPropertySelector: (stats: MonthlyStatsBasicModel) => number;
    statsPropertyFormatter?: (value: number) => string;
}

// Component.
const SmallStatistics = (props: Props) => {
    const statsPropertyFormatter = props.statsPropertyFormatter
        ?? ((value: number) => value.toString());

    // Computed.
    const computeIsLastMonthYearVisible = (): boolean => {
        return props.thisMonthStats?.recordedYear != props.lastMonthStats?.recordedYear;
    };

    const computeLastMonthLabelText = (): string => {
        let text = `tháng ${props.lastMonthStats?.recordedMonth}`;
        if (computeIsLastMonthYearVisible()) {
            text += `/${props.lastMonthStats?.recordedYear}`;
        }

        return text;
    };

    const computeValueText = (stats: MonthlyStatsBasicModel): string => {
        const valueText = statsPropertyFormatter(props.statsPropertySelector(stats));
        return `${valueText} ${props.unit}`;
    };

    return (
        <div className={`w-100 small-statistics text-${props.color}-emphasis`}>
            {/* Header */}
            <div className={`bg-${props.color} bg-opacity-10 border
                            border-${props.color}-subtle px-3 py-1
                            rounded-top-3 text-${props.color}`}>
                <span className="small fw-bold">
                    {props.title.toUpperCase()}
                </span>
            </div>
            
            {/* Body */}
            <div className="bg-white border border-top-0 rounded-bottom-3 px-3 py-2 text-end">
                {/* This month information */}
                {props.thisMonthStats ? (
                    <>
                        <span className={`fs-2 text-${props.color}`}>
                            {statsPropertyFormatter(
                                props.statsPropertySelector(props.thisMonthStats))
                            }
                        </span>
                        <span className="ms-2">
                            {props.unit.toUpperCase()}
                        </span>
        
                        {/* Last month information */}
                        {props.lastMonthStats && (
                            <div className="small">
                                <span className={`text-${props.color}`}>
                                    {computeValueText(props.lastMonthStats)}
                                </span>
                                <span className={`text-${props.color}-emphasis`}>
                                    trong {computeLastMonthLabelText()}
                                </span>
                            </div>
                        )}
                    </>
                ) : <div className="w-100 p-5"></div>}
            </div>
        </div>
    );
};

export default SmallStatistics;