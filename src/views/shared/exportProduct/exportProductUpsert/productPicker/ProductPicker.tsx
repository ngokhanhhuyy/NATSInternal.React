import React, { useState, useMemo, useEffect } from "react";
import type { ProductBasicModel } from "@/models/product/productBasicModel";
import { ProductListModel } from "@/models/product/productListModel";
import { useProductService } from "@/services/productService";
import { useProductCategoryService } from "@/services/productCategoryService";
import { useBrandService } from "@/services/brandService";
import type { IModelState } from "@/hooks/modelStateHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError } from "@/errors";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form components.
import { FormContext } from "@/views/form/FormComponent";
import Label from "@/views/form/LabelComponent";
import SelectInput, { type SelectInputOption } from "@/views/form/SelectInputComponent";

// Child components.
import Paginator from "./PaginatorComponent";
import Results from "./ResultsComponent";

// Props.
interface ExportProductPickerProps<
        TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>> {
    modelState: IModelState;
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
    pickedItems: TUpsertItem[];
    onPicked: (product: ProductBasicModel) => void;
    onUnpicked: (index: number) => void;
}

// Component.
const ExportProductPicker = <TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>>
        (props: ExportProductPickerProps<TUpsertItem>) =>
{
    // Dependencies.
    const getNotFoundConfirmationAsync = useAlertModalStore(store => {
        return store.getNotFoundConfirmationAsync;
    });
    const productInitialData = useInitialDataStore(store => store.data.product);
    const productService = useMemo(useProductService, []);
    const productCategoryService = useMemo(useProductCategoryService, []);
    const brandService = useMemo(useBrandService, []);

    // Model and states.
    const [model, setModel] = useState(() => {
        return new ProductListModel(productInitialData, { resultsPerPage: 10 });
    });
    const [isReloading, setReloading] = useState<boolean>(() => false);

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                if (props.isInitialLoading) {
                    const responseDtos = await Promise.all([
                        productService.getListAsync(model.toRequestDto()),
                        brandService.getAllAsync(),
                        productCategoryService.getAllAsync()
                    ]);
                    setModel(model => model.fromResponseDtos(...responseDtos));
                } else {
                    setReloading(true);
                    const list = await productService.getListAsync(model.toRequestDto());
                    setModel(model => model.fromListResponseDto(list));
                }
            } catch (error) {
                if (error instanceof ValidationError) {
                    await getNotFoundConfirmationAsync();
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
    const categoryOptions: SelectInputOption[] = [
        { value: "", displayName: "Tất cả phân loại" },
        ...model.categoryOptions?.map(option => ({
            value: option.id.toString(),
            displayName: option.name
        })) ?? []
    ];

    const brandOptions: SelectInputOption[] = [
        { value: "", displayName: "Tất cả thương hiệu" },
        ...model.brandOptions?.map(option => ({
            value: option.id.toString(),
            displayName: option.name
        })) ?? []
    ];

    return (
        <MainBlock
            title="Chọn sản phẩm"
            bodyPadding={[0, 2, 2, 2]}
            bodyClassName={isReloading ? "opacity-50 pe-none" : ""}
        >
            {/* Search and list */}
            <FormContext.Provider value={null}>
                <div className="row g-3">
                    {/* Category */}
                    <div className="col col-xl-6 col-lg-12 col-md-6 col-12">
                        <Label text="Phân loại" />
                        <SelectInput name="categoryId"
                            options={categoryOptions}
                            value={model.categoryId?.toString() ?? ""}
                            onValueChanged={categoryIdAsString => {
                                const categoryId = categoryIdAsString
                                    ? parseInt(categoryIdAsString)
                                    : undefined;
                                setModel(model => model.from({ categoryId }));
                            }}
                        />
                    </div>

                    {/* Brand */}
                    <div className="col col-xl-6 col-lg-12 col-md-6 col-12">
                        <Label text="Thương hiệu" />
                        <SelectInput name="categoryId"
                            options={brandOptions}
                            value={model.brandId?.toString() ?? ""}
                            onValueChanged={brandIdAsString => {
                                const brandId = brandIdAsString
                                    ? parseInt(brandIdAsString)
                                    : undefined;
                                setModel(model => model.from({ brandId }));
                            }}
                        />
                    </div>
                </div>
            </FormContext.Provider>

            <div className="row g-3">
                {/* Paginator */}
                {model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <Paginator
                            page={model.page}
                            pageCount={model.pageCount}
                            onClick={(page) => {
                                setModel(model => model.from({ page }));
                            }}
                        />
                    </div>
                )}

                {/* Results */}
                <div className="col col-12">
                    <Results
                        isReloading={isReloading}
                        productListModel={model.items}
                        pickedItemsListModel={props.pickedItems}
                        onPicked={props.onPicked}
                    />
                </div>
            </div>
        </MainBlock>
    );
};

export default ExportProductPicker;