import React, { useRef, useMemo, useEffect } from "react";
import ApexCharts, { type ApexOptions } from "apexcharts";
import { DailyStatsDetailModel } from "@/models/stats/dailyStatsDetailModel";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "../layouts/MainBlockComponent";

// Props.
interface Props {
    model: DailyStatsDetailModel[];
    height?: number;
}

// Component.
const FinanceAreaGraph = (props: Props) => {
    // Dependencies.
    const amountUtility = useAmountUtility();

    // State.
    const chartElementRef = useRef<HTMLDivElement | null>(null);

    // Effect.
    useEffect(() => {
        const options: ApexOptions = {
            chart: {
                type: "area",
                id: "revenueExpenseAndDebt",
                toolbar: {
                    show: false
                },
                sparkline: {
                    enabled: false
                },
                zoom: {
                    enabled: false,
                    allowMouseWheelZoom: false
                },
                animations: {
                    enabled: true,
                },
                height: "100%",
            },
            dataLabels: {
                enabled: false
            },
            labels: props.model
                .map(stats => {
                    return stats.recordedDate
                        .toString()
                        .split(", ")[0]
                        .replaceAll("Ngày ", "");
                }).reverse(),
            xaxis: {
                labels: {
                    show: true,
                    rotate: -60,
                    rotateAlways: true,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                },
                tooltip: {
                    enabled: false
                },
            },
            fill: {
                type: "gradient",
                colors: [ "#0d6efd", "rgb(227, 98, 9)" ],
                gradient: {
                    opacityFrom: 0.7,
                    opacityTo: 0,
                }
            },
            markers: {
                size: 5,
                shape: "circle",
                hover: {
                    size: 7,
                }
            },
            stroke: {
                show: true,
            },
            yaxis: {
                tickAmount: 4,
                labels: {
                    show: true,
                    formatter: (value: number) => {
                        if (value === 0) {
                            return "0";
                        }
        
                        if (maxValue >= 1_000_000) {
                            return (value / 1_000_000).toFixed(0) + "tr";
                        }
        
                        return (value / 1_000).toFixed(1) + "N";
                    }
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                },
                min: 0,
            },
            grid: {
                show: true,
                padding: {
                    top: 0,
                    bottom: -10,
                    left: 20,
                    right: 10,
                }
            },
            legend: {
                show: true,
                position: "top"
            },
            tooltip: {
                shared: true,
                fixed: {
                    enabled: false,
                    position: "topRight",
                    offsetX: 0,
                    offsetY: 0,
                },
                y: {
                    formatter: (value: number) => amountUtility.getDisplayText(value),
                }
            },
            series: [
                {
                    name: "Doanh thu gộp",
                    data: props.model.map(stats => stats.grossRevenue).reverse()
                },
                {
                    name: "Chi phí",
                    data: props.model.map(stats => stats.expenses + stats.cost).reverse()
                }
            ]
        };

        const chart = new ApexCharts(chartElementRef.current, options);
        chart.render();

        return () => {
            chart.destroy();
        };
    }, [props.model]);

    // Computed.
    const maxValue = useMemo<number>(() => {
        return Math.max(
            ...props.model.map(stats => stats.grossRevenue),
            ...props.model.map(stats => stats.expenses + stats.cost));
    }, [props.model]);

    return (
        <MainBlock
            title="Biểu đồ 10 ngày gần nhất"
            bodyPadding={[3, 3, 0, 3]}
            className="h-100"
        > 
            <div style={{ height: 330 }}>
                <div ref={chartElementRef} />
            </div>
        </MainBlock>
    );
};

export default FinanceAreaGraph;