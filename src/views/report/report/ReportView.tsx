import React from "react";

// Layout component.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child component.
import Profit from "./ProfitComponent";
import Revenue from "./RevenueComponent";
import Expense from "./ExpenseComponent";
import Cost from "./CostComponent";
import Debt from "./DebtComponent";
import OtherInformation from "./OtherInformationComponent";

// Props.
interface Props<TStatsDetail extends IStatsDetailModel> {
    model: TStatsDetail;
    isInitialLoading: boolean;
    isReloading: boolean;
    renderTop?: (
        model: TStatsDetail,
        groupLabelColumnClassName: string) => React.ReactNode | React.ReactNode[];
    renderBottom?: (model: TStatsDetail) => React.ReactNode | React.ReactNode[];
}

// Component.
const ReportView = <TStatsDetail extends IStatsDetailModel>(props: Props<TStatsDetail>) => {
    // Computed.
    const groupLabelColumnClassName = "col col-12 fs-5 fw-bold text-primary pb-0";
    
    return (
        <MainContainer isInitialLoading={props.isInitialLoading}>
            {/* Top slot */}
            {props.renderTop?.(props.model, groupLabelColumnClassName)}

            {/* Detail */}
            <div className="row g-3 mt-3">
                <div className={groupLabelColumnClassName}>
                    {"Chi tiết".toUpperCase()}
                </div>

                <div className="col col-lg-6 col-12 p-0">
                    <div className="row g-3">
                        <div className="col col-12">
                            <Profit model={props.model} isReloading={props.isReloading} />
                        </div>
                        
                        <div className="col col-12">
                            <Revenue model={props.model} isReloading={props.isReloading} />
                        </div>

                        <div className="col col-12 d-lg-block d-none">
                            <Debt model={props.model} isReloading={props.isReloading} />
                        </div>
                    </div>
                </div>

                <div className="col col-lg-6 col-12 p-0">
                    <div className="row g-3">
                        <div className="col col-12">
                            <Expense model={props.model} isReloading={props.isReloading} />
                        </div>

                        <div className="col col-12">
                            <Cost model={props.model} isReloading={props.isReloading} />
                        </div>

                        <div className="col col-12 d-lg-none d-block">
                            <Debt model={props.model} isReloading={props.isReloading} />
                        </div>

                        <div className="col col-12">
                            <OtherInformation
                                model={props.model}
                                isReloading={props.isReloading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
};

export default ReportView;