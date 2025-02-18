import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ExpenseCategory } from "@/services/dtos/enums";
import type { ExpenseBasicModel } from "@/models/expense/expenseBasicModel";
import { useAmountUtility } from "@/utilities/amountUtility";

// Shared component.
import HasStatsListResults from "@/views/shared/hasStatsList/HasStatsListResultsComponent";

// Props.
interface Props {
    model: ExpenseBasicModel[];
    isReloading: boolean;
}

// Component.
const Results = ({ model, isReloading }: Props) => {
    
    return (
        <HasStatsListResults resourceType="expense"
            model={model}
            isReloading={isReloading}
            render={(expense) => <Item model={expense} key={expense.id} />}
        />
    );
};

const Item = ({ model }: { model: ExpenseBasicModel }) => {
    // Dependency.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const computeIdClassName = (): string => {
        if (!model.isLocked) {
            return "bg-primary-subtle text-primary";
        }

        return "bg-danger-subtle text-danger";
    };

    const computeCategoryText = () => {
        switch (model.category) {
            case ExpenseCategory.Equipment:
                return "Trang thiết bị";
            case ExpenseCategory.Office:
                return "Thuê mặt bằng";
            case ExpenseCategory.Staff:
                return "Lương/thưởng";
            case ExpenseCategory.Utilities:
                return "Tiện ích";
            default:
                return "";
        }
    };

    return (
        <li className="list-group-item bg-transparent ps-3 p-2
                        d-flex align-items-center small">
            {/* Id */}
            <span className={`text-primary px-2 py-1 me-md-5 me-3 rounded small fw-bold
                            ${computeIdClassName()}`}>
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

                {/* Category */}
                <div className="col col-lg-3 col-md-12 col-12 justify-content-start ps-0
                                align-items-center mb-sm-0 mb-1">
                    <span className="text-primary px-1 rounded me-2">
                        <i className="bi bi-tag"></i>
                    </span>
                    <span>
                        {computeCategoryText()}
                    </span>
                </div>

                {/* StatsDate */}
                <div className="col col-lg-3 col-md-12 col-12 justify-content-start ps-0
                            d-xl-block d-lg-none d-md-none d-sm-none d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-calendar-week"></i>
                    </span>
                    <span>{model.statsDateTime.date}</span>
                </div>

                {/* StatsTime */}
                <div className="col col-lg-3 col-md-12 col-12 justify-content-start
                                ps-0 align-items-center d-xl-block d-lg-none
                                d-md-none d-sm-none d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-clock"></i>
                    </span>
                    <span>{model.statsDateTime.time}</span>
                </div>

                {/* StatsDateTime */}
                <div className="col justify-content-start ps-0 d-xl-none d-lg-block d-block
                                align-items-center mb-sm-0 mb-1">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-calendar-week"></i>
                    </span>
                    <span>{model.statsDateTime.dateTime}</span>
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