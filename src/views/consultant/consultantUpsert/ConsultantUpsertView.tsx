import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConsultantService } from "@/services/consultantService";
import { ConsultantUpsertModel } from "@/models/consultant/consultantUpsertModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useRouteGenerator } from "@/router/routeGenerator";
import { NotFoundError } from "@/errors";

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
import CustomerPicker from "@/views/shared/customerPicker/CustomerPickerComponent";

// Component.
const ConsultantUpsertView = ({ id }: { id?: number }) => {
    // Dependencies.
    const navigate = useNavigate();
    const alertModalStore = useAlertModalStore();
    const initialData = useInitialDataStore(store => store.data.consultant);
    const service = useConsultantService();
    const routeGenerator = useRouteGenerator();

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished, modelState } = useUpsertViewStates();
    const [model, setModel] = useState(() => new ConsultantUpsertModel());
    const [initialLoadingState, setInitialLoadingState] = useState(() => ({
        consultantForm: true,
        customerPicker: true
    }));
    const { isModelDirty, setOriginalModel } = useDirtyModelChecker(model, ["updatedReason"]);

    // Effect
    useEffect(() => {
        const initialLoadAsync = async () => {
            try {
                if (id == null) {
                    const authorization = initialData.creatingAuthorization;
                    if (!authorization) {
                        await alertModalStore.getUnauthorizationConfirmationAsync();
                        await navigate(routeGenerator.getConsultantListRoutePath());
                        return;
                    }

                    setModel(model => {
                        const loadedModel = model
                            .fromCreatingAuthorizationResponseDto(authorization);
                        setOriginalModel(loadedModel);
                        return loadedModel;
                    });
                } else {
                    const responseDto = await service.getDetailAsync(id);
                    setModel(model => {
                        const loadedModel = model.fromDetailResponseDto(responseDto);
                        setOriginalModel(loadedModel);
                        return loadedModel;
                    });
                }
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await alertModalStore.getNotFoundConfirmationAsync();
                    await navigate(routeGenerator.getConsultantListRoutePath());
                    return;
                }

                throw error;
            }
        };

        initialLoadAsync().finally(() => {
            setInitialLoadingState(state => ({ ...state, consultantForm: false }));
        });
    }, []);

    useEffect(() => {
        const { consultantForm, customerPicker } = initialLoadingState;
        if (!consultantForm && !customerPicker) {
            onInitialLoadingFinished();
        }
    }, [initialLoadingState]);

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
            return await service.createAsync(model.toRequestDto());
        } else {
            await service.updateAsync(model.id, model.toRequestDto());
            return model.id;
        }
    };

    const handleDeletionAsync = async (): Promise<void> => {
        await service.deleteAsync(model.id);
    };

    const handleSucceededSubmissionAsync = async (submissionResult: number): Promise<void> => {
        await navigate(routeGenerator.getConsultantDetailRoutePath(submissionResult));
    };

    const handleSucceededDeletionAsync = async (): Promise<void> => {
        await navigate(routeGenerator.getConsultantListRoutePath());
    };

    return (
        <UpsertViewContainer
            isInitialLoading={isInitialLoading}
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
                        isInitialLoading={initialLoadingState.customerPicker}
                        onInitialLoadingFinished={() => setInitialLoadingState(state => ({
                            ...state,
                            customerPicker: false
                        }))}
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