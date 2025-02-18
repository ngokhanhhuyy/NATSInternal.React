import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import type { SupplyBasicModel } from "@/models/supplyModels";
import { useAmountUtility } from "@/utilities/amountUtility";

// Shared component.
import HasStatsListResults from "@/views/shared/hasStatsList/HasStatsListResultsComponent";

// Props.
interface Props {
    model: SupplyBasicModel[];
    isReloading: boolean;
}

// Component.
const Results = ({ isReloading, model }: Props) => {
    return (
        <HasStatsListResults resourceType="consultant" model={model} isReloading={isReloading}
            render={(consultant) => <ResultsItem model={consultant} key={consultant.id} />}
        />
    );
};

const ResultsItem = ({ model }: { model: SupplyBasicModel }) => {
    // Dependency.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const computeClassName = () => {
        if (!model?.isLocked) {
            return "bg-primary-subtle text-primary";
        }
        
        return "bg-danger-subtle text-danger";
    };

    return (
        <li className="list-group-item bg-transparent ps-3 p-2
                        d-flex align-items-center small">
            {/* Id */}
            <span className={`text-primary px-2 py-1 me-md-3 me-3 rounded
                            small fw-bold ${computeClassName()}`}>
                {model ? `#${model.id}` : <span className="opacity-0">#000</span>}
                
            </span>

            {/* Detail */}
            <div className="row gx-3 flex-fill">
                {/* TotalAmount */}
                <div className="col col-md-4 col-12 justify-content-start ps-0
                                align-items-center mb-sm-0 mb-1">
                    <span className="text-primary px-1 rounded me-2">
                        <i className="bi bi-cash-coin"></i>
                    </span>
                    <span>{amountUtility.getDisplayText(model.amount)}</span>
                </div>

                {/* StatsDate */}
                <div className="col col-sm-5 col-12 justify-content-start ps-0
                                align-items-center mb-sm-0 mb-1 d-md-block d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-calendar-week"></i>
                    </span>
                    <span>{model.statsDateTime.date}</span>
                </div>

                {/* StatsTime */}
                <div className="col justify-content-start ps-0
                                align-items-center d-md-block d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-clock"></i>
                    </span>
                    <span>{model.statsDateTime.time}</span>
                </div>

                {/* StatsDateTime */}
                <div className="col ps-0 d-md-none d-flex flex-row
                                justify-content-start align-items-center">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-clock"></i>
                    </span>
                    <span className="d-block">{model.statsDateTime.dateTime}</span>
                </div>
            </div>

            {/* Action button */}
            <Link to={model.detailRoute}
                className="btn btn-outline-primary btn-sm flex-shrink-0 mx-2">
                <i className="bi bi-info-circle"></i>
            </Link>
        </li>
    );
};

export default Results;