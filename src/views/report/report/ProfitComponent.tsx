import React from "react";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Props.
interface ProfitProps<TStatsDetail extends IStatsDetailModel> {
    model: TStatsDetail;
    isReloading: boolean;
};

// Component.
const Profit = <TStatsDetail extends IStatsDetailModel>(props: ProfitProps<TStatsDetail>) => {
    // Dependencies.
    const amountUtility = useAmountUtility();

    // Computed.
    const containerClassName = ((): string => {
        const classNames: string[] = ["d-flex flex-column"];
        if (props.isReloading) {
            classNames.push("opacity-50 pe-none");
        }

        return classNames.join(" ");
    })();

    const amountClassName = ((): string => {
        const classNames = ["fs-2 text-end mx-3 mt-3 mb-2 pb-2 border-bottom"];
        if (props.model.netProfit > 0) {
            classNames.push("text-success");
        }

        if (props.model.netProfit < 0) {
            classNames.push("text-danger");
        }

        return classNames.join(" ");
    })();

    return (
        <MainBlock title="Lợi nhuận" bodyPadding={0}>
            <div className={containerClassName}>
                {/* NetProfit */}
                <span className={amountClassName}>
                    {amountUtility.getDisplayText(props.model.netProfit)}
                </span>

                {/* GrossProfit */}
                <div className="d-flex flex-row justify-content-between text-orange px-3">
                    <div className="d-flex align-items-center">
                        <span
                            className="bg-orange rounded-circle me-2 d-inline-block"
                            style={{width: 8, height: 8, aspectRatio: 1}}
                        />
                        <span className="fw-bold">Lợi nhuận gộp</span>
                    </div>
                    <span>
                        {amountUtility.getDisplayText(props.model.grossProfit)}
                    </span>
                </div>

                {/* OperatingProfit */}
                <div className="d-flex flex-row justify-content-between text-purple px-3 pb-2">
                    <div>
                        <span
                            className="bg-purple rounded-circle me-2 d-inline-block"
                            style={{width: 8, height: 8, aspectRatio: 1}}
                        />
                        <span className="fw-bold">Lợi nhuận vận hành</span>
                    </div>
                    <span>
                        {amountUtility.getDisplayText(props.model.operatingProfit)}
                    </span>
                </div>
            </div>
        </MainBlock>
    );
};

export default Profit;