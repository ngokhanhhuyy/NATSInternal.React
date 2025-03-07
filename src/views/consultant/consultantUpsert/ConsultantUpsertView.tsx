import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useConsultantService } from "@/services/consultantService";
import { useCustomerService } from "@/services/customerService";
import { ConsultantUpsertModel } from "@/models/consultant/consultantUpsertModel";
import { CustomerListModel } from "@/models/customer/customerListModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { AuthorizationError } from "@/errors";

// Layout components.
import UpsertViewContainer from "@/views/layouts/UpsertViewContainerComponent";
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import TextAreaInput from "@/views/form/TextAreaInputComponent";
import MoneyInput from "@/views/form/MoneyInputComponent";
import StatsDateTimeInput from "@/views/form/StatsDateTimeInputComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";
import SubmitButton from "@/views/form/SubmitButtonComponent";
import DeleteButton from "@/views/form/DeleteButtonComponent";

// Child component.
import CustomerPicker, { requestDtoForInitialModel as requestDtoForProductList }
    from "@/views/shared/customerPicker/CustomerPickerComponent";

// Component.
const ConsultantUpsertView = ({ id }: { id?: number }) => {
    // Dependencies.
    const navigate = useNavigate();
    const initialData = useInitialDataStore(store => store.data);
    const consultantService = useConsultantService();
    const customerService = useCustomerService();
    const routeGenerator = useRouteGenerator();

    // Model and states.
    const { isInitialRendering, modelState } = useUpsertViewStates();
    const initialModels = useAsyncModelInitializer({
        initializer: async () => {
            const customerListPromise = customerService.getListAsync(requestDtoForProductList);
            let consultantUpsertModel: ConsultantUpsertModel;
            if (id == null) {
                const authorization = await consultantService.getCreatingAuthorizationAsync();
                const canSetStatsDateTime = authorization?.canSetStatsDateTime;
                if (!canSetStatsDateTime) {
                    throw new AuthorizationError();
                }

                consultantUpsertModel = new ConsultantUpsertModel(canSetStatsDateTime);
            } else {
                const responseDto = await consultantService.getDetailAsync(id);

                if (!responseDto.authorization.canEdit) {
                    throw new AuthorizationError();
                }
                
                consultantUpsertModel = new ConsultantUpsertModel(responseDto);
            }

            const customerList = await customerListPromise;
            return {
                consultantUpsert: consultantUpsertModel,
                customerList: new CustomerListModel(customerList, initialData.customer)
            };
        },
        cacheKey: id == null ? "consultantCreate" : "consultantUpdate"
    });
    const [model, setModel] = useState(() => initialModels.consultantUpsert);
    const isModelDirty = useDirtyModelChecker(
        initialModels.consultantUpsert,
        model,
        ["updatedReason"]);

    // Computed.
    const blockTitle = useMemo<string>(() => {
        if (id == null) {
            return "Tạo tư vấn mới";
        }
    
        return "Chỉnh sửa tư vấn";
    }, [id]);

    // Callback.
    const handleSubmissionAsync = async (): Promise<number> => {
        if (id == null) {
            return await consultantService.createAsync(model.toRequestDto());
        } else {
            await consultantService.updateAsync(model.id, model.toRequestDto());
            return model.id;
        }
    };

    const handleDeletionAsync = useCallback(async (): Promise<void> => {
        await consultantService.deleteAsync(model.id);
    }, [model.id]);

    const handleSucceededSubmissionAsync = async (submissionResult: number): Promise<void> => {
        await navigate(routeGenerator.getConsultantDetailRoutePath(submissionResult));
    };

    const handleSucceededDeletionAsync = useCallback(async (): Promise<void> => {
        await navigate(routeGenerator.getConsultantListRoutePath());
    }, []);

    return (
        <UpsertViewContainer
            modelState={modelState}
            submittingAction={handleSubmissionAsync}
            onSubmissionSucceeded={handleSucceededSubmissionAsync}
            deletingAction={handleDeletionAsync}
            onDeletionSucceeded={handleSucceededDeletionAsync}
            isModelDirty={isModelDirty}
        >
            <div className="row g-3">
                <div className="col col-12">
                    <MainBlock title={blockTitle} closeButton bodyPadding={[0, 2, 2, 2]}>
                        <div className="row g-3">
                            {/* StatsDateTime */}
                            <div className="col col-md-6 col-12">
                                <Label text="Ngày thanh toán" />
                                <StatsDateTimeInput
                                    name="statsDateTime"
                                    disabled={!model.canSetStatsDateTime}
                                    value={model.statsDateTime}
                                    onValueChanged={statsDateTime => {
                                        setModel(model => model.from({ statsDateTime }));
                                    }}
                                />
                                <ValidationMessage name="statsDateTime" />
                            </div>

                            {/* Amount */}
                            <div className="col col-md-6 col-12">
                                <Label text="Số tiền thanh toán" required />
                                <MoneyInput
                                    name="amount"
                                    suffix=" đồng"
                                    value={model.amountBeforeVat}
                                    onValueChanged={amountBeforeVat => {
                                        setModel(model => model.from({ amountBeforeVat }));
                                    }}
                                />
                                <ValidationMessage name="amount" />
                            </div>

                            {/* Note */}
                            <div className="col col-12">
                                <Label text="Ghi chú" />
                                <TextAreaInput
                                    name="note"
                                    maxLength={255}
                                    style={{ minHeight: "150px" }}
                                    placeholder="Ghi chú ..."
                                    value={model.note}
                                    onValueChanged={note => {
                                        setModel(model => model.from({ note }));
                                    }}
                                />
                                <ValidationMessage name="note" />
                            </div>

                            {/* UpdateReason */}
                            {id != null && (
                                <div className="col col-12">
                                    <Label text="Lý do chỉnh sửa" required />
                                    <TextAreaInput
                                        name="updatedReason"
                                        maxLength={255}
                                        style={{ minHeight: "150px" }}
                                        value={model.updatedReason}
                                        onValueChanged={updatedReason => {
                                            setModel(model => model.from({ updatedReason }));
                                        }}
                                        placeholder="Lý do chỉnh sửa"
                                    />
                                    <ValidationMessage name="updatedReason" />
                                </div>
                            )}
                        </div>
                    </MainBlock>
                </div>

                {/* Customer picker */}
                <div className="col col-12">
                    <CustomerPicker
                        isInitialRendering={isInitialRendering}
                        initialModel={initialModels.customerList}
                        value={model.customer}
                        onValueChanged={customer => {
                            setModel(model => model.from({ customer }));
                        }}
                    />
                </div>
            </div>

            {/* Action buttons */}
            <div className="row g-3 justify-content-end">
                {/* Delete button */}
                {model.canDelete && (
                    <div className="col col-auto">
                        <DeleteButton  />
                    </div>
                )}

                {/* Submit button */}
                <div className="col col-auto">
                    <SubmitButton />
                </div>
            </div>
        </UpsertViewContainer>
    );
};

export default ConsultantUpsertView;