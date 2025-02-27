import React, { useState, useRef, useMemo, useEffect } from "react";
import ApexCharts, { type ApexOptions } from "apexcharts";
import type { DailyStatsBasicModel } from "@models/stats/dailyStatsBasicModel";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Props.
interface Props {
    model: DailyStatsBasicModel[];
    isReloading: boolean;
}

// Component.
const FinanceAreaGraph = (props: Props) => {
    // Dependencies.
    const amountUtility = useAmountUtility();

    // State.
    const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
    const chartController = useRef<ApexCharts | null>(null);
    const chartElementRef = useRef<HTMLDivElement | null>(null);

    // Effect.
    useEffect(() => {
        const handleScreenSizeChange = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleScreenSizeChange);
        return () => {
            window.removeEventListener("resize", handleScreenSizeChange);
        };
    }, []);

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
                height: 350,
                width: "100%",
                redrawOnWindowResize: false
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                type: "category",
                categories: props.model.map(stats => {
                    return stats.recordedDay.toString().padStart(2, "0");
                }),
                labels: {
                    show: true,
                    rotate: 0,
                    rotateAlways: false,
                    hideOverlappingLabels: false,
                    formatter: (day: string) => {
                        if (windowWidth > 1200 || props.model.length < 15) {
                            return day;
                        }

                        const parsedDay = parseInt(day);
                        if (windowWidth > 576) {
                            return parsedDay % 2 === 1 ? day : "";
                        }

                        return parsedDay % 3 === 1 ? day : "";
                    }
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
                size: windowWidth > 576 ? 5 : 3,
                shape: "circle",
                hover: windowWidth > 576 ? { size: 7 } : { }
            },
            stroke: {
                show: true,
                width: windowWidth > 576 ? 3 : 2
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
                x: {
                    formatter: (value: number) => {
                        return `Ngày ${value.toString().padStart(2, "0")}`;
                    }
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
            ],
        };

        if (!chartController.current) {
            chartController.current = new ApexCharts(chartElementRef.current, options);
            chartController.current.render();
        } else {
            chartController.current?.updateOptions(options);
        }
    }, [props.model, windowWidth]);

    useEffect(() => {
        return () => chartController.current?.destroy();
    }, []);

    // Computed.
    const maxValue = useMemo<number>(() => {
        return Math.max(
            ...props.model.map(stats => stats.grossRevenue),
            ...props.model.map(stats => stats.expenses + stats.cost));
    }, [props.model]);

    return (
        <MainBlock
            title="Biểu đồ các ngày trong tháng"
            bodyPadding={[3, 3, 0, 2]}
            className={`h-100 ${props.isReloading ? "opacity-50 pe-none" : ""}`}
        >
            <div ref={chartElementRef} />
        </MainBlock>
    );
};

export default FinanceAreaGraph;