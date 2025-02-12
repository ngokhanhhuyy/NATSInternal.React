import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useViewStates } from "@/hooks/viewStatesHook";
import { type DebtIncurrenceDetailModel }
    from "@/models/debtIncurrence/debtIncurrenceDetailModel";
import { type DebtPaymentDetailModel }
    from "@/models/debtPayment/debtPaymentDetailModel";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useAmountUtility } from "@/utilities/amountUtility";
import { NotFoundError } from "@/errors";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainBlock from "@/views/layouts/MainBlockComponent";

// Child component.
import UpdateHistories from "./UpdateHistoriesListComponent";

// Type.
type DebtDetailModel = DebtIncurrenceDetailModel | DebtPaymentDetailModel;

// Props.
interface Props<TDetailModel extends DebtDetailModel> {
    displayName: (displayNameGetter: (key: string) => string) => string;
    initializeModelAsync: () => Promise<TDetailModel>;
}

// Component.
const DebtDetailView = <TDetailModel extends DebtDetailModel>(props: Props<TDetailModel>) => {
    // Dependencies.
    const amountUtility = useMemo(useAmountUtility, []);
    const getDisplayName = useInitialDataStore(store => store.getDisplayName);
    const getNotFoundConfirmationAsync = useAlertModalStore(store => {
        return store.getNotFoundConfirmationAsync;
    });

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [model, setModel] = useState<TDetailModel>();

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                setModel(await props.initializeModelAsync());
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await getNotFoundConfirmationAsync();
                    return;
                }

                throw error;
            }
        };

        loadAsync().finally(onInitialLoadingFinished);
    }, []);

    if (!model) {
        return null;
    }
    
    // Computed.
    const labelColumnClassName = "col col-12";
    const avatarStyle: React.CSSProperties = {
        width: 35,
        height: 35
    };

    const computeIdClassName = () => {
        const color = model.isLocked ? "danger" : "primary";
        return `bg-${color}-subtle border border-${color}-subtle ` +
                `rounded px-2 py-1 text-${color} small fw-bold`;
    };

    const computeIsClosedClassName = () => model.isLocked ? "text-danger" : "text-primary";
    const computeIsClosedText = () => model.isLocked ? "Đã khoá" : "Chưa khoá";

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3">
                <div className="col col-12">
                    <MainBlock
                        title={`Chi tiết ${props.displayName(getDisplayName)}`}
                        closeButton
                        bodyPadding={2}
                    >
                        {/* Id */}
                        <div className="row gx-3 mb-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Mã số</span>
                            </div>
                            <div className="col text-primary">
                                <span className={computeIdClassName()}>
                                    #{model.id}
                                </span>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="row gx-3 mb-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Số tiền</span>
                            </div>
                            <div className="col text-primary">
                                <span>
                                    {amountUtility.getDisplayText(model.amount)}
                                </span>
                            </div>
                        </div>

                        {/* CreatedDateTime */}
                        <div className="row gx-3 mb-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Ngày giờ tạo</span>
                            </div>
                            <div className="col text-primary">
                                <span>{model.createdDateTime.dateTime}</span>&nbsp;
                                <span className="opacity-50">
                                    ({model.createdDateTime.deltaText})
                                </span>
                            </div>
                        </div>

                        {/* StatsDateTime */}
                        <div className="row gx-3 mb-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Ngày giờ thống kê</span>
                            </div>
                            <div className="col text-primary">
                                <span>{model.statsDateTime.dateTime}</span>&nbsp;
                                <span className="opacity-50">
                                    ({model.statsDateTime.deltaText})
                                </span>
                            </div>
                        </div>

                        {/* Note */}
                        {model.note && (
                            <div className="row gx-3 mb-3">
                                <div className={labelColumnClassName}>
                                    <span className="fw-bold">Ghi chú</span>
                                </div>
                                <div className="col text-primary">
                                    <span>{model.note}</span>
                                </div>
                            </div>
                        )}

                        {/* IsClosed */}
                        <div className="row gx-3 mb-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Tình trạng</span>
                            </div>
                            <div className="col text-primary">
                                <span className={computeIsClosedClassName()}>
                                    {computeIsClosedText()}
                                </span>
                            </div>
                        </div>
                        
                        {/* CreatedUser */}
                        <div className="row gx-3">
                            <div className={labelColumnClassName}>
                                <span className="fw-bold">Người tạo</span>
                            </div>
                            <div className="col d-flex justify-content-start align-items-center">
                                <img
                                    src={model.createdUser.avatarUrl}
                                    className="img-thumbnail rounded-circle avatar me-2"
                                    style={avatarStyle}
                                />
                                <Link to={model.createdUser.detailRoute}>
                                    {model.createdUser.fullName}
                                </Link>
                            </div>
                        </div>
                    </MainBlock>
                </div>

                {/* Update histories */}
                {model.updateHistories && model.updateHistories.length > 0 && (
                    <div className="col col-12">
                        <UpdateHistories model={model.updateHistories} />
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="row g-3 justify-content-end">
                {/* Edit button */}
                <div className="col col-auto">
                    {model.authorization.canEdit && (
                        <Link to={model.updateRoute} className="btn btn-primary">
                            <i className="bi bi-pencil-square me-2" />
                            <span>Sửa</span>
                        </Link>
                    )}
                </div>
            </div>
        </MainContainer>
    );
};

export default DebtDetailView;