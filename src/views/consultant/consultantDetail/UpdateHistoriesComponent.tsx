import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import type { ConsultantUpdateHistoryModel } from "@/models/consultantUpdateHistoryModels";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Props.
interface Props {
    model: ConsultantUpdateHistoryModel[];
}

// Component.
const UpdateHistories = ({ model }: Props) => {
    return (
        <MainBlock title="Lịch sử chỉnh sửa" bodyPadding={0} className="h-100"
                bodyClassName="overflow-hidden">
            <div className="accordion accordion-flush" id="updateHistory">
                {model.map((item, index) => <Item model={item} key={index} />)}
            </div>
        </MainBlock>
    );
};

const Item = ({ model }: { model: ConsultantUpdateHistoryModel }) => {
    // Dependencies.
    const amountUtility = useMemo(useAmountUtility, []);
    const columnClassName = useMemo(() => "col col-md-6 col-12 d-flex flex-column", []);
    const updatedReasonText = useMemo(() => {
        if (model.updatedReason) {
            return <span>{model.updatedReason}</span>;
        }

        return <span className="opacity-50">Không có lý do chỉnh sửa</span>;
    }, [model.updatedReason]);

    return (
        <>
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                    >
                    {updatedReasonText}
                </button>
            </h2>
            <div id="flush-collapseOne" className="accordion-collapse collapse"
                    data-bs-parent="#updateHistory">
                <div className="accordion-body">
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
                            <Link to={model.updatedUser.detailRoute}
                                    className="user-fullname">
                                {model.updatedUser.fullName}
                            </Link>
                        </div>
                    </div>

                    {/* Data Comparison */}
                    {/* StatsDateTime */}
                    {model.oldStatsDateTime != model.oldStatsDateTime && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <span className="fw-bold">Thời gian thống kê (cũ)</span>
                                <span className="text-primary">
                                    {model.oldStatsDateTime.dateTime}
                                </span>
                            </div>

                            <div className={columnClassName}>
                                <span className="fw-bold">Thời gian thống kê (mới)</span>
                                <span className="text-primary">
                                    {model.newStatsDateTime.dateTime}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Amount */}
                    {model.oldAmount != model.newAmount && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <span className="fw-bold">Giá tiền (cũ)</span>
                                <span className="text-primary">
                                    { amountUtility.getDisplayText(model.oldAmount) }
                                </span>
                            </div>

                            <div className={columnClassName}>
                                <span className="fw-bold">Giá tiền (mới)</span>
                                <span className="text-primary">
                                    { amountUtility.getDisplayText(model.newAmount)
                                    }
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Note */}
                    {model.oldNote != model.newNote && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <span className="fw-bold">Ghi chú (cũ)</span>
                                <Field text={model.oldNote} />
                            </div>

                            <div className={columnClassName}>
                                <span className="fw-bold">Ghi chú (mới)</span>
                                <Field text={model.newNote} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const Field = ({ text }: { text: string }) => {
    if (!text) {
        return <span className="opacity-50 text-secondary">Để trống</span>;
    }

    return <span className="text-primary" >{text}</span>;
};

export default UpdateHistories;