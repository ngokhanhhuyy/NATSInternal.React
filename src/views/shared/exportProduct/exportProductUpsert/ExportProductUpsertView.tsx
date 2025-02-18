import React, { useState, useRef, useMemo, useEffect, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductBasicModel } from "@/models/product/productBasicModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { NotFoundError, AuthorizationError } from "@/errors";

// Layout component.
import UpsertViewContainer from "@/views/layouts/UpsertViewContainerComponent";

// Form components.
import SubmitButton from "@/views/form/SubmitButtonComponent";
import DeleteButton from "@/views/form/DeleteButtonComponent";

// Child components.
import CustomerPicker from "../../customerPicker/CustomerPickerComponent";
import ProductPicker from "./productPicker/ProductPicker";
import PickedItemList from "./PickedItemListComponent";
import Information from "./InformationComponent";
import Summary from "./SummaryComponent";
import ExportProductItemInputModal from "./itemInputModal/ItemInputModalComponent";

// Types.
type ItemChangedData<
        TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>>
    = Partial<TUpsertItem>;
type ModalPromiseResolve<
        TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>>
    = (changedData: ItemChangedData<TUpsertItem> | PromiseLike<ItemChangedData<TUpsertItem>>)
    => void;
// Props.
interface ExportProductUpsertViewProps<
        TUpsert extends IExportProductUpsertModel<TUpsert, TUpsertItem, TUpsertPhoto>,
        TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>,
        TUpsertPhoto extends IUpsertPhotoModel<TUpsertPhoto>>
{
    resourceType: string;
    isForCreating: boolean;
    initializeModel: () => TUpsert;
    initialLoadAsync: (
        model: TUpsert,
        initialData: ResponseDtos.InitialData) => Promise<TUpsert>;
    initializeItemModel: (product: ProductBasicModel) => TUpsertItem;
    submitAsync(model: TUpsert): Promise<number>;
    deleteAsync(): Promise<void>;
    getListRoute(routeGenerator: ReturnType<typeof useRouteGenerator>): string;
    getDetailRoute(routeGenerator: ReturnType<typeof useRouteGenerator>, id: number): string;
    renderForm?: (
        model: TUpsert,
        setModel: React.Dispatch<SetStateAction<TUpsert>>) => React.ReactNode | undefined;
    renderSummary?: (
        model: TUpsert,
        labelColumnClassName: string) => React.ReactNode;
}

