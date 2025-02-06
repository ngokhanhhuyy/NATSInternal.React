import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { CustomerListModel } from "@/models/customer/customerListModel";
import { CustomerBasicModel } from "@/models/customer/customerBasicModel";
import { useAmountUtility } from "@/utilities/amountUtility";

interface CustomerListResultsProps {
    isReloading: boolean;
    model: CustomerListModel;
}

const Results = (props: CustomerListResultsProps) => {
    // Computed.
    const computeResultsClassName = () => {
        if (props.isReloading) {
            return "opacity-50 pe-none";
        }
        return null;
    };

    return (
        <div className={`col col-12 loading-opacity ${computeResultsClassName()}`}>
            <div className="bg-white border rounded-3 overflow-hidden">
                {props.model.items.length ? (
                    <ul className="list-group list-group-flush">
                        {/* Labels */}
                        <li className="list-group-item py-1 bg-secondary bg-opacity-10
                                        text-secondary-emphasis small">
                            <div className="row g-0">
                                <div className="col col-xl-1 col-2"></div>
                                <div className="col col-xl-5 col-md-5 col-10 text-start">
                                    Họ và tên
                                    <span className="d-md-none d-inline"> / Nợ còn lại</span>
                                </div>
                                <div className="col d-md-block d-none text-start">
                                    Nợ còn lại
                                </div>
                            </div>
                        </li>

                        {/* Result list */}
                        {props.model.items.map(customer => (
                            <ResultItem model={customer} key={customer.id} />
                        ))}
                    </ul>
                ) : (
                    // Fallback when the result list is empty.
                    <div className="d-flex justify-content-center align-items-center m-4">
                        <span className="opacity-50">
                            Không có khoản nợ nào vào thời điểm hiện tại
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const ResultItem = ({ model }: { model: CustomerBasicModel }) => {
    const amountUtility = useMemo(useAmountUtility, []);

    // Memo.
    const avatarStyle = useMemo(() => ({
        width: 50,
        height: 50,
        aspectRatio: 1,
    }), []);

    return (
        <li className="list-group-item bg-transparent ps-3 p-2 d-flex align-items-center">
            {/* Avatar */}
            <Link to={model.detailRoute}>
                <img className="img-thumbnail rounded-circle avatar flex-shrink-0 me-3"
                    src={model.avatarUrl}
                    style={avatarStyle}
                />
            </Link>

            <div className="row gx-3 flex-fill justify-content-start align-items-center">
                {/* FullName */}
                <div className="col col-md-6 col-12 justify-content-start d-flex flex-column
                                justify-content-stretch align-items-stretch ps-0">
                    <Link to={model.detailRoute} className="fw-bold">
                        {model.fullName}
                    </Link>
                    <span>{model.nickName}</span>
                    <span className="d-md-none d-inline">
                        {amountUtility.getDisplayText(model.debtAmount)}
                    </span>
                </div>

                {/* DebtRemainingAmount */}
                <div className="col d-md-flex d-none align-items-center p-0">
                    {amountUtility.getDisplayText(model.debtAmount)}
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