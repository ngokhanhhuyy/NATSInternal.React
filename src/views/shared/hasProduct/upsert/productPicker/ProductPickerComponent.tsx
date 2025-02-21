import React, { useState, useMemo, useEffect } from "react";
import { useProductService } from "@/services/productService";
import { useBrandService } from "@/services/brandService";
import { useProductCategoryService } from "@/services/productCategoryService";
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

// Props.
interface Props<TUpsertItem extends IHasProductUpsertItemModel<TUpsertItem>> {
    isInitialLoading: boolean;
    onInitialLoadingFinished(): void;
    pickedItems: TUpsertItem[];
    onPicked(product: ProductBasicModel): void | Promise<void>;
}

// Component.
const ProductPicker = <TUpsertItem extends IHasProductUpsertItemModel<TUpsertItem>>
        ({ pickedItems, onPicked, ...props }: Props<TUpsertItem>) => {
    // Dependencies.
    const alertModalStore = useAlertModalStore();
    const productService = useProductService();
    const brandService = useBrandService();
    const productCategoryService = useProductCategoryService();

    // Model and states.
    const [model, setModel] = useState(() => {
        return new ProductListModel(undefined, { resultsPerPage: 7 });
    });
    const [isReloading, setReloading] = useState(false);

    // Effect.
    const loadAsync = async () => {
        try {
            if (props.isInitialLoading) {
                const responseDtos = await Promise.all([
                    productService.getListAsync(model.toRequestDto()),
                    productCategoryService.getAllAsync(),
                    brandService.getAllAsync()
                ]);

                setModel(model => model.fromResponseDtos(...responseDtos));
            } else {
                setReloading(true);
                const list = await productService.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(list));
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                await alertModalStore.getSubmissionErrorConfirmationAsync();
                return;
            }

            throw error;
        } finally {
            if (props.isInitialLoading) {
                props.onInitialLoadingFinished();
            }

            setReloading(false);
        }
    };

    useEffect(() => {
        loadAsync();
    }, [model.page, model.brandId, model.categoryId]);

    // Computed.
    const isReloadingClassName = isReloading ? "opacity-50 pe-none" : "";
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

    // Template.
    return (
        <MainBlock
            title="Sản phẩm"
            className="sticky-top"
            bodyPadding={[0, 2, 2, 2]}
            bodyClassName="row g-3"
        >
            <FormContext.Provider value={null}>
                {/* Product name search */}
                <div className={`col col-12 ${isReloadingClassName}`}>
                    <Label text="Tìm kiếm sản phẩm" />
                    <div className="input-group">
                        <TextInput
                            name="productName"
                            className="border-end-0"
                            placeholder="Tìm kiếm theo tên ..."
                            value={model.productName ?? ""}
                            onValueChanged={productName => setModel(model => model.from({
                                productName: productName || undefined
                            }))}
                        />

                        <button
                            type="button"
                            className="btn btn-primary flex-shrink-0"
                            style={{ width: "fit-content" }}
                            onClick={loadAsync}
                        >
                            <i className="bi bi-search" />
                        </button>
                    </div>
                </div>
    
                {/* Category options */}
                <div className={`col col-xl-6 col-lg-12 col-md-6 col-12
                                ${isReloadingClassName}`}>
                    <Label text="Phân loại" />
                    <SelectInput name="categoryId" options={categoryOptions}
                        value={model.categoryId?.toString() ?? ""}
                        onValueChanged={id => {
                            if (!id) {
                                setModel(model => model.from({ categoryId: undefined }));
                            } else {
                                const categoryId = parseInt(id);
                                setModel(model => model.from({ categoryId }));
                            }
                        }}
                    />
                </div>
    
                {/* Brand options */}
                <div className={`col col-xl-6 col-lg-12 col-md-6 col-12
                                ${isReloadingClassName}`}>
                    <Label text="Thương hiệu" />
                    <SelectInput
                        name="brandId"
                        options={brandOptions}
                        value={model.brandId?.toString() ?? ""}
                        onValueChanged={id => {
                            if (!id) {
                                setModel(model => model.from({ brandId: undefined }));
                            } else {
                                const brandId = parseInt(id);
                                setModel(model => model.from({ brandId }));
                            }
                        }}
                    />
                </div>
    
                {/* Product results */}
                <div className={`col col-12 ${isReloadingClassName}`}>
                    {/* Pagination */}
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
                <div className={`col col-12 ${isReloadingClassName}`}>
                    <Results
                        isReloading={isReloading}
                        productsModel={model.items}
                        productsModelResultsPerPage={model.resultsPerPage}
                        itemsModel={pickedItems}
                        onPicked={onPicked}
                    />
                </div>
            </FormContext.Provider>
        </MainBlock>
    );
};

export default ProductPicker;