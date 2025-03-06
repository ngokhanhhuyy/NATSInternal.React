import React, { useState, useRef, useMemo, useEffect, useTransition } from "react";
import { useProductService } from "@/services/productService";
import { ProductListModel } from "@/models/product/productListModel";
import { ProductBasicModel } from "@/models/product/productBasicModel";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError } from "@/errors";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form components.
import { FormContext } from "@/views/form/FormComponent";
import Label from "@/views/form/LabelComponent";
import TextInput from "@/views/form/TextInputComponent";
import SelectInput, { SelectInputOption } from "@/views/form/SelectInputComponent";

// Child components.
import Results from "./ProductPickerResultsComponent";

// Request dto for initial model.
export const requestDtoForInitialModel: RequestDtos.Product.List = { resultsPerPage: 7 };

// Props.
interface Props<TUpsertItem extends IHasProductUpsertItemModel<TUpsertItem>> {
    isInitialRendering: boolean;
    initialModel: ProductListModel;
    pickedItems: TUpsertItem[];
    onPicked(product: ProductBasicModel): void | Promise<void>;
}

// Component.
const ProductPicker = <TUpsertItem extends IHasProductUpsertItemModel<TUpsertItem>>
        (props: Props<TUpsertItem>) => {
    // Dependencies.
    const service = useProductService();
    const getSubmissionErrorConfirmationAsync = useAlertModalStore(store => {
        return store.getSubmissionErrorConfirmationAsync;
    });

    // Model and states.
    const [model, setModel] = useState(() => props.initialModel);
    const [isReloading, startReloadingTransition] = useTransition();
    const requestId = useRef<number>(1);
    const requestIdQueue = useRef<number[]>([]);

    // Effect.
    useEffect(() => {
        if (!props.isInitialRendering) {
            startReloadingTransition(async () => {
                const currentRequestId = requestId.current;
                try {
                    requestIdQueue.current.push(currentRequestId);
                    requestId.current += 1;
                    const responseDto = await service.getListAsync(model.toRequestDto());
                    const lastIndexInQueue = requestIdQueue.current.length - 1;
                    if (requestIdQueue.current[lastIndexInQueue] === currentRequestId) {
                        setModel(model => model.fromListResponseDto(responseDto));
                    }
                } catch (error) {
                    const lastIndexInQueue = requestIdQueue.current.length - 1;
                    if (requestIdQueue.current[lastIndexInQueue] === currentRequestId) {
                        if (error instanceof ValidationError) {
                            await getSubmissionErrorConfirmationAsync();
                            return;
                        }
    
                        throw error;
                    }
                } finally {
                    requestIdQueue.current = requestIdQueue.current
                        .filter(id => id != currentRequestId);
                }
            });
        };
    }, [model.page, model.brandId, model.categoryId, model.productName]);

    // Computed.
    const computeReloadingClassName = (): string => {
        const classNames = ["transition-reloading"];
        if (isReloading) {
            classNames.push("opacity-50 pe-none");
        }

        return classNames.join(" ");
    };

    const brandOptions: SelectInputOption[] = [
        { value: "", displayName: "Tất cả thương hiệu" },
        ...model.brandOptions?.map(option => ({
            value: option.id.toString(),
            displayName: option.name
        })) ?? []
    ];

    const categoryOptions = useMemo<SelectInputOption[]>(() => {
        const options: SelectInputOption[] = [{ value: "", displayName: "Tất cả phân loại" }];
        return [
            ...options,
            ...model.categoryOptions?.map(option => ({
                value: option.id.toString(),
                displayName: option.name
            })) ?? []
        ];
    }, [model.brandOptions]);

    const backButtonDisabled = model.page === 1;
    const backButtonClassName = backButtonDisabled ? "opacity-25" : "";

    const nextButtonDisabled = model.page === model.pageCount;
    const nextButtonClassName = nextButtonDisabled ? "opacity-25" : "";

    // Callbacks.
    const handlePreviousPageButtonClicked = () => {
        setModel(model => model.from({ page: model.page - 1 }));
    };

    const handleNextPageButtonClicked = () => {
        setModel(model => model.from({ page: model.page + 1 }));
    };

    // Header.
    const computeHeader = (): React.ReactNode => {
        if (isReloading) {
            return (
                <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            );
        }

        return null;
    };
    // Template.
    return (
        <MainBlock
            title="Sản phẩm"
            className="sticky-top"
            header={computeHeader()}
            bodyPadding={[0, 2, 2, 2]}
            bodyClassName="row g-3"
        >
            <FormContext.Provider value={null}>
                {/* Product name search */}
                <div className={`col col-12`}>
                    <Label text="Tìm kiếm sản phẩm" />
                    <TextInput
                        name="productName"
                        className="border-end-0"
                        placeholder="Tìm kiếm theo tên ..."
                        value={model.productName ?? ""}
                        onValueChanged={productName => {
                            setModel(model => model.from({
                                page: 1,
                                productName: productName || undefined
                            }));
                        }}
                    />
                </div>
    
                {/* Category options */}
                <div className={`col col-xl-6 col-lg-12 col-md-6 col-12`}>
                    <Label text="Phân loại" />
                    <SelectInput
                        name="categoryId"
                        options={categoryOptions}
                        value={model.categoryId?.toString() ?? ""}
                        onValueChanged={id => {
                            if (!id) {
                                setModel(model => model.from({
                                    page: 1,
                                    categoryId: undefined
                                }));
                            } else {
                                const categoryId = parseInt(id);
                                setModel(model => model.from({
                                    page: 1,
                                    categoryId 
                                }));
                            }
                        }}
                    />
                </div>
    
                {/* Brand options */}
                <div className={`col col-xl-6 col-lg-12 col-md-6 col-12`}>
                    <Label text="Thương hiệu" />
                    <SelectInput
                        name="brandId"
                        options={brandOptions}
                        value={model.brandId?.toString() ?? ""}
                        onValueChanged={id => {
                            if (!id) {
                                setModel(model => model.from({
                                    page: 1,
                                    brandId: undefined
                                }));
                            } else {
                                const brandId = parseInt(id);
                                setModel(model => model.from({
                                    page: 1,
                                    brandId
                                }));
                            }
                        }}
                    />
                </div>
    
                {/* Pagination */}
                <div className={`col col-12`}>
                    {model.pageCount > 0 && (
                        <div className="d-flex justify-content-center
                                        align-items-center pagination">
                            {/* Previous page button */}
                            <button className={`btn btn-outline-primary btn-sm
                                                ${backButtonClassName}`}
                                    type="button"
                                    disabled={backButtonDisabled}
                                    onClick={handlePreviousPageButtonClicked}>
                                <i className="bi bi-chevron-left"></i>
                            </button>
        
                            {/* Page number */}
                            <div className="border rounded px-3 py-1 mx-2 small">
                                Trang {model.page}/{model.pageCount}
                            </div>
        
                            {/* Next page button */}
                            <button className={`btn btn-outline-primary btn-sm
                                                ${nextButtonClassName}`}
                                    type="button"
                                    disabled={nextButtonDisabled}
                                    onClick={handleNextPageButtonClicked}>
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
    
                {/* Results list */}
                <div className={`col col-12 ${computeReloadingClassName()}`}>
                    <Results
                        isReloading={isReloading}
                        productsModel={model.items}
                        productsModelResultsPerPage={model.resultsPerPage}
                        itemsModel={props.pickedItems}
                        onPicked={props.onPicked}
                    />
                </div>
            </FormContext.Provider>
        </MainBlock>
    );
};

export default ProductPicker;