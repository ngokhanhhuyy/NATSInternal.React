import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Component.
const UpdateHistoryList = <
            TUpdateHistory extends IExportProductUpdateHistoryModel<TItemUpdateHistory>,
            TItemUpdateHistory extends IExportProductItemUpdateHistoryModel>
        ({ model }: { model: TUpdateHistory[] }) =>
{

    return (
        <MainBlock title="Lịch sử chỉnh sửa" bodyPadding={0} className="h-100"
                bodyClassName="overflow-hidden">
            <div className="accordion accordion-flush" id="updateHistory">
                {model.map((updateHistory, index) => (
                    <UpdateHistory model={updateHistory} key={index} />
                ))}
            </div>
        </MainBlock>
    );
};

const UpdateHistory = <
        TUpdateHistory extends IExportProductUpdateHistoryModel<TItemUpdateHistory>,
        TItemUpdateHistory extends IExportProductItemUpdateHistoryModel>
    ({ model }: { model: TUpdateHistory }) =>
{
    // Dependencies.
    const amountUtility = useMemo(useAmountUtility, []);
    
    // Computed.
    const columnClassName = useMemo<string>(() => {
        return "col col-md-6 col-12 d-flex flex-column";
    }, []);
    
    const computeStatsDateTimeVisibility = (): boolean => {
        return model.oldStatsDateTime != model.newStatsDateTime;
    };
    
    const computeNoteVisibility = (): boolean => {
        return model.oldNote != model.newNote;
    };
    
    const computeItemsVisibility = (): boolean => {
        const oldItemsJson = JSON.stringify(model.oldItems);
        const newItemsJson = JSON.stringify(model.newItems);
        return oldItemsJson != newItemsJson;
    };

    const computeItemMainText = (item: IExportProductItemUpdateHistoryModel): string => {
        return `${item.productName} × ${item.quantity}`;
    };

    const computeItemSubText = (item: IExportProductItemUpdateHistoryModel): string => {
        const itemAmountText = amountUtility.getDisplayText(item.productAmountPerUnit);
        return `${itemAmountText} + ${item.vatAmountPerUnit}% VAT`;
    };

    return (
        <div className="accordion-item">
            <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne">
                    {model.updatedReason}
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
                            <span>{model.updatedDateTime.toString()}</span>
                        </div>

                        {/* UpdatedUser */}
                        <div className={`${columnClassName} mt-md-0 mt-3`}>
                            <span className="fw-bold">Nhân viên chỉnh sửa</span>
                            <Link to={model.updatedUser.detailRoute}>
                                {model.updatedUser.fullName}
                            </Link>
                        </div>
                    </div>

                    {/* Data Comparison */}
                    {/* StatsDateTime */}
                    {computeStatsDateTimeVisibility() && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <span className="fw-bold">Thời gian thanh toán (cũ)</span>
                                <span>{model.oldStatsDateTime.dateTime}</span>
                            </div>

                            <div className={`mt-md-0 mt-3 ${columnClassName}`}>
                                <span className="fw-bold">Thời gian thanh toán (mới)</span>
                                <span>{model.newStatsDateTime.dateTime}</span>
                            </div>
                        </div>
                    )}

                    {/* Note */}
                    {computeNoteVisibility() && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <span className="fw-bold">Ghi chú (cũ)</span>
                                {model.oldNote || <span className="opacity-50">Để trống</span>}
                            </div>

                            <div className={`${columnClassName} mt-md-0 mt-3`}>
                                <span className="fw-bold">Ghi chú (mới)</span>
                                {model.newNote || <span className="opacity-50">Để trống</span>}
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    {computeItemsVisibility() && (
                        <div className="row g-3">
                            <div className={columnClassName}>
                                <span className="fw-bold">Danh sách sản phẩm (cũ)</span>
                                <ol>
                                    {model.oldItems.map((item, index) => (
                                        <li key={index}>
                                            <span>{computeItemMainText(item)}</span><br/>
                                            <span className="small opacity-75">
                                                {computeItemSubText(item)}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className={`mt-md-0 mt-3 ${columnClassName}`}>
                                <span className="fw-bold">Danh sách sản phẩm (mới)</span>
                                <ol>
                                    {model.newItems.map((item, index) => (
                                        <li key={index}>
                                            <span>{computeItemMainText(item)}</span><br/>
                                            <span className="small opacity-75">
                                                {computeItemSubText(item)}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateHistoryList;