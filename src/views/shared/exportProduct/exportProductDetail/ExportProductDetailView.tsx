import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAmountUtility } from "@/utilities/amountUtility";
import { NotFoundError } from "@/errors";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainBlock from "@/views/layouts/MainBlockComponent";

// Child components.
import ItemList from "./ItemListComponent";
import UpdateHistoryList from "./UpdateHistoryListComponent";

// Props.
interface Props<
        TDetail extends IExportProductDetailModel<
            TDetailItem,
            TUpdateHistory,
            TItemUpdateHistory,
            TAuthorization>,
        TDetailItem extends IExportProductDetailItemModel,
        TUpdateHistory extends IExportProductUpdateHistoryModel<TItemUpdateHistory>,
        TItemUpdateHistory extends IExportProductItemUpdateHistoryModel,
        TAuthorization extends IHasStatsExistingAuthorizationModel> {
    resourceType: string;
    renderMiddle?: (model: TDetail) => React.ReactNode;
    renderBottom?: (model: TDetail) => React.ReactNode;
    initialLoadAsync: () => Promise<TDetail>;
}

// Component.
const ExportProductDetailView = <
        TDetail extends IExportProductDetailModel<
            TDetailItem,
            TUpdateHistory,
            TItemUpdateHistory,
            TAuthorization>,
        TDetailItem extends IExportProductDetailItemModel,
        TUpdateHistory extends IExportProductUpdateHistoryModel<TItemUpdateHistory>,
        TItemUpdateHistory extends IExportProductItemUpdateHistoryModel,
        TAuthorization extends IHasStatsExistingAuthorizationModel>
    (props: Props<TDetail, TDetailItem, TUpdateHistory, TItemUpdateHistory, TAuthorization>) =>
{
    // Dependencies.
    const navigate = useNavigate();
    const getNotFoundConfirmationAsync = useAlertModalStore(store => {
        return store.getNotFoundConfirmationAsync;
    });
    const getDisplayName = useInitialDataStore(store => store.getDisplayName);
    const amountUtility = useMemo(useAmountUtility, []);
    
    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [model, setModel] = useState<TDetail>();

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                setModel(await props.initialLoadAsync());
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await getNotFoundConfirmationAsync();
                    await navigate(-1);
                    return;
                }

                throw error;
            }
        };

        loadAsync().finally(onInitialLoadingFinished);
    }, []);
    
    // Computed.
    const computeResourceDisplayName = (): string => getDisplayName(props.resourceType);

    const computeIdClassName = (): string => {
        const color = model?.isLocked ? "danger" : "primary";
        return `bg-${color}-subtle border border-${color}-subtle \
                rounded px-2 py-1 text-${color} small fw-bold`;
    };
    
    const computeIsLockedClassName = (): string => {
        return model?.isLocked ? "text-danger" : "text-primary";
    };
    
    const computeIsLockedText = (): string => {
        return model?.isLocked ? "Đã khoá" : "Chưa khoá";
    };

    const computeCreatedUserAvatarStyle = (): React.CSSProperties => ({
        objectFit: "contain",
        objectPosition: "50% 50%",
        width: 35,
        height: 35,
    });

    if (!model) {
        return null;
    }

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3 align-items-stretch">
                {/* ResourceAccess */}
                {/* <div className="col col-12">
                    <ResourceAccess :resource-type="props.resourceType"
                            :resource-primary-id="model.id" accessMode="Detail" />
                </div> */}
    
                {/* Detail */}
                <div className="col col-lg-6 col-12">
                    <MainBlock
                        title={`Chi tiết ${computeResourceDisplayName()}`}
                        closeButton
                        bodyPadding={[0, 2, 2, 2]}
                    >
                        {/* Id */}
                        <div className="row gx-3 mt-2">
                            <div className="col col-12">
                                <span className="fw-bold">Mã số</span>
                            </div>
                            <div className="col text-primary">
                                <span className={computeIdClassName()}>
                                    #{model.id}
                                </span>
                            </div>
                        </div>

                        {/* CreatedDate */}
                        <div className="row gx-3 mt-3">
                            <div className="col col-12">
                                <span className="fw-bold">Ngày tạo</span>
                            </div>
                            <div className="col text-primary">
                                <span>
                                    {model.createdDateTime.date}
                                </span>
                            </div>
                        </div>

                        {/* CreatedTime */}
                        <div className="row gx-3 mt-3">
                            <div className="col col-12">
                                <span className="fw-bold">Giờ tạo</span>
                            </div>
                            <div className="col text-primary">
                                <span>
                                    {model.createdDateTime.time}
                                </span>
                            </div>
                        </div>

                        {/* StatsDate */}
                        <div className="row gx-3 mt-3">
                            <div className="col col-12">
                                <span className="fw-bold">Ngày thống kê</span>
                            </div>
                            <div className="col text-primary">
                                <span>
                                    {model.statsDateTime.date}
                                </span>
                            </div>
                        </div>

                        {/* StatsTime */}
                        <div className="row gx-3 mt-3">
                            <div className="col col-12">
                                <span className="fw-bold">Giờ thống kê</span>
                            </div>
                            <div className="col text-primary">
                                <span>
                                    {model.statsDateTime.time}
                                </span>
                            </div>
                        </div>

                        {props.renderMiddle?.(model)}

                        {/* BeforeVatAmount */}
                        <div className="row gx-3 mt-3">
                            <div className="col col-12">
                                <span className="fw-bold">Tổng giá tiền trước thuế</span>
                            </div>
                            <div className="col text-primary">
                                <span>
                                    {amountUtility.getDisplayText(model.amountBeforeVat)}
                                </span>
                            </div>
                        </div>

                        {/* VatAmount */}
                        <div className="row gx-3 mt-3">
                            <div className="col col-12">
                                <span className="fw-bold">Tổng thuế</span>
                            </div>
                            <div className="col text-primary">
                                <span>
                                    {amountUtility.getDisplayText(model.vatAmount)}
                                </span>
                            </div>
                        </div>

                        {/* VatAmount */}
                        <div className="row gx-3 mt-3">
                            <div className="col col-12">
                                <span className="fw-bold">Tổng giá tiền sau thuế</span>
                            </div>
                            <div className="col text-primary">
                                <span>
                                    {amountUtility.getDisplayText(model.amountAfterVat)}
                                </span>
                            </div>
                        </div>

                        {/* Note */}
                        {model.note && (
                            <div className="row gx-3 mt-3">
                                <div className="col col-12">
                                    <span className="fw-bold">Ghi chú</span>
                                </div>
                                <div className="col text-primary">
                                    <span>
                                        {model.note}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* IsLocked */}
                        <div className="row gx-3 mt-3">
                            <div className="col col-12">
                                <span className="fw-bold">Tình trạng</span>
                            </div>
                            <div className="col text-primary">
                                <span className={computeIsLockedClassName()}>
                                    {computeIsLockedText()}
                                </span>
                            </div>
                        </div>
                        
                        {/* Customer */}
                        <div className="row gx-3 mt-3">
                            <div className="col col-12">
                                <span className="fw-bold">Khách hàng</span>
                            </div>
                            <div className="col d-flex justify-content-start
                                            align-items-center">
                                <img className="img-thumbnail rounded-circle me-2"
                                    style={computeCreatedUserAvatarStyle()}
                                    src={model.customer.avatarUrl}
                                />
                                <Link to={model.customer.detailRoute}
                                        className="customer-fullname">
                                    {model.customer.fullName}
                                </Link>
                            </div>
                        </div>
                        
                        {/* Therapist */}
                        {props.renderBottom?.(model)}
                        
                        {/* CreatedUser */}
                        <div className="row gx-3 mt-3">
                            <div className="col col-12">
                                <span className="fw-bold">Người tạo</span>
                            </div>
                            <div className="col d-flex justify-content-start
                                            align-items-center">
                                <img className="img-thumbnail rounded-circle me-2"
                                    style={computeCreatedUserAvatarStyle()}
                                    src={model.createdUser.avatarUrl}
                                />
                                <Link to={model.createdUser.detailRoute}
                                        className="user-fullname">
                                    {model.createdUser.fullName}
                                </Link>
                            </div>
                        </div>
                    </MainBlock>
                </div>
                
                {/* Order items */}
                <div className="col">
                    <ItemList model={model.items} />
                </div>
    
            </div>
    
            <div className="row g-3">
                {/* UpdateHistories */}
                {model.updateHistories && model.updateHistories.length > 0 && (
                    <div className="col col-12">
                        <UpdateHistoryList model={model.updateHistories} />
                    </div>
                )}
            </div>
            
            {/* Action buttons */}
            {model.authorization?.canEdit && (
                <div className="row g-3 justify-content-end">
                    <div className="col col-auto">
                        <Link to={model.updateRoute} className="btn btn-primary">
                            <i className="bi bi-pencil-square"></i>
                            <span className="ms-2">Sửa</span>
                        </Link>
                    </div>
                </div>
            )}
        </MainContainer>
    );
};

export default ExportProductDetailView;