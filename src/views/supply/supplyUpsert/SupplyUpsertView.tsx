import React, { useRef, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupplyService } from "@/services/supplyService";
import { SupplyUpsertModel } from "@/models/supply/supplyUpsertModel";
import { SupplyUpsertItemModel } from "@/models/supply/supplyItem/supplyUpsertItemModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { NotFoundError } from "@/errors";

// Form components.
import Label from "@/views/form/LabelComponent";
import TextAreaInput from "@/views/form/TextAreaInputComponent";
import StatsDateTimeInput from "@/views/form/StatsDateTimeInputComponent";
import MoneyInput from "@/views/form/MoneyInputComponent";
import SubmitButton from "@/views/form/SubmitButtonComponent";
import DeleteButton from "@/views/form/DeleteButtonComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Layout components.
import UpsertViewContainer from "@/views/layouts/UpsertViewContainerComponent";
import MainBlock from "@/views/layouts/MainBlockComponent";

// Child components.
import ProductPicker from "./productPicker/ProductPickerComponent";
import SupplyPickedItemList from "./SupplyPickedItemListComponent";
import SupplyItemInputModal from "./itemInputModal/SupplyItemInputModalComponent";

// Types.
type ChangedData = Partial<SupplyUpsertItemModel>;
type ModalPromiseResolve = (changedData: ChangedData | PromiseLike<ChangedData>) => void;

