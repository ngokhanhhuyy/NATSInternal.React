import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { type ExpenseUpdateHistoryModel }
    from "@/models/expense/expenseUpdateHistory/expenseUpdateHistoryModel";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Component.
const ExpenseUpdateHistoryList = ({ model }: { model: ExpenseUpdateHistoryModel[] }) => {
    return (
        <MainBlock
            title="Lịch sử chỉnh sửa"
            bodyPadding={0}
            className="h-100"
            bodyClassName="overflow-hidden"
        >
            <div className="accordion accordion-flush" id="updateHistory">
                {model.map((updateHistory, index) => (
                    <SupplyUpdateHistory model={updateHistory} index={index} key={index} />
                ))}
            </div>
        </MainBlock>
    );
};

const SupplyUpdateHistory = (props: { model: ExpenseUpdateHistoryModel; index: number }) => {
    const { model, index } = props;

    // Dependencies.
    const amountUtility = useMemo(useAmountUtility, []);
    
    // Computed.
    const columnClassName = "col col-md-6 col-12 d-flex flex-column";
    const avatarStyle: React.CSSProperties = {
        width: 35,
        height: 35
    };
    
    const computeStatsDateTimeVisibility = (): boolean => {
        return model.oldStatsDateTime.toString() != model.newStatsDateTime.toString();
    };

    return (
        <div className="accordion-item">
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#flush-collapse-${index}`}
                    aria-expanded="false"
                    aria-controls={`flush-collapse-${index}`}
                >
                    {model.updatedReason}
                </button>
            </h2>
            <div
                id={`flush-collapse-${index}`}
                className="accordion-collapse collapse"
                data-bs-parent="#updateHistory"
            >
                <div className="accordion-body p-2">
                    {/* UpdatedDateTime and Updater */}
                    <div className="row g-3">
                        {/* UpdatedDateTime */}
                        <div className={columnClassName}>
                            <span className="fw-bold">Thời gian chỉnh sửa</span>
                            <span className="text-primary">
                                {model.updatedDateTime.toString()}
                            </span>
                        </div>

                        {/* UpdatedUser */}
                        <div className={columnClassName}>
                            <span className="fw-bold">Nhân viên chỉnh sửa</span>
                            <div className="d-flex justify-content-start align-items-center">
                                <img className="img-thumbnail rounded-circle avatar me-2"
                                    src={model.updatedUser.avatarUrl}
                                    style={avatarStyle}
                                />
                                <Link to={model.updatedUser.detailRoute}
                                        className="user-fullname">
                                    {model.updatedUser.fullName}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Data Comparison */}
                    {/* StatsDateTime */}
                    {computeStatsDateTimeVisibility() && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <span className="fw-bold">Thời gian nhập hàng (cũ)</span>
                                <span className="text-primary">
                                    {model.oldStatsDateTime.dateTime}
                                </span>
                            </div>

                            <div className={columnClassName}>
                                <span className="fw-bold">Thời gian nhập hàng (mới)</span>
                                <span className="text-primary">
                                    {model.newStatsDateTime.dateTime}
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {/* Amount */}
                    {model.newAmount != model.oldAmount && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <span className="fw-bold">Giá tiền (cũ)</span>
                                <span className="text-primary">
                                    {amountUtility.getDisplayText(model.oldAmount)}
                                </span>
                            </div>

                            <div className={columnClassName}>
                                <span className="fw-bold">Giá tiền (mới)</span>
                                <span className="text-primary">
                                    {amountUtility.getDisplayText(model.newAmount)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Note */}
                    {model.newNote != model.oldNote && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <span className="fw-bold">Ghi chú (cũ)</span>
                                {model.oldNote ? (
                                    <span className="text-primary">
                                        {model.oldNote}
                                    </span>
                                ) : (
                                    <span className="text-secondary opacity-50">
                                        Để trống
                                    </span>
                                )}
                            </div>

                            <div className={columnClassName}>
                                <span className="fw-bold">Ghi chú (mới)</span>
                                {model.newNote ? (
                                    <span className="text-primary">
                                        {model.newNote}
                                    </span>
                                ) : (
                                    <span className="text-secondary opacity-50">
                                        Để trống
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpenseUpdateHistoryList;