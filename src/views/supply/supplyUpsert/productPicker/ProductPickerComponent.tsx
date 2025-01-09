import React, { useState, useMemo, useEffect } from "react";
import { useProductService } from "@/services/productService";
import { useBrandService } from "@/services/brandService";
import { useProductCategoryService } from "@/services/productCategoryService";
import { ProductListModel } from "@/models/product/productListModel";
import { ProductBasicModel } from "@/models/product/productBasicModel";
import { ClonableArrayModel } from "@/models/arrayModel";
import { SupplyUpsertItemModel } from "@/models/supply/supplyItem/supplyUpsertItemModel";
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

// Type.
type SupplyItemsModel = ClonableArrayModel<SupplyUpsertItemModel>;

// Props.
interface Props {
    isInitialLoading: boolean;
    onInitialLoadingFinished(): void;
    value: ClonableArrayModel<SupplyUpsertItemModel>;
    onValueChanged(value: SupplyItemsModel): void;
}

// Component.
const ProductPicker = ({ value, onValueChanged, ...props }: Props) => {
    // Dependencies.
    const alertModalStore = useAlertModalStore();
    const productService = useMemo(useProductService, []);
    const brandService = useMemo(useBrandService, []);
    const productCategoryService = useMemo(useProductCategoryService, []);

    // Model and states.
    const [model, setModel] = useState(() => {
        return new ProductListModel(undefined, { resultsPerPage: 7 });
    });
    const [isReloading, setReloading] = useState(false);

    // Effect.
    useEffect(() => {
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
            }
        };

        loadAsync().finally(() => {
            if (props.isInitialLoading) {
                props.onInitialLoadingFinished();
            }

            setReloading(false);
        });
    }, [model.page, model.brandId, model.categoryId]);

    // Computed.
    const className = isReloading ? "opacity-50 pe-none" : "";
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
    const handlePicked = (product: ProductBasicModel) => {
        const index = value.findIndex(i => i.product.id === product.id);
        if (index >= 0) {
            onValueChanged(value.from(index, { quantity: value[index].quantity + 1 }));
        } else {
            onValueChanged(value.add(new SupplyUpsertItemModel(product)));
        }
    };

    const handleQuantityIncremented = (product: ProductBasicModel) => {
        const index = value.findIndex(i => i.product.id === product.id);
        const quantity = value[index].quantity + 1;
        onValueChanged(value.from(index, { quantity }));
    };

    const handlePreviousPageButtonClicked = () => {
        setModel(model => model.from({ page: model.page - 1 }));
    };

    const handleNextPageButtonClicked = () => {
        setModel(model => model.from({ page: model.page + 1 }));
    };

    // Template.
    return (
        <MainBlock title="Sản phẩm"
                className="sticky-top"
                bodyPadding={[0, 2, 2, 2]}
                bodyClassName={`row g-3 ${className}`}>
            <FormContext.Provider value={null}>
                {/* Product name search */}
                <div className="col col-12">
                    <Label text="Tìm kiếm sản phẩm" />
                    <TextInput name="productName"
                        placeholder="Tìm kiếm theo tên ..."
                        value={model.productName ?? ""}
                        onValueChanged={productName => setModel(model => model.from({
                            productName: productName || undefined
                        }))}
                    />
                </div>
    
                {/* Category options */}
                <div className="col col-xl-6 col-lg-12 col-md-6 col-sm-12 col-12">
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
                <div className="col col-xl-6 col-lg-12 col-md-6 col-sm-12 col-1">
                    <Label text="Thương hiệu" />
                    <SelectInput name="brandId" options={brandOptions}
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
                <div className="col col-12">
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
                <div className="col col-12">
                    <Results isInitialLoading={props.isInitialLoading}
                        isReloading={isReloading}
                        productsModel={model.items}
                        productsModelResultsPerPage={model.resultsPerPage}
                        supplyItemsModel={value}
                        onPicked={handlePicked}
                        onQuantityIncremented={handleQuantityIncremented}
                    />
                </div>
            </FormContext.Provider>
        </MainBlock>
    );
};

export default ProductPicker;