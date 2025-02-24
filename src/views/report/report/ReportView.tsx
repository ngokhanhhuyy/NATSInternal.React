import React, { useMemo } from "react";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child component.
import Detail from "./DetailComponent";

// Props.
interface Props<TStatsDetail extends IStatsDetailModel> {
    model: TStatsDetail;
    renderTop?: (model: TStatsDetail) => React.ReactNode | React.ReactNode[];
    isInitialLoading: boolean;
    isReloading?: boolean;
}

// Component.
const ReportView = <TStatsDetail extends IStatsDetailModel>(props: Props<TStatsDetail>) => {
    // Dependencies.
    const amountUtility = useAmountUtility();

    return (
        <MainContainer isInitialLoading={props.isInitialLoading}>
            {/* Top slot */}
            {props.renderTop?.(props.model)}

            {/* Detail */}
            <div className="row g-3">
                <div className="col col-12">
                    <Detail model={props.model} isReloading={props.isReloading ?? false} />
                </div>
            </div>
        </MainContainer>
    );
};

export default ReportView;