// Component.
const ExportProductUpsertView = <
            TUpsert extends IExportProductUpsertModel<TUpsert, TUpsertItem, TUpsertPhoto>,
            TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>,
            TUpsertPhoto extends IUpsertPhotoModel<TUpsertPhoto>>
        (props: ExportProductUpsertViewProps<TUpsert, TUpsertItem, TUpsertPhoto>) =>
{
    // Dependencies.
    const initialData = useInitialDataStore(store => store.data);
    const alertModalStore = useAlertModalStore();
    const navigate = useNavigate();
    const routeGenerator = useMemo(useRouteGenerator, []);

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished, modelState } = useUpsertViewStates();
    const [model, setModel] = useState(() => props.initializeModel());
    const [initialLoadingStates, setInitialLoadingStates] = useState(() => ({
        upsertForm: true,
        customerPickerList: true,
        productPickerList: true
    }));
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [modalModel, setModalModel] = useState<TUpsertItem | null>(() => null);
    const modalPromiseResolve = useRef<ModalPromiseResolve<TUpsertItem> | null>(null);

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                const loadedModel = await props.initialLoadAsync(
                    model,
                    initialData);
                setModel(loadedModel);
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await alertModalStore.getNotFoundConfirmationAsync();
                    await navigate(-1);
                    return;
                }

                if (error instanceof AuthorizationError) {
                    await alertModalStore.getUnauthorizationConfirmationAsync();
                    await navigate(-1);
                    return;
                }

                throw error;
            }
        };

        loadAsync().finally(() => {
            if (initialLoadingStates.upsertForm) {
                setInitialLoadingStates(states => ({ ...states, upsertForm: false }));
            }
        });
    }, []);

    useEffect(() => {
        const { upsertForm, customerPickerList, productPickerList } = initialLoadingStates;
        if (!upsertForm && !customerPickerList && !productPickerList) {
            onInitialLoadingFinished();
        }
    }, [initialLoadingStates]);

    // Computed.
    const stepNames = useMemo<string[]>(() => {
        return ["Thông tin", "Khách hàng", "Sản phẩm", "Xác nhận"];
    }, []);

    const computeStepClassName = (stepIndex: number): string => {
        if (stepIndex === currentStepIndex) {
            return "btn-primary text-white fw-bold rounded";
        }

        return "";
    };

    const computeStepIconClassName = (stepIndex: number): string => {
        return `bi bi-${stepIndex + 1}-circle-fill`;
    };

    const computeSummaryColumnClassName = (): string => {
        return currentStepIndex === stepNames.length - 1 ? "" : " d-none";
    };

    // Callbacks.
    const openItemModalAsync = async (item: TUpsertItem) => {
        setModalModel(item);
        return new Promise<Partial<TUpsertItem>>(resolve => {
            return modalPromiseResolve.current = resolve;
        });
    };

    const handlePicked = async (product: ProductBasicModel) => {
        const newItem = props.initializeItemModel(product);
        const changedData = await openItemModalAsync(newItem);
        setModel(model => model?.from({
            items: [ ...model.items, newItem.from(changedData) ]
        } as Partial<TUpsert>));
    };

    const handleEdit = async (index: number) => {
        const item = model.items[index];
        const changedData = await openItemModalAsync(item);
        setModel(model => model.from({
            items: model.items.map((evaluatingItem, evaluatingIndex) => {
                if (evaluatingIndex !== index) {
                    return evaluatingItem;
                }

                return evaluatingItem.from(changedData);
            })
        } as Partial<TUpsert>));
    };

    const handleUnpicked = (index: number) => {
        setModel(model => model.from({
            items: model.items.filter((_, evaluatingIndex) => {
                return index !== evaluatingIndex;
            })
        } as Partial<TUpsert>));
    };

    return (
        <UpsertViewContainer
            isInitialLoading={isInitialLoading}
            modelState={modelState}
            submittingAction={() => props.submitAsync(model)}
            onSubmissionSucceeded={async (submittedId) => {
                await navigate(props.getDetailRoute(routeGenerator, submittedId));
            }}
            deletingAction={() => props.deleteAsync()}
            onDeletionSucceeded={async () => {
                await navigate(props.getListRoute(routeGenerator));
            }}
        >
            {/* Step bar and error summary */}
            <div className="row g-3 justify-content-center">
                {/* Step bar */}
                <div className="col col-12=">
                    <div className="row g-0 w-100 bg-white px-2 py-2
                                    rounded-3 border text-primary">
                        {stepNames.map((stepName, index) => (
                            <div className="col col-md-auto col-12 me-2
                                            d-flex justify-content-start"
                                    key={index}>
                                <button className={`btn btn-sm px-2 d-flex align-items-center
                                                    w-100 ${computeStepClassName(index)}`}
                                        type="button"
                                        onClick={() => setCurrentStepIndex(index)}>
                                    <i className={computeStepIconClassName(index)} />
                                    <span className="ms-2">
                                        {stepName}
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step content blocks */}
            <div className="row g-3 justify-content-center">
                {/* OrderInformation */}
                <div className={`col col-12 ${currentStepIndex === 0 ? "" : "d-none"}`}>
                    <Information
                        model={model}
                        setModel={setModel}
                        isForCreating={props.isForCreating}
                        render={() => props.renderForm?.(model, setModel)}
                    />
                </div>

                {/* Customer selector */}
                <div className={`col col-12 ${currentStepIndex === 1 ? "" : "d-none"}`}>
                    <CustomerPicker
                        isInitialLoading={initialLoadingStates.customerPickerList}
                        onInitialLoadingFinished={() => {
                            setInitialLoadingStates((states) => ({
                                ...states,
                                customerPickerList: false
                            }));
                        }}
                        value={model.customer}
                        onValueChanged={customer => {
                            setModel(model => model.from({ customer } as Partial<TUpsert>));
                        }}
                    />
                </div>

                {/* Product selector */}
                <div className={`col col-lg-6 col-12 pe-lg-2 pe-0 pb-lg-0 pb-3
                                ${currentStepIndex === 2 ? "" : "d-none"}`}>
                    <ProductPicker
                        modelState={modelState}
                        isInitialLoading={initialLoadingStates.productPickerList}
                        onInitialLoadingFinished={() => {
                            setInitialLoadingStates(states => ({
                                ...states,
                                productPickerList: false
                            }));
                        }}
                        pickedItems={model.items}
                        onPicked={handlePicked}
                        onUnpicked={handleUnpicked}
                    />
                </div>

                {/* Picked items */}
                <div className={`col col-lg-6 col-12 ps-lg-2 ps-0
                                ${currentStepIndex === 2 ? "" : "d-none"}`}>
                    {/* List */}
                    <PickedItemList
                        model={model.items}
                        modelState={modelState}
                        onEdit={handleEdit}
                        onUnpicked={handleUnpicked}
                    />
                </div>

                {/* Summary */}
                <div className={"col col-12" + computeSummaryColumnClassName()}>
                    <Summary
                        isForCreating={props.isForCreating}
                        resourceType={props.resourceType}
                        model={model}
                        render={props.renderSummary}
                    />
                </div>
            </div>

            {/* Item input modal */}
            <ExportProductItemInputModal
                resourceType={props.resourceType}
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
                {!props.isForCreating &&  (
                    <div className="col col-auto">
                        <DeleteButton />
                    </div>
                )}

                {/* Back button */}
                {currentStepIndex !== 0 && (
                    <div className="col col-auto">
                        <button className="btn btn-outline-primary"
                                type="button"
                                onClick={() => setCurrentStepIndex(index => index - 1)}>
                            <i className="bi bi-chevron-left"></i>
                            <span className="ms-2">Quay lại</span>
                        </button>
                    </div>
                )}

                {/* Next button */}
                {currentStepIndex !== stepNames.length - 1 && (
                    <div className="col col-auto">
                        <button className="btn btn-outline-primary"
                                type="button"
                                onClick={() => setCurrentStepIndex(index => index + 1)}>
                            <span className="me-2">Tiếp theo</span>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                )}

                {/* Save button */}
                {currentStepIndex === stepNames.length - 1 && (
                    <div className="col col-auto">
                        <SubmitButton />
                    </div>
                )}
            </div>
        </UpsertViewContainer>
    );
};

export default ExportProductUpsertView;