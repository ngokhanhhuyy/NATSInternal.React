import React, { useMemo } from "react";
import type { SupplyDetailModel } from "@/models/supply/supplyDetailModel";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Component.
const SupplyDetail = ({ model }: { model: SupplyDetailModel }) => {
    // Dependencies.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const computeIsLockedClassName = () => model?.isLocked ? "text-danger" : "text-success";

    return (
        <MainBlock title="Chi tiết nhập hàng" closeButton bodyPadding={2}>
            {/* StatsDateTime */}
            <div className="row gx-3">
                <div className="col col-12">
                    <span className="fw-bold">Ngày giờ thống kê</span>
                </div>
                <div className="col text-primary">
                    {model.statsDateTime.dateTime}
                </div>
            </div>

            {/* Shipment fee */}
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <span className="fw-bold">Phí vận chuyển</span>
                </div>
                <div className="col text-primary">
                    {amountUtility.getDisplayText(model.shipmentFee)}
                </div>
            </div>

            {/* Total amount */}
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <span className="fw-bold">Tổng giá tiền</span>
                </div>
                <div className="col text-primary">
                    {amountUtility.getDisplayText(model.amount)}
                </div>
            </div>

            {/* CreatedDateTime */}
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <span className="fw-bold">Tạo lúc</span>
                </div>
                <div className="col text-primary">
                    {model.createdDateTime.dateTime}
                </div>
            </div>

            {/* StatsDateTime */}
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <span className="fw-bold">Thời gian thống kê</span>
                </div>
                <div className="col text-primary">
                    {model.statsDateTime.dateTime}
                </div>
            </div>

            {/* LastUpdatedDateTime */}
            {model.lastUpdatedDateTime && (
                <div className="row gx-3 mt-3">
                    <div className="col col-12">
                        <span className="fw-bold">Chỉnh sửa lần cuối lúc</span>
                    </div>
                    <div className="col text-primary">
                        {model.lastUpdatedDateTime.dateTime}
                    </div>
                </div>
            )}

            {/* Note */}
            {model.note && (
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <span className="fw-bold">Ghi chú</span>
                </div>
                <div className="col text-primary">
                    {model.note}
                </div>
            </div>
            )}

            {/* IsClosed */}
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <span className="fw-bold">Tình trạng</span>
                </div>
                <div className={`col ${computeIsLockedClassName()}`}>
                    {model && (model.isLocked ? "Đã khoá" : "Chưa khoá")}
                </div>
            </div>

            {/* Photos */}
            {model && model.photos.length > 0 && (
                <div className="row gx-3 mt-3 justify-content-center">
                    <div className="col col-12 mb-2">
                        <span className="fw-bold">Hình ảnh</span>
                    </div>
                    {Array.from(Array(10).keys()).map(index => (
                        <div className="col col-auto mb-2" key={index}>
                            <img src={model.items[0].product.thumbnailUrl}
                                className="img-thumbnail supply-photo"
                            />
                        </div>
                    ))}
                </div>
            )}
        </MainBlock>
    );
};

export default SupplyDetail;