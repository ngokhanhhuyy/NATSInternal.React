import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAmountUtility } from "@/utilities/amountUtility";

// Component.
const ResultsItem = <
            TBasicModel extends IDebtBasicModel<TAuthorizationModel>,
            TAuthorizationModel extends IHasStatsExistingAuthorizationModel>
        ({ model }: { model: TBasicModel }) => {
    // Dependencies.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const avatarStyle = useMemo<React.CSSProperties>(() => ({
        width: 60,
        height: 60
    }), []);

    const computeIsLockedClassName = () => {
        return model.isLocked ? "text-danger" : "text-primary";
    };

    const computeIsLockedIconClassName = () => {
        const classNames: string[] = ["bi", "me-2"];
        classNames.push(model.isLocked ? "bi bi-lock" : " bi bi-unlock");
        return classNames.join(" ");
    };

    return (
        <li className="list-group-item bg-transparent">
            <div className="row gx-3">
                {/* Customer Avatar + Details */}
                <div className="col col-xl-4 col-md-5 col-10 d-flex
                                justify-content-start align-items-center">
                    {/* Customer Avatar */}
                    <img className="img-thumbnail rounded-circle customer-avatar me-2
                                    flex-shrink-0"
                        src={model.customer.avatarUrl}
                        style={avatarStyle}
                    />

                    {/* Customer FullName and Detail visible in small screen */}
                    <div>
                        {/* Customer FullName */}
                        <Link
                            to={model.customer.detailRoute}
                            className="customer-name d-block fw-bold"
                        >
                                {model.customer.fullName}
                        </Link>

                        {/*  Detail visible in small screen visible in small screen */}
                        <div className="d-md-none d-block">
                            {/* Amount */}
                            <span className="small">
                                <i className="bi bi-cash text-primary me-2"></i>
                                {amountUtility.getDisplayText(model.amount)}
                            </span>
                            <br/>

                            {/* StatsDateTime */}
                            <span className="small">
                                <i className="bi bi-clock text-primary me-2" />
                                {model.statsDateTime.toString()}
                            </span>
                            <br/>

                            {/* IsLocked */}
                            <span className={`small ${computeIsLockedClassName()}`}>
                                <i className={computeIsLockedIconClassName()}></i>
                                {model.isLocked ? "Đã khóa" : "Chưa khóa"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col col-xl-6 col-md-6 col-5 d-md-flex d-none flex-column
                                justify-content-center align-items-start px-2">
                    {/* Amount */}
                    <span>
                        <i className="bi bi-cash text-primary me-2" />
                        {amountUtility.getDisplayText(model.amount)}
                    </span>

                    {/* StatsDateTime */}
                    <span>
                        <i className="bi bi-clock text-primary me-2"></i>
                        {model.statsDateTime.toString()}
                    </span>
                    
                    {/* IsLocked */}
                    <span className={computeIsLockedClassName()}>
                        <i className={computeIsLockedIconClassName()}></i>
                        {model.isLocked ? "Đã khóa" : "Chưa khóa"}
                    </span>
                </div>

                {/* Detail button */}
                <div className="col d-flex justify-content-end align-items-center">
                    <Link
                        className="btn btn-outline-primary btn-sm"
                        to={model.detailRoute}
                    >
                        <i className="bi bi-info-circle"></i>
                    </Link>
                </div>
            </div>
        </li>
    );
};

export default ResultsItem;