import React from "react";
import { Link } from "react-router-dom";
import { DebtOperationType } from "@/services/dtos/enums";
import { type CustomerDetailModel } from "@/models/customer/customerDetailModel";
import type { CustomerDebtOperationModel } from "@/models/customer/customerDebtOperationModel";
import { useAmountUtility } from "@/utilities/amountUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Placeholder component.
import PlaceholderText from "@/views/shared/placeholder/PlaceholderTextComponent";

// Utility
const amountUtility = useAmountUtility();

// Components.
const CustomerDebtOperations = ({ model }: { model: CustomerDetailModel | undefined }) => {
    // Dependencies.
    const routeGenerator = useRouteGenerator();

    // Computed.
    const className = model ? "" : "placeholder-glow pe-none";

    // Header.
    const header = (() => {
        if (model) {
            return (
                <>
                    <Link to={routeGenerator.getDebtIncurrenceCreateRoute()}
                            className="btn btn-primary btn-sm me-2">
                        <i className="bi bi-plus-lg me-1"></i>
                        <span>Ghi nợ</span>
                    </Link>
                    <Link to={routeGenerator.getDebtIncurrenceCreateRoute()}
                            className="btn btn-success btn-sm">
                        <i className="bi bi-plus-lg me-1"></i>
                        <span>Trả nợ</span>
                    </Link>
                </>
            );
        }

        return (
            <>
                <button type="button"
                        className="btn btn-primary btn-sm me-2 placeholder disabled">
                    <i className="bi bi-plus-lg me-1 opacity-0"></i>
                    <span className="opacity-0">Ghi nợ</span>
                </button>
                <button type="button" className="btn btn-success btn-sm placeholder disabled">
                    <i className="bi bi-plus-lg me-1 opacity-0"></i>
                    <span className="opacity-0">Trả nợ</span>
                </button>
            </>
        );
    })();

    return (
        <MainBlock title="Lịch sử nợ" header={header} bodyPadding={0} bodyBorder={false}
                bodyClassName={`d-flex flex-column ${className}`}>

            {/* Fallback */}
            {model && model.debtOperations.length === 0 && (
                <div className="p-4 border border-top-0 rounded-bottom-3 text-center">
                    <span className="opacity-50">Không có lịch sử nợ nào</span>
                </div>
            )}

            {(!model || model.debtOperations.length > 0) && <List model={model} />}
        </MainBlock>
    );
};

const List = ({ model }: { model: CustomerDetailModel | undefined  }) => {
    // Computed values.
    const debtAmountClassName = (() => {
        if (!model) {
            return "";
        }

        return !model.debtAmount ? "opacity-50" : "fw-bold";
    })();

    const debtAmountText = (() => {
        if (!model) {
            return <PlaceholderText width={150} />;
        }
        
        if (!model.debtAmount) {
            amountUtility.getDisplayText(model.debtAmount);
        }

        return "Không có khoản nợ nào";
    })();

    return (
        <>
            {/* Header */}
            <div className="bg-secondary bg-opacity-10 border
                            border-top-0 border-secondary-subtle px-2">
                <div className="row g-0">
                    <div className="col col-md-5 col-4">
                        <div className="row gx-3 gy-0">
                            <div className="col col-lg-5 col-12">Phân loại</div>
                            <div className="col d-lg-block d-none">Số tiền</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row gx-3 gy-0 w-100">
                            <div className="col col-xl-7 col-lg-8 col-12 d-lg-block d-none">
                                Ngày
                            </div>
                            <div className="col d-lg-block d-none">
                                Giờ
                            </div>
                            <div className="col col-12 d-lg-none d-block">
                                Thời gian
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-1 col-12"></div>
                </div>
            </div>

            {/* Body */}
            <ul className="list-group list-group-flush m-0 border
                            border-top-0 border-bottom-0 small">
                {model && model.debtOperations.map((operation, index) => (
                    <ListItem model={operation} key={index} />
                ))}
                {!model && Array.from(Array(5).keys()).map(index => (
                    <ListItem key={index} />
                ))}
            </ul>

            {/* Footer */}
            <div className="bg-secondary bg-opacity-10 border border-secondary-subtle
                            rounded-bottom-3 row gx-3 py-1 px-2">
                <div className="col text-end">
                    <span>Tổng số nợ còn lại:</span>
                </div>
                <div className="col col-auto">
                    <span className={debtAmountClassName}>{debtAmountText}</span>
                </div>
            </div>
        </>
    );
};

const ListItem = ({ model }: { model?: CustomerDebtOperationModel }) => {
    // Computed.
    const iconClassName = model?.operation === DebtOperationType.DebtPayment
        ? "bi-arrow-down-left"
        : "bi-arrow-up-right";

    const typeText = model?.operation === DebtOperationType.DebtIncurrence
        ? "Ghi nợ"
        : "Trả nợ";

    const iconAndTypeColumnClass = (() => {
        if (!model) {
            return Math.random() > 0.5 ? "text-danger" : "text-success";
        }

        return model?.operation === DebtOperationType.DebtIncurrence
            ? "text-danger"
            : "text-success";
    })();

    return (
        <li className="list-group-item px-2 py-0">
            <div className="row gx-0 gy-3 align-items-center">
                {/* Icon + Type + Amount */}
                <div className={`col col-md-5 col-4 py-lg-2 py-0 my-lg-1 my-0
                                ${iconAndTypeColumnClass}`}>
                    <div className="row gx-3 h-100 w-100">
                        <div className="col col-lg-5 col-12 d-flex align-items-center">
                            <span className="fw-bold">
                                {/* Icon */}
                                {model && <i className={`bi ${iconClassName} me-2`}></i>}
                                {!model && (
                                    <PlaceholderText width={20} />
                                )}

                                {/* Type */}
                                {model && typeText}
                                {!model && <PlaceholderText width={100} />}
                            </span>
                        </div>
                        
                        {/* Amount */}
                        <div className="col d-flex align-items-center">
                            {model && amountUtility.getDisplayText(model.amount)}
                            {!model && <PlaceholderText width={100} />}
                        </div>
                    </div>
                </div>

                {/* StatsDateTime */}
                <div className="col d-flex flex-column align-items-start">
                    <div className="row gx-3 gy-0 w-100 h-100">
                        {/* OperatedDate */}
                        <div className="col col-xl-7 col-lg-8 col-12">
                            <i className="bi bi-calendar-week me-2 text-primary"></i>
                            <span>
                                {model && model.operatedDateTime.date}
                                {!model && <PlaceholderText width={150} />}
                            </span>
                        </div> 

                        {/* OperatedTime */}
                        <div className="col">
                            <i className="bi bi-clock me-2 text-primary"></i>
                            <span>
                                {model && model.operatedDateTime.time}
                                {!model && <PlaceholderText width={40} />}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action button */}
                <div className="col col-md-1 col-2 d-flex justify-content-end
                                align-items-center p-2">
                    {(!model || model.authorization.canEdit) && (
                        <button className="btn btn-outline-primary btn-sm">
                            <i className={`bi bi-pencil-square
                                        ${!model ? "opacity-0" : ""}`} />
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
};

export default CustomerDebtOperations;