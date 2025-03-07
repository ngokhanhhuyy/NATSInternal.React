import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ConsultantDetailModel } from "@/models/consultant/consultantDetailModel";
import { useConsultantService } from "@/services/consultantService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form component.
import Label from "@/views/form/LabelComponent";

// Child component.
import UpdateHistories from "./UpdateHistoriesComponent";

// Component.
const ConsultantDetailView = ({ id }: { id: number }) => {
    // Dependencies.
    const service = useConsultantService();
    const amountUtility = useMemo(useAmountUtility, []);
    
    // Model and states.
    useViewStates();
    const model = useAsyncModelInitializer({
        initializer: async () => {
            const responseDto = await service.getDetailAsync(id);
            return new ConsultantDetailModel(responseDto);
        },
        cacheKey: "consultantDetail"
    });

    // Computed.
    const labelColumnClassName = useMemo(() => "col col-12", []);
    const idClass = useMemo<string | undefined>(() => {
        const color = model?.isLocked ? "danger" : "primary";
        return `bg-${color}-subtle border border-${color}-subtle \
                rounded px-2 py-1 text-${color} small fw-bold`;
    }, [model]);

    const isClosedClass = useMemo<string>(() => {
        return model?.isLocked ? "text-danger" : "text-primary";
    }, [model?.isLocked]);

    const isClosedText = useMemo<string>(() => {
        return model?.isLocked ? "Đã khoá" : "Chưa khoá";
    }, [model?.isLocked]);

    if (!model) {
        return null;
    }

    return (
        <MainContainer>
            <div className="row g-3 justify-content-center">
                {/* Consultant detail */}
                <div className="col col-12">
                    <MainBlock title="Chi tiết tư vấn" bodyPadding={[0, 2, 2, 2]} closeButton>
                        {/* Id */}
                        <div className="row gx-3 mt-2">
                            <div className={labelColumnClassName}>
                                <Label text="Mã số" />
                            </div>
                            <div className="col text-primary">
                                <span className={idClass}>
                                    #{model.id}
                                </span>
                            </div>
                        </div>

                        {/* AmountBeforeVat */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <Label text="Số tiền trước thuế" />
                            </div>
                            <div className="col text-primary">
                                <span>
                                    {amountUtility.getDisplayText(model.amountBeforeVat)}
                                </span>
                            </div>
                        </div>

                        {/* AmountBeforeVat */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <Label text="Thuế VAT" />
                            </div>
                            <div className="col text-primary">
                                <span>
                                    {amountUtility.getDisplayText(model.vatAmount)}
                                </span>
                            </div>
                        </div>

                        {/* CreatedDateTime */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <Label text="Được tạo lúc" />
                            </div>
                            <div className="col text-primary">
                                <span>{model.createdDateTime.dateTime}</span>
                            </div>
                        </div>

                        {/* StatsDateTime */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <Label text="Thanh toán lúc" />
                            </div>
                            <div className="col text-primary">
                                <span>{model.statsDateTime.dateTime}</span>
                            </div>
                        </div>

                        {/* Note */}
                        {model.note && (
                            <div className="row gx-3 mt-3">
                                <div className={labelColumnClassName}>
                                    <Label text="Ghi chú" />
                                </div>
                                <div className="col text-primary">
                                    <span>{model.note}</span>
                                </div>
                            </div>
                        )}

                        {/* IsLocked */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <Label text="Tình trạng" />
                            </div>
                            <div className="col text-primary">
                                <span className={isClosedClass}>{isClosedText}</span>
                            </div>
                        </div>
                        
                        {/* Customer */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <Label text="Khách hàng" />
                            </div>
                            <div className="col text-primary">
                                <Link to={model.customer.detailRoute}
                                        className="customer-fullname">
                                    {model.customer.fullName}
                                </Link>
                            </div>
                        </div>
                    </MainBlock>
                </div>

                {/* Created user and datetime */}
                <div className="col col-12">
                    <MainBlock title="Ngày giờ, nhân viên tạo" bodyPadding={[0, 2, 2, 2]}>
                        {/* User */}
                        <div className="row gx-3 mt-2">
                            <div className={labelColumnClassName}>
                                <Label text="Nhân viên tạo" />
                            </div>
                            <div className="col text-primary">
                                <Link to={model.createdUser.detailRoute}
                                        className="user-username">
                                    {model.createdUser.userName}
                                </Link>
                            </div>
                        </div>

                        {/* CreatedDateTime */}
                        <div className="row gx-3 mt-3">
                            <div className={labelColumnClassName}>
                                <Label text="Được tạo lúc" />
                            </div>
                            <div className="col text-primary">
                                <span>{model.createdDateTime.dateTime}</span>
                            </div>
                        </div>

                        {/* LastUpdatedDateTime */}
                        {model.lastUpdatedDateTime && (
                            <div className="row gx-3 mt-3">
                                <div className={labelColumnClassName}>
                                    <Label text="Cập nhật lúc" />
                                </div>
                                <div className="col text-primary">
                                    <span>{model.lastUpdatedDateTime.dateTime}</span>
                                </div>
                            </div>
                        )}
                    </MainBlock>
                </div>

                {/* Consultant update histories */}
                {model.updateHistories && model.updateHistories.length > 0 && (
                    <div className="col col-12">
                        <UpdateHistories model={model.updateHistories} />
                    </div>
                )}
            </div>

            {/* Action buttons */}
            {model.authorization.canEdit && (
                <div className="row g-3 justify-content-end">
                    {/* Edit button */}
                    <div className="col col-auto">
                        <Link to={model.updateRoute} className="btn btn-primary">
                            <i className="bi bi-pencil-square me-2"></i>
                            <span>Sửa</span>
                        </Link>
                    </div>
                </div>
            )}
        </MainContainer>
    );
};

export default ConsultantDetailView;