import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import type { ConsultantBasicModel } from "@/models/consultantModels";
import { useAmountUtility } from "@/utilities/amountUtility";

// Shared component.
import HasStatsListResults from "@/views/shared/hasStatsList/HasStatsListResultsComponent";

// Props.
interface Props {
    model: ConsultantBasicModel[];
    isReloading: boolean;
}

// Component.
const Results = ({ model, isReloading }: Props) => {
    return (
        <HasStatsListResults resourceType="consultant" model={model} isReloading={isReloading}
            render={(consultant) => <ResultsItem model={consultant} key={consultant.id} />}
        />
    );
};

const ResultsItem = ({ model }: { model: ConsultantBasicModel }) => {
    // Dependency.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const computeClassName = () => {
        if (!model.isLocked) {
            return "bg-primary-subtle text-primary";
        }

        return "bg-danger-subtle text-danger";
    };

    return (
        <li className="list-group-item bg-transparent ps-3 p-2
                        d-flex align-items-center small">
            {/* Id */}
            <span className={`text-primary px-2 py-1 me-lg-3 me-md-2 me-3 rounded small
                            fw-bold ${computeClassName()}`}>
                #{model.id}
            </span>

            {/* Detail */}
            <div className="row gx-3 flex-fill">
                {/* Amount */}
                <div className="col col-md-3 col-12 justify-content-start ps-0
                                align-items-center mb-sm-0 mb-1">
                    <span className="text-primary px-1 rounded me-2">
                        <i className="bi bi-cash-coin"></i>
                    </span>
                    <span>
                        {amountUtility.getDisplayText(model.amount)}
                    </span>
                </div>

                {/* PaidDate */}
                <div className="col col-lg-3 col-md-12 col-12
                                justify-content-start ps-0 d-xl-block d-lg-none
                                d-md-none d-sm-none d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-calendar-week"></i>
                    </span>
                    <span>{model.statsDateTime.date}</span>
                </div>

                {/* PaidTime */}
                <div className="col col-lg-3 col-md-12 col-12 ps-0
                                justify-content-start align-items-center
                                d-xl-block d-lg-none d-md-none d-sm-none d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-clock"></i>
                    </span>
                    <span>{model.statsDateTime.time}</span>
                </div>

                {/* StatsDateTime */}
                <div className="col col-md-auto col-12 justify-content-start
                                ps-0 d-xl-none d-lg-block d-block
                                align-items-center mb-sm-0 mb-1">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-calendar-week"></i>
                    </span>
                    <span>{model.statsDateTime.dateTime}</span>
                </div>

                {/* Customer */}
                <div className="col col-md col-12 justify-content-start
                                ps-0 align-items-center mb-sm-0 mb-1 ms-md-3 ms-0">
                        <span className="px-1 rounded text-primary me-2">
                            <i className="bi bi-person-circle"></i>
                        </span>
                    <Link to={model.customer.detailRoute}>
                        {model.customer.fullName}
                    </Link>
                </div>
            </div>

            {/* Action button */}
            <Link to={model.detailRoute}
                    className="btn btn-outline-primary btn-sm flex-shrink-0 mx-2">
                <i className="bi bi-eye"></i>
            </Link>
        </li>
    );
};

export default Results;