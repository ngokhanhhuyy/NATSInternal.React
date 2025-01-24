import React, { useMemo } from "react";
import { TreatmentUpsertModel } from "@/models/treatment/treatmentUpsertModel";
import { TreatmentUpsertItemModel }
    from "@/models/treatment/treatmentItem/treatmentUpsertItemModel";
import { useTreatmentService } from "@/services/treatmentService";
import { useAmountUtility } from "@/utilities/amountUtility";
import { AuthorizationError } from "@/errors";

// Form components.
import Label from "@/views/form/LabelComponent";
import MoneyInput from "@/views/form/MoneyInputComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Shared component.
import ExportProductUpsertView
    from "@/views/shared/exportProduct/exportProductUpsert/ExportProductUpsertView";

// Component.
const TreatmentUpsertView = ({ id }: { id?: number }) => {
    // Dependencies.
    const service = useMemo(useTreatmentService, []);
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const getProductAmountClassName = (model: TreatmentUpsertModel): string | null => {
        return model.productAmountBeforeVat ? null : "text-danger";
    };

    const getServiceAmountClassName = (model: TreatmentUpsertModel): string | null => {
        return model.serviceAmountBeforeVat ? null : "text-danger";
    };

    // Callbacks.
    const initialLoadAsync = async (
            model: TreatmentUpsertModel,
            initialData: ResponseDtos.InitialData) =>
    {
        if (id == null) {
            const authorization = initialData.treatment.creatingAuthorization;
            if (!authorization) {
                throw new AuthorizationError();
            }

            return model.fromCreatingAuthorizationResponseDto(authorization);
        } else {
            const responseDto = await service.getDetailAsync(id);
            return model.fromDetailResponseDto(responseDto);
        }
    };

    const handleSubmissionAsync = async (model: TreatmentUpsertModel) => {
        if (id == null) {
            return await service.createAsync(model.toRequestDto());
        }

        await service.updateAsync(id, model.toRequestDto());
        return id;
    };

    const handleDeletionAsync = async () => {
        if (id != null) {
            await service.deleteAsync(id);
        }
    };

    const renderForm = (
            model: TreatmentUpsertModel,
            setModel: React.Dispatch<React.SetStateAction<TreatmentUpsertModel>>) => (
        <>
            {/* ServiceAmountBeforeVat */}
            <div className="col col-12">
                <Label text="Giá tiền dịch vụ" />
                <MoneyInput name="serviceAmountBeforeVat"
                    min={0}
                    suffix=" vnđ"
                    value={model.serviceAmountBeforeVat}
                    onValueChanged={(serviceAmountBeforeVat) => {
                        setModel(model => model.from({ serviceAmountBeforeVat }));
                    }}
                />
                <ValidationMessage name="serviceAmountBeforeVat" />
            </div>

            {/* ServiceVatAmount */}
            <div className="col col-12">
                <Label text="Thuế dịch vụ" />
                <MoneyInput name="serviceVatAmount"
                    value={model.serviceVatPercentage}
                    onValueChanged={(serviceVatPercentage) => {
                        setModel(model => model.from({ serviceVatPercentage }));
                    }}
                    v-model="model.serviceVatPercentage"
                    suffix="%" min={0} max={100}
                />
                <ValidationMessage name="serviceVatAmount" />
            </div>
        </>
    );

    const renderSummary = (model: TreatmentUpsertModel, labelColumnClassName: string) => (
        <>
            {/* ProductAmountAfterVat */}
            <div className="row gx-3 gy-0 mt-3">
                <div className={labelColumnClassName}>
                    <Label text="Giá sản phẩm" />
                </div>
                <div className={`col ${getProductAmountClassName(model)}`}>
                    <span>
                        {amountUtility.getDisplayText(model.productAmountAfterVat)}
                    </span>
                    &nbsp;
                    <span className="opacity-50 small">
                        ({amountUtility.getDisplayText(model.productAmountBeforeVat)} +&nbsp;
                        {amountUtility.getDisplayText(model.productVatAmount)} VAT)
                    </span>
                </div>
            </div>

            {/* ServiceAmount */}
            <div className="row gx-3 gy-0 mt-3">
                <div className={labelColumnClassName}>
                    <Label text="Giá dịch vụ" />
                </div>
                <div className={`col ${getServiceAmountClassName(model)}`}>
                    <span>
                        {amountUtility.getDisplayText(model.serviceAmountAfterVat)}
                    </span>
                    &nbsp;
                    <span className="opacity-50 small">
                        ({amountUtility.getDisplayText(model.serviceAmountBeforeVat)} +&nbsp;
                        {amountUtility.getDisplayText(model.serviceVatAmount)} VAT)
                    </span>
                </div>
            </div>
        </>
    );

    return (
        <ExportProductUpsertView
            resourceType="treatment"
            isForCreating={id == null}
            initializeModel={() => new TreatmentUpsertModel()}
            initialLoadAsync={initialLoadAsync}
            initializeItemModel={(product) => new TreatmentUpsertItemModel(product)}
            submitAsync={handleSubmissionAsync}
            deleteAsync={handleDeletionAsync}
            getListRoute={(routeGenerator) => routeGenerator.getTreatmentListRoutePath()}
            getDetailRoute={(routeGenerator, id) => {
                return routeGenerator.getTreatmentDetailRoutePath(id);
            }}
            renderForm={renderForm}
            renderSummary={renderSummary}
        />
    );
};

export default TreatmentUpsertView;