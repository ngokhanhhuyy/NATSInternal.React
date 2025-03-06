import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ExpenseCategory } from "@/services/dtos/enums";
import { ExpenseDetailModel } from "@/models/expense/expenseDetailModel";
import { useExpenseService } from "@/services/expenseService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout components.
import MainContainer from "@layouts/MainContainerComponent";
import MainBlock from "@layouts/MainBlockComponent";

// Child component.
import ExpenseUpdateHistoryList from "./ExpenseUpdateHistoryListComponent";

// Component.
const ExpenseDetailView = ({ id }: { id: number }) => {
    // Dependencies.
    const service = useExpenseService();
    const amountUtility = useMemo(useAmountUtility, []);

    // Model and states.
    useViewStates();
    const model = useAsyncModelInitializer({
        initializer: async () => {
            const responseDto = await service.getDetailAsync(id);
            return new ExpenseDetailModel(responseDto);
        },
        cacheKey: "expenseDetail"
    });

    // Computed.
    const labelColumnClassName = "col col-12";

    const computeIdClass = (): string => {
        const color = model.isLocked ? "danger" : "primary";
        return `bg-${color}-subtle border border-${color}-subtle \
                rounded px-2 py-1 text-${color} small fw-bold`;
    };

    const computeIsClosedClassName = () => model.isLocked ? "text-danger" : "text-primary";
    const computeIsClosedText = () => model.isLocked ? "Đã khoá" : "Chưa khoá";

    const computeCategoryText = (): string => {
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
        <MainContainer>
            <div className="row g-3 justify-content-center">
                {/* ResourceAccess */}
                {/* <div className="col col-12">
                    <ResourceAccess resource-type="Expense" :resource-primary-id="model.id"
                            accessMode="Detail" />
                </div> */}
    
                {/* Expense detail */}
                <div className="col col-12">
                    <MainBlock title="Chi tiết chi phí" closeButton bodyPadding={[2, 2, 2, 2]}>
                        {/* Id */}
                        <div className="row gx-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Mã số</span>
                            </div>

                            <div className="col text-primary">
                                <span className={computeIdClass()}>
                                    #{model.id}
                                </span>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Số tiền thanh toán</span>
                            </div>
                            <div className="col text-primary">
                                <span>
                                    {amountUtility.getDisplayText(model.amountAfterVat)}
                                </span>
                            </div>
                        </div>

                        {/* CreatedDateTime */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Ngày giờ tạo</span>
                            </div>
                            <div className="col text-primary">
                                <span>{model.createdDateTime.dateTime}</span>&nbsp;
                                <span className="text-default opacity-75">
                                    ({model.createdDateTime.deltaText})
                                </span>
                            </div>
                        </div>

                        {/* StatsDateTime */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Ngày giờ thống kê</span>
                            </div>
                            <div className="col text-primary">
                                <span>{model.statsDateTime.dateTime}</span>&nbsp;
                                <span className="text-default opacity-75">
                                    ({model.statsDateTime.deltaText})
                                </span>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Phân loại</span>
                            </div>
                            <div className="col text-primary">
                                <span>{computeCategoryText()}</span>
                            </div>
                        </div>

                        {/* Note */}
                        {model.note && (
                            <div className="row gx-3 mt-3">
                                <div className={labelColumnClassName}>
                                    <span className="fw-bold">Ghi chú</span>
                                </div>
                                <div className="col text-primary">
                                    <span>{model.note}</span>
                                </div>
                            </div>
                        )}

                        {/* PayeeName */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Thanh toán cho</span>
                            </div>
                            <div className="col text-primary">
                                <span>{model.payeeName}</span>
                            </div>
                        </div>

                        {/* IsClosed */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Tình trạng</span>
                            </div>
                            <div className="col text-primary">
                                <span className={computeIsClosedClassName()}>
                                    {computeIsClosedText()}
                                </span>
                            </div>
                        </div>
                        
                        {/* User */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Người tạo</span>
                            </div>
                            <div className="col d-flex justify-content-start
                                            align-items-center">
                                <img className="img-thumbnail rounded-circle me-2"
                                        src={model.createdUser.avatarUrl}
                                        style={{ width: 35, height: 35 }} />
                                <Link to={model.createdUser.detailRoute}
                                        className="user-fullname">
                                    {model.createdUser.fullName}
                                </Link>
                            </div>
                        </div>
                    </MainBlock>
                </div>

                {/* UpdateHistories */}
                {model.updateHistories.length > 0 && (
                    <div className="col col-12">
                        <ExpenseUpdateHistoryList model={model.updateHistories} />
                    </div>
                )}
            </div>
    
            {/* Action buttons */}
            <div className="row g-3 justify-content-end">
                {/* Edit button */}
                <div className="col col-auto">
                    <Link to={model.updateRoute} className="btn btn-primary">
                        <i className="bi bi-pencil-square me-2"></i>
                        <span>Sửa</span>
                    </Link>
                </div>
            </div>
        </MainContainer>
    );
};

export default ExpenseDetailView;