import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupplyService } from "@/services/supplyService";
import { useProductService } from "@/services/productService";
import { useBrandService } from "@/services/brandService";
import { useProductCategoryService } from "@/services/productCategoryService";
import { SupplyUpsertModel } from "@/models/supply/supplyUpsertModel";
import { ProductListModel } from "@/models/product/productListModel";
import { SupplyUpsertItemModel } from "@/models/supply/supplyItem/supplyUpsertItemModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { AuthorizationError } from "@/errors";

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
import ProductPicker, { requestDtoForInitialModel as requestDtoForProductList }
    from "@/views/shared/hasProduct/upsert/productPicker/ProductPickerComponent";
import SupplyPickedItemList from "./SupplyPickedItemListComponent";
import SupplyItemInputModal from "./itemInputModal/SupplyItemInputModalComponent";

// Types.
type ChangedData = Partial<SupplyUpsertItemModel>;
type ModalPromiseResolve = (changedData: ChangedData | PromiseLike<ChangedData>) => void;

// Component.
const SupplyUpsertView = ({ id }: { id?: number }) => {
    // Depdencies.
    const navigate = useNavigate();
    const productListInitialData = useInitialDataStore(store => store.data.product);
    const supplyService = useSupplyService();
    const productService = useProductService();
    const brandService = useBrandService();
    const productCategoryService = useProductCategoryService();
    const routeGenerator = useRouteGenerator();

    // Model and states.
    const { isInitialRendering, modelState } = useUpsertViewStates();
    const initialModels = useAsyncModelInitializer({
        initializer: async () => {
            const productListPromise = productService.getListAsync(requestDtoForProductList);
            const brandOptionsPromise = brandService.getAllAsync();
            const categoryOptionsPromise = productCategoryService.getAllAsync();

            if (id == null) {
                const [
                    creatingAuthorization,
                    productList,
                    brandOptions,
                    categoryOptions
                ] = await Promise.all([
                    supplyService.getCreatingAuthorizationAsync(),
                    productListPromise,
                    brandOptionsPromise,
                    categoryOptionsPromise
                ]);

                const canSetStatsDateTime = creatingAuthorization?.canSetStatsDateTime;
                if (!canSetStatsDateTime) {
                    throw new AuthorizationError();
                }

                return {
                    supplyUpsert: new SupplyUpsertModel(canSetStatsDateTime),
                    productList: new ProductListModel(
                        productList,
                        brandOptions,
                        categoryOptions,
                        productListInitialData,
                        requestDtoForProductList)
                };
            } else {
                const [
                    supplyDetail,
                    productList,
                    brandOptions,
                    categoryOptions
                ] = await Promise.all([
                    supplyService.getDetailAsync(id),
                    productListPromise,
                    brandOptionsPromise,
                    categoryOptionsPromise
                ]);

                if (!supplyDetail.authorization.canEdit) {
                    throw new AuthorizationError();
                }

                return {
                    supplyUpsert: new SupplyUpsertModel(supplyDetail),
                    productList: new ProductListModel(
                        productList,
                        brandOptions,
                        categoryOptions,
                        productListInitialData,
                        requestDtoForProductList)
                };
            }
        },
        cacheKey: id == null ? "supplyCreate" : "supplyUpdate"
    });
    const [model, setModel] = useState(() => initialModels?.supplyUpsert);
    const [modalModel, setModalModel] = useState<SupplyUpsertItemModel | null>(() => null);
    const modalPromiseResolve = useRef<ModalPromiseResolve | null>(null);
    const isModelDirty = useDirtyModelChecker(
        initialModels.supplyUpsert,
        model,
        ["updatedReason"]);

    // Callbacks.
    const openItemModalAsync = async (item: SupplyUpsertItemModel) => {
        setModalModel(item);
        return new Promise<Partial<SupplyUpsertItemModel>>(resolve => {
            return modalPromiseResolve.current = resolve;
        });
    };

    const handleSubmissionAsync = async (): Promise<number> => {
        if (id == null) {
            return await supplyService.createAsync(model.toRequestDto());
        } else {
            await supplyService.updateAsync(model.id, model.toRequestDto());
            return model.id;
        }
    };

    const handleSucceededSubmissionAsync = async (submittedId: number): Promise<void> => {
        await navigate(routeGenerator.getSupplyDetailRoutePath(submittedId));
    };

    const handleDeletionAsync = async () => {
        await supplyService.deleteAsync(model.id);
    };

    const handleSucceededDeletionAsync = async () => {
        await navigate(routeGenerator.getSupplyListRoutePath());
    };

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
                {/* Supply detail */}
                <div className="col col-12">
                    <MainBlock
                        title="Thông tin đơn nhập hàng"
                        closeButton
                        bodyPadding={[0, 2, 2, 2]}
                    >
                        <div className="row g-3">
                            {/* SuppliedDateTime */}
                            {model.canSetStatsDateTime && (
                                <div className="col col-xl-6 col-md-8 col-12">
                                    <Label text="Ngày giờ nhập hàng" required />
                                    <StatsDateTimeInput
                                        name="suppliedDateTime"
                                        value={model.statsDateTime}
                                        onValueChanged={statsDateTime => {
                                            setModel(m => m.from({ statsDateTime }));
                                        }}
                                    />
                                    <ValidationMessage name="suppliedDateTime" />
                                </div>
                            )}
                            
                            {/* ShipmentFee */}
                            <div className="col col-xl-6 col-md-4 col-12">
                                <Label text="Phí vận chuyển" />
                                <MoneyInput
                                    name="shipmentFee"
                                    suffix=" vnđ"
                                    value={model.shipmentFee}
                                    onValueChanged={shipmentFee => {
                                        setModel(m => m.from({ shipmentFee }));
                                    }}
                                />
                                <ValidationMessage name="shipmentFee" />
                            </div>
    
                            {/* Note */}
                            <div className="col col-12">
                                <Label text="Ghi chú" />
                                <TextAreaInput
                                    name="note"
                                    value={model.note}
                                    onValueChanged={note => {
                                        setModel(m => m.from({ note }));
                                    }}
                                    placeholder="Ghi chú ..."
                                />
                                <ValidationMessage name="note" />
                            </div>
    
                            {/* UpdateReason */}
                            {id != null && (
                                <div className="col col-12">
                                    <Label text="Lý do chỉnh sửa" required />
                                    <TextAreaInput
                                        name="updatedReason"
                                        placeholder="Lý do chỉnh sửa ..."
                                        value={model.updatedReason}
                                        onValueChanged={updatedReason => {
                                            setModel(m => m.from({ updatedReason }));
                                        }}
                                    />
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
                        isInitialRendering={isInitialRendering}
                        initialModel={initialModels.productList}
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