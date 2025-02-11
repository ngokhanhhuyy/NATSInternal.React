import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form component.
import Label from "@/views/form/LabelComponent";

// Props.
interface Props<TUpdateHistory extends IDebtUpdateHistoryModel> {
    model: TUpdateHistory[];
}

// Component.
const UpdateHistoriesList = <TUpdateHistory extends IDebtUpdateHistoryModel>
        ({ model }: Props<TUpdateHistory>) => {
    return (
        <MainBlock
                title="Lịch sử chỉnh sửa"
                className="h-100"
                bodyPadding={0}
                bodyClassName="overflow-hidden">
            <div className="accordion accordion-flush" id="updateHistory">
                <div className="accordion-item">
                    {model.map((updateHistory, index) => (
                        <UpdateHistoryItem
                            model={updateHistory}
                            index={index}
                            key={index}
                        />
                    ))}
                </div>
            </div>
        </MainBlock>
    );
};

const UpdateHistoryItem = <TUpdateHistory extends IDebtUpdateHistoryModel>
        ({model, index}: { model: TUpdateHistory, index: number }) => {
    // Dependencies.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const columnClassName = "col col-md-6 col-12 d-flex flex-column";
    const avatarStyle: React.CSSProperties = {
        width: 35,
        height: 35
    };

    const isStatsDateTimeVisible = (): boolean => {
        return model.oldStatsDateTime != model.oldStatsDateTime;
    };
    
    const isAmountVisible = (): boolean => {
        return model.oldAmount != model.newAmount;
    };
    
    const isNoteVisible = (): boolean => {
        return model.oldNote != model.newNote;
    };

    return (
        <>
            <h2 className="accordion-header">
                <button className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#flush-collapse${index}`}
                        aria-expanded="false"
                        aria-controls={`#flush-collapse${index}`}>
                    {model.updatedReason ? (
                        <span>{model.updatedReason}</span>
                    ) : (
                        <span className="opacity-50">
                            Không có lý do chỉnh sửa
                        </span>
                    )}
                </button>
            </h2>
            <div id={`flush-collapse${index}`}
                    className="accordion-collapse collapse"
                    data-bs-parent="#updateHistory">
                <div className="accordion-body p-2">
                    {/* UpdatedDateTime and Updater */}
                    <div className="row g-3">
                        {/* UpdatedDateTime */}
                        <div className={columnClassName}>
                            <Label text="Thời gian chỉnh sửa" />
                            <span className="text-primary">
                                {model.updatedDateTime.toString()}
                            </span>
                        </div>

                        {/* UpdatedUser */}
                        <div className={columnClassName}>
                            <Label text="Nhân viên chỉnh sửa" />
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
                    {isStatsDateTimeVisible() && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <Label text="Thời gian thống kê (cũ)" />
                                <span className="text-primary">
                                    {model.oldStatsDateTime.dateTime}
                                </span>
                            </div>

                            <div className={columnClassName}>
                                <Label text="Thời gian thống kê (mới)" />
                                <span className="text-primary">
                                    {model.newStatsDateTime.dateTime}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Amount */}
                    {isAmountVisible() && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <Label text="Giá tiền (cũ)" />
                                <span className="text-primary">
                                    {amountUtility.getDisplayText(model.oldAmount)}
                                </span>
                            </div>

                            <div className={columnClassName}>
                                <Label text="Giá tiền (mới)" />
                                <span className="text-primary">
                                    {amountUtility.getDisplayText(model.newAmount)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Note */}
                    {isNoteVisible() && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <Label text="Ghi chú (cũ)" />
                                {model.oldNote
                                    ? <span className="text-primary">{model.oldNote}</span>
                                    : <span className="text-primary opacity-50">Để trống</span>
                                }
                            </div>

                            <div className={columnClassName}>
                                <Label text="Ghi chú (mới)" />
                                {model.newNote
                                    ? <span className="text-primary">{model.newNote}</span>
                                    : <span className="text-primary opacity-50">Để trống</span>
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UpdateHistoriesList;