// Component.
const SupplyUpsertView = ({ id }: { id?: number }) => {
    // Depdencies.
    const navigate = useNavigate();
    const alertModalStore = useAlertModalStore();
    const service = useMemo(useSupplyService, []);
    const routeGenerator = useMemo(useRouteGenerator, []);

    // Model and states.
    const {isInitialLoading, onInitialLoadingFinished, modelState } = useUpsertViewStates();
    const [initialLoadingState, setInitialLoadingState] = useState(() => ({
        supplyForm: true,
        productPicker: true
    }));
    const [model, setModel] = useState(() => new SupplyUpsertModel());
    const [modalModel, setModalModel] = useState<SupplyUpsertItemModel | null>(() => null);
    const modalPromiseResolve = useRef<ModalPromiseResolve | null>(null);

    // Effect.
    useEffect(() => {
        const initialLoadAsync = async () => {
            try {
                if (id == null) {
                    const authorization = await service.getCreatingAuthorizationAsync();
                    setModel(model => {
                        return model.fromCreatingAuthorizationResponseDto(authorization);
                    });
                } else {
                    const detailResponseDto = await service.getDetailAsync(id);
                    setModel(m => m.fromDetailResponseDto(detailResponseDto));
                }
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await alertModalStore.getSubmissionErrorConfirmationAsync();
                    await navigate(-1);
                    return;
                }
                
                throw error;
            }
        };

        initialLoadAsync().finally(() => {
            setInitialLoadingState(state => ({ ...state, supplyForm: false }));
        });
    }, []);

    useEffect(() => {
        const { supplyForm, productPicker } = initialLoadingState;
        if (!supplyForm && !productPicker) {
            onInitialLoadingFinished();
        }
    }, [initialLoadingState]);

    // Callbacks.
    const openItemModalAsync = async (item: SupplyUpsertItemModel) => {
        setModalModel(item);
        return new Promise<Partial<SupplyUpsertItemModel>>(resolve => {
            return modalPromiseResolve.current = resolve;
        });
    };

    const handleSubmissionAsync = async (): Promise<number> => {
        if (id == null) {
            return await service.createAsync(model.toRequestDto());
        } else {
            await service.updateAsync(model.id, model.toRequestDto());
            return model.id;
        }
    };

    const handleSucceededSubmissionAsync = async (submittedId: number): Promise<void> => {
        await navigate(routeGenerator.getSupplyDetailRoutePath(submittedId));
    };

    const handleDeletionAsync = async () => {
        await service.deleteAsync(model.id);
    };

    const handleSucceededDeletionAsync = async () => {
        await navigate(routeGenerator.getSupplyListRoutePath());
    };

    return (
        <UpsertViewContainer modelState={modelState} isInitialLoading={isInitialLoading}
                submittingAction={handleSubmissionAsync}
                onSubmissionSucceeded={handleSucceededSubmissionAsync}
                deletingAction={handleDeletionAsync}
                onDeletionSucceeded={handleSucceededDeletionAsync}>
            <div className="row g-3">
                {/* Supply detail */}
                <div className="col col-12">
                    <MainBlock title="Thông tin đơn nhập hàng" closeButton
                            bodyPadding={[0, 2, 2, 2]}>
                        <div className="row g-3">
                            {/* SuppliedDateTime */}
                            {model.canSetStatsDateTime && (
                                <div className="col col-md-6 col-12">
                                    <Label text="Ngày giờ nhập hàng" required />
                                    <StatsDateTimeInput name="suppliedDateTime"
                                            disabled={initialLoadingState.supplyForm}
                                            value={model.statsDateTime}
                                            onValueChanged={statsDateTime => {
                                                setModel(m => m.from({ statsDateTime }));
                                            }} />
                                    <ValidationMessage name="suppliedDateTime" />
                                </div>
                            )}
                            
                            {/* ShipmentFee */}
                            <div className="col col-md-6 col-12">
                                <Label text="Phí vận chuyển" />
                                <MoneyInput name="shipmentFee" suffix=" vnđ"
                                        disabled={initialLoadingState.supplyForm}
                                        value={model.shipmentFee}
                                        onValueChanged={shipmentFee => {
                                            setModel(m => m.from({ shipmentFee }));
                                        }} />
                                <ValidationMessage name="shipmentFee" />
                            </div>
    
                            {/* Note */}
                            <div className="col col-12">
                                <Label text="Ghi chú" />
                                <TextAreaInput name="note"
                                        disabled={initialLoadingState.supplyForm}
                                        value={model.note}
                                        onValueChanged={note => {
                                            setModel(m => m.from({ note }));
                                        }}
                                        placeholder="Ghi chú ..."
                                        v-model="model.note" />
                                <ValidationMessage name="note" />
                            </div>
    
                            {/* UpdateReason */}
                            {id != null && (
                                <div className="col col-12 mt-3">
                                    <Label text="Lý do chỉnh sửa" required />
                                    <TextAreaInput name="updatedReason"
                                            disabled={initialLoadingState.supplyForm}
                                            placeholder="Lý do chỉnh sửa ..."
                                            value={model.updatedReason}
                                            onValueChanged={updatedReason => {
                                                setModel(m => m.from({ updatedReason }));
                                            }} />
                                    <ValidationMessage name="updatedReason" />
                                </div>
                            )}
                        </div>
                    </MainBlock>
                </div>
            </div>
    
            <div className="row g-3 align-items-stretch">
                {/* Product picker */}
                <div className="col col-lg-6 col-12">
                    <ProductPicker
                        isInitialLoading={initialLoadingState.productPicker}
                        onInitialLoadingFinished={() => {
                            setInitialLoadingState(state => ({
                                ...state,
                                productPicker: false
                            }));
                        }}
                        pickedItems={model.items}
                        onPicked={async (product) => {
                            const newItem = new SupplyUpsertItemModel(product);
                            const changedData = await openItemModalAsync(newItem);
                            setModel(model => model.from({
                                items: [ ...model.items, newItem.from(changedData) ]
                            }));
                        }}
                    />
                </div>
    
                {/* Supply items */}
                <div className="col col-lg-6 col-12">
                    <SupplyPickedItemList
                        model={model.items}
                        modelState={modelState}
                        onEdit={async (index) => {
                            const item = model.items[index];
                            const changedData = await openItemModalAsync(item);
                            setModel(model => model.from({
                                items: model.items.map((evaluatingItem, evaluatingIndex) => {
                                    if (evaluatingIndex !== index) {
                                        return evaluatingItem;
                                    }

                                    return evaluatingItem.from(changedData);
                                })
                            }));
                        }}
                        onUnpicked={(index) => {
                            setModel(model => model.from({
                                items: model.items.filter((_, evaluatingIndex) => {
                                    return evaluatingIndex !== index;
                                })
                            }));
                        }}
                    />
                </div>
            </div>

            {/* Item input modal */}
            <SupplyItemInputModal
                model={modalModel}
                onCancel={() => setModalModel(null)}
                onSaved={(changedData) => {
                    modalPromiseResolve.current?.(changedData);
                    setModalModel(null);
                    modalPromiseResolve.current = null;
                }}
            />

            {/* Action buttons */}
            <div className="row g-3 justify-content-end">
                {/* Delete button */}
                {model.canDelete && (
                    <div className="col col-auto">
                        {/* Submit button */}
                        <div className="d-flex justify-content-end">
                            <DeleteButton  />
                        </div>
                    </div>
                )}
                
                {/* Submit button */}
                <div className="col col-auto">
                    {/* Submit button */}
                    <div className="d-flex justify-content-end">
                        <SubmitButton />
                    </div>
                </div>
            </div>
        </UpsertViewContainer>
    );
};

export default SupplyUpsertView;