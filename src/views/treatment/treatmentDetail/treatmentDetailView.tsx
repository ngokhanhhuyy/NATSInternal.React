import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTreatmentService } from "@/services/treatmentService";
import { TreatmentDetailModel } from "@/models/treatment/treatmentDetailModel";
import { useAmountUtility } from "@/utilities/amountUtility";

// Shared component.
import ExportProductDetailView from
    "@/views/shared/exportProduct/exportProductDetail/ExportProductDetailView";

// Component.
const TreatmentDetailView = ({ id }: { id: number }) => {
    // Dependency.
    const service = useMemo(useTreatmentService, []);
    const amountUtility = useMemo(useAmountUtility, []);

    // Callbacks.
    const initialLoadAsync = async () => {
        const responseDto = await service.getDetailAsync(id);
        return new TreatmentDetailModel(responseDto);
    };

    // Middle.
    const renderMiddle = (model: TreatmentDetailModel) => (
        <>
            {/* ServiceAmount */}
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <span className="fw-bold">Số tiền dịch vụ trước thuế</span>
                </div>
                <div className="col text-primary">
                    <span>
                        {amountUtility.getDisplayText(model.serviceAmountBeforeVat)}
                    </span>
                </div>
            </div>

            {/* ServiceVatAmount */}
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <span className="fw-bold">Thuế dịch vụ</span>
                </div>
                <div className="col text-primary">
                    <span>
                        {amountUtility.getDisplayText(model.serviceVatAmount)}
                    </span>
                </div>
            </div>
        </>
    );

    // Bottom.
    const renderBottom = (
            model: TreatmentDetailModel,
            avatarStyle: React.CSSProperties) => {
        if (!model.therapist) {
            return null;
        }

        return (
            <div className="row gx-3 mt-3">
                <div className="col col-12">
                    <span className="fw-bold">Người đảm nhiệm</span>
                </div>
                <div className="col d-flex justify-content-start align-items-center">
                    <img src={model.therapist.avatarUrl}
                            style={avatarStyle}
                            className="img-thumbnail rounded-circle avatar me-2" />
                    <Link to={model.therapist.detailRoute} className="therapist-fullname">
                        {model.therapist.fullName}
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <ExportProductDetailView
            resourceType="treatment"
            initialLoadAsync={initialLoadAsync}
            renderMiddle={renderMiddle}
            renderBottom={renderBottom}>
        </ExportProductDetailView>
    );
};

export default TreatmentDetailView;