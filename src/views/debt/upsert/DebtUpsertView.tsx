import React, { useState, useMemo, useEffect, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { NotFoundError, AuthorizationError } from "@/errors";

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

// Shared components.
import CustomerPicker from "@/views/shared/customerPicker/CustomerPickerComponent";
import { useInitialDataStore } from "@/stores/initialDataStore";

// Props.
interface DebtUpsertViewProps<TUpsert extends IDebtUpsertModel<TUpsert>> {
    displayName: (displayNameGetter: (key: string) => string) => string;
    isForCreating: boolean;
    initializeModel(): TUpsert;
    loadFromCreatingAuthorization(
        initialData: ResponseDtos.InitialData,
        setModel: Dispatch<SetStateAction<TUpsert>>): void;
    loadFromDetailAsync(setModel: Dispatch<SetStateAction<TUpsert>>): Promise<void>;
    submitAsync(model: TUpsert): Promise<number>;
    onSubmissionSucceededAsync(
        submissionResult: number,
        navigate: ReturnType<typeof useNavigate>,
        routeGenerator: ReturnType<typeof useRouteGenerator>): Promise<void>;
    deleteAsync(id: number): Promise<void>;
    onDeletionSucceededAsync(
        navigate: ReturnType<typeof useNavigate>,
        routeGenerator: ReturnType<typeof useRouteGenerator>): Promise<void>;
}

interface FormBlockProps<TUpsert extends IDebtUpsertModel<TUpsert>> {
    model: TUpsert;
    setModel: Dispatch<SetStateAction<TUpsert>>;
    blockTitle: string;
    isForCreating: boolean;
}

// Component.
const DebtUpsertView = <TUpsert extends IDebtUpsertModel<TUpsert>>
        (props: DebtUpsertViewProps<TUpsert>) => {
    // Dependencies.
    const navigate = useNavigate();
    const alertModalStore = useAlertModalStore();
    const initialDataStore = useInitialDataStore();
    const routeGenerator = useRouteGenerator();

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished, modelState } = useUpsertViewStates();
    const [model, setModel] = useState<TUpsert>(() => props.initializeModel());
    const [initialLoadingStates, setInitialLoadingStates] = useState(() => ({
        debtDetail: true,
        customerList: true,
    }));

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                if (props.isForCreating) {
                    props.loadFromCreatingAuthorization(initialDataStore.data, setModel);
                } else {
                    await props.loadFromDetailAsync(setModel);
                }
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await alertModalStore.getNotFoundConfirmationAsync();
                    return;
                }

                if (error instanceof AuthorizationError) {
                    await alertModalStore.getUnauthorizationConfirmationAsync();
                    return;
                }

                throw error;
            }
        };

        loadAsync().finally(() => setInitialLoadingStates(states => ({
            ...states,
            debtDetail: false
        })));
    }, []);

    useEffect(() => {
        const { debtDetail, customerList } = initialLoadingStates;
        if (!debtDetail && !customerList) {
            onInitialLoadingFinished();
        }
    }, [initialLoadingStates]);
    
    // Computed.
    const computeFormBlockTitle = () => {
        if (props.isForCreating) {
            return `Tạo ${props.displayName(initialDataStore.getDisplayName)} mới`;
        }
    
        return `Chỉnh sửa ${props.displayName(initialDataStore.getDisplayName)}`;
    };

    return (
        <UpsertViewContainer
            isInitialLoading={isInitialLoading}
            modelState={modelState}
            submittingAction={async () => props.submitAsync(model)}
            onSubmissionSucceeded={async (submissionResult) => {
                return props.onSubmissionSucceededAsync(
                    submissionResult,
                    navigate,
                    routeGenerator);
            }}
            deletingAction={async () => await props.deleteAsync(model.id)}
            onDeletionSucceeded={async () => {
                return props.onDeletionSucceededAsync(navigate, routeGenerator);
            }}
        >
            <div className="row g-3 justify-content-end">
                {/* ModelState errors */}
                {!modelState.isValid && (
                    <div className="col col-12 text-danger">
                        <div className="bg-white border rounded-3 px-3 py-2">
                            {modelState.getAllErrorMessages().length === 1 && (
                                <span>-&nbsp;</span>
                            )}

                            {modelState.getAllErrorMessages().map(error => (
                                <span key={error}>{error}</span>
                            ))}
                            <br/>
                        </div>
                    </div>
                )}

                {/* Consultant information */}
                <div className="col col-12">
                    <FormBlock
                        model={model}
                        setModel={setModel}
                        blockTitle={computeFormBlockTitle()}
                        isForCreating={props.isForCreating}
                    />
                </div>

                {/* Customer picker */}
                <div className="col col-12">
                    <CustomerPicker
                        value={model.customer}
                        onValueChanged={(customer) => {
                            setModel(model => model.from({ customer } as Partial<TUpsert>));
                        }}
                        isInitialLoading={initialLoadingStates.customerList}
                        onInitialLoadingFinished={() => {
                            setInitialLoadingStates(states => ({
                                ...states,
                                customerList: false
                            }));
                        }}
                        disabled={!props.isForCreating}
                    />
                </div>
            </div>

            {/* Actions button */}
            <div className="row g-3 justify-content-end">
                {/* Delete button */}
                {model.canDelete && (
                    <div className="col col-auto">
                        <DeleteButton />
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

const FormBlock = <TUpsert extends IDebtUpsertModel<TUpsert>>
        (props: FormBlockProps<TUpsert>) => {
    return (
        <MainBlock
            title={props.blockTitle}
            closeButton
            bodyPadding={[0, 2, 2, 2]}
        >
            <div className="row g-3">
                {/* StatsDateTime */}
                <div className="col col-md-6 col-12">
                    <Label text="Ngày thống kê" />
                    <StatsDateTimeInput
                        name="statsDateTime"
                        value={props.model.statsDateTime}
                        onValueChanged={(statsDateTime) => {
                            props.setModel((model) => {
                                return model.from({ statsDateTime } as Partial<TUpsert>);
                            });
                        }}
                        disabled={!props.model.canSetStatsDateTime}
                    />
                    <ValidationMessage name="statsDateTime" />
                </div>

                {/* Amount */}
                <div className="col col-md-6 col-12">
                    <Label text="Số tiền" required />
                    <MoneyInput
                        name="amount"
                        value={props.model.amount}
                        onValueChanged={(amount) => {
                            props.setModel((model) => {
                                return model.from({ amount } as Partial<TUpsert>);
                            });
                        }}
                        suffix=" đồng"
                    />
                    <ValidationMessage name="amount" />
                </div>

                {/* Note */}
                <div className="col col-12">
                    <Label text="Ghi chú" />
                    <TextAreaInput
                        name="note"
                        maxLength={255}
                        value={props.model.note}
                        onValueChanged={(note) => {
                            props.setModel(model => model.from({ note } as Partial<TUpsert>));
                        }}
                        placeholder="Ghi chú ..."
                    />
                    <ValidationMessage name="note" />
                </div>

                {/* UpdateReason */}
                {!props.isForCreating && (
                    <div className="col col-12">
                        <Label text="Lý do chỉnh sửa" required />
                        <TextAreaInput
                            name="updatedReason"
                            value={props.model.updatedReason}
                            onValueChanged={updatedReason => {
                                props.setModel(model => {
                                    return model.from({ updatedReason } as Partial<TUpsert>);
                                });
                            }}
                            placeholder="Lý do chỉnh sửa"
                        />
                        <ValidationMessage name="updatedReason" />
                    </div>
                )}
            </div>
        </MainBlock>
    );
};

export default DebtUpsertView;