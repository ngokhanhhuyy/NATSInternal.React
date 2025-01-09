import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SupplyDetailModel } from "@/models/supply/supplyDetailModel";
import { useSupplyService } from "@/services/supplyService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAmountUtility } from "@/utilities/amountUtility";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { NotFoundError } from "@/errors";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainBlock from "@/views/layouts/MainBlockComponent";

// Child component
import Item from "./ItemComponent";

// Component.
const SupplyDetailView = ({ id }: { id: number }) => {
    // Dependencies.
    const navigate = useNavigate();
    const alertModalStore = useAlertModalStore();
    const service = useMemo(useSupplyService, []);
    const amountUtility = useMemo(useAmountUtility, []);
    
    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [model, setModel] = useState<SupplyDetailModel>();
    
    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                const responseDto = await service.getDetailAsync(id);
                setModel(new SupplyDetailModel(responseDto));
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await alertModalStore.getNotFoundConfirmationAsync();
                    await navigate(-1);
                    return;
                }

                throw error;
            }
        };

        loadAsync().finally(() => onInitialLoadingFinished());
    }, []);

    // Computed.
    const computeIsLockedClassName = () => model?.isLocked ? "text-danger" : "text-success";

    if (!model) {
        return null;
    }

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3 justify-content-center">
                {/* Supply detail */}
                <div className="col col-xl-6 col-12">
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

                        {/* UpdatedDateTime */}
                        {model.lastUpdatedDateTime && (
                            <div className="row gx-3 mt-3">
                                <div className="col col-12">
                                    <span className="fw-bold">Chỉnh sửa lúc</span>
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
                </div>
    
                {/* Supply items */}
                <div className="col">
                    {/* Filter */}
                    <MainBlock title="Danh sách sản phẩm" className="h-100"
                            bodyClassName="overflow-hidden" bodyPadding={0}>
                        <ul className="list-group list-group-flush">
                            {/* Items */}
                            {model.items.map(item => <Item model={item} key={item.id} />)}
                        </ul>
                    </MainBlock>
                </div>
    
                {/* Edit button */}
                <div className="col col-12 d-flex justify-content-end">
                    {model.authorization.canEdit && (
                        <Link className="btn btn-primary" to={model.updateRoute}
                                v-if="model.authorization.canEdit">
                            <i className="bi bi-pencil-square me-2"></i>
                            <span>Sửa</span>
                        </Link>
                    )}
                </div>
            </div>
        </MainContainer>
    );
};

export default SupplyDetailView;