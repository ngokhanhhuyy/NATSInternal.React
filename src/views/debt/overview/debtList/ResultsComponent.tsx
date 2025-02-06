import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAmountUtility } from "@/utilities/amountUtility";
import type { DebtIncurrenceBasicModel }
    from "@/models/debtIncurrence/debtIncurrenceBasicModel";
import type { DebtPaymentBasicModel } from "@/models/debtPayment/debtPaymentBasicModel";

// Type.
type BasicModel = DebtIncurrenceBasicModel | DebtPaymentBasicModel;

// Props.
interface ResultsProps<TBasic extends BasicModel> {
    model: TBasic[];
    displayName: string;
    isReloading: boolean;
}

// Component.
const Results = <TBasic extends BasicModel>(props: ResultsProps<TBasic>) => {
    if (!props.model.length) {
        return (
            <div className="m-4 opacity-50 text-center">
                Không có {props.displayName.toLowerCase()} nào gần đây
            </div>
        );
    }
    
    // Computed.
    const computeClassName = () => props.isReloading ? "opacity-50 pe-none" : "";

    return (
        <ul className={`list-group list-group-flush ${computeClassName()}`}>
            {props.model.map((debt) => <Item model={debt} key={debt.id} />)}
        </ul>
    );
};

const Item = <TBasic extends BasicModel>(props: { model: TBasic }) => {
    // Dependencies.:
    const amountUtility = useMemo(useAmountUtility, []);

    // Memo.
    const avatarStyle = useMemo<React.CSSProperties>(() => ({
        width: "40px",
        height: "40px"
    }), []);

    return (
        <li className="list-group-item bg-transparent" key="debt.id">
            <div className="row g-0">
                {/* Customer Avatar + Details */}
                <div className="col d-flex justify-content-start align-items-center">
                    {/* Customer Avatar */}
                    <img className="img-thumbnail rounded-circle customer-avatar
                                    me-3 flex-shrink-0"
                        src={props.model.customer.avatarUrl}
                        style={avatarStyle}
                    />

                    <div className="d-flex flex-column">
                        {/* Customer FullName */}
                        <Link to={props.model.customer.detailRoute} className="d-block">
                            {props.model.customer.fullName}
                        </Link>

                        {/* Amount */}
                        <div className="small">
                            <i className="bi bi-info-circle me-1 text-primary" />
                            {amountUtility.getDisplayText(props.model.amount)}&nbsp;
                            {/* StatsDeltaText */}
                            <span className="opacity-50">
                                ({props.model.statsDateTime.deltaText})
                            </span>
                        </div>

                    </div>
                </div>

                {/* DetailRoute */}
                <div className="col col-auto d-flex justify-content-end
                            align-items-center">
                    <Link to={props.model.detailRoute}
                            className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-eye"></i>
                    </Link>
                </div>
            </div>
        </li>
    );
};

export default Results;