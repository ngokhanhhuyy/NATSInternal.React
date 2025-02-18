import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAmountUtility } from "@/utilities/amountUtility";

// Shared component.
import HasStatsListResults from "../../hasStatsList/HasStatsListResultsComponent";

// Props.
export interface ExportProductListResultsProps<
        TBasic extends IHasCustomerBasicModel<TAuthorization>,
        TAuthorization extends IHasStatsExistingAuthorizationModel>  {
    resourceType: string;
    model: Readonly<TBasic[]>;
    isReloading: boolean;
}

// Component.
const ExportProductListResults = <
            TBasic extends IHasCustomerBasicModel<TAuthorization>,
            TAuthorization extends IHasStatsExistingAuthorizationModel>
        (props: ExportProductListResultsProps<TBasic, TAuthorization>) => {
    return (
        <HasStatsListResults {...props}
            render={(item) => <Item model={item} key={item.id} />}
        />
    );
};

const Item = <
            TBasic extends IHasCustomerBasicModel<TAuthorization>,
            TAuthorization extends IHasStatsExistingAuthorizationModel>
        ({ model }: { model: TBasic }) => {
    // Dependencies.
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
            <span className={`text-primary px-2 py-1 me-xl-5 me-3 rounded small fw-bold
                            ${computeClassName()}`}>
                #{model.id}
            </span>

            {/* Detail */}
            <div className="row gx-3 flex-fill">
                {/* Amount */}
                <div className="col col-lg-3 col-md-12 col-12 justify-content-start ps-0
                                align-model.-center mb-sm-0 mb-1">
                    <span className="text-primary px-1 rounded me-2">
                        <i className="bi bi-cash-coin"></i>
                    </span>
                    <span>
                        {amountUtility.getDisplayText(model.amount)}
                    </span>
                </div>

                {/* StatsDate */}
                <div className="col col-lg-3 col-md-12 col-12 ustify-content-start ps-0
                                d-xl-block d-lg-none d-md-none d-sm-none d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-calendar-week"></i>
                    </span>
                    <span>{model.statsDateTime.date}</span>
                </div>

                {/* StatsTime */}
                <div className="col col-lg-2 col-md-12 col-12 ps-0
                                justify-content-start align-model.-center
                                d-xl-block d-lg-none d-md-none d-sm-none d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-clock"></i>
                    </span>
                    <span>{model.statsDateTime.time}</span>
                </div>

                {/* OrderedDateTime */}
                <div className="col justify-content-start ps-0 d-xl-none d-lg-block d-block
                            align-model.-center mb-sm-0 mb-1">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-calendar-week"></i>
                    </span>
                    <span>{model.statsDateTime.dateTime}</span>
                </div>

                {/* Customer */}
                <div className="col col-xl-3 col-lg-4 col-md-12 col-12
                                justify-content-start ps-0 align-model.-center">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-person-circle"></i>
                    </span>
                    <Link to={model.customer.detailRoute}>
                        {model.customer.fullName}
                    </Link>
                </div>
            </div>

            {/* Action button */}
            <Link className="btn btn-outline-primary btn-sm flex-shrink-0 mx-2"
                    to={model.detailRoute}>
                <i className="bi bi-info-circle"></i>
            </Link>
        </li>
    );
};

export default ExportProductListResults;

