import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductListModel } from "@/models/product/productListModel";
import { useProductService } from "@/services/productService";
import { useBrandService } from "@/services/brandService";
import { useProductCategoryService } from "@/services/productCategoryService";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useModelState } from "@/hooks/modelStateHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError } from "@/errors";

// Layout component.
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Child components.
import Filters from "./FiltersComponent";
import Results from "./ResultsComponent";

// Props.
interface MainListProps {
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
}

// Component.
const MainList = ({ isInitialLoading, onInitialLoadingFinished }: MainListProps) => {
    // Dependencies.
    const productService = useProductService();
    const brandService = useBrandService();
    const productCategoryService = useProductCategoryService();
    const productInitialResponseDto = useInitialDataStore(store => store.data.product);
    const alertModalStore = useAlertModalStore();
    const navigate = useNavigate();

    // Model and states.
    const [model, setModel] = useState(() => new ProductListModel(productInitialResponseDto));
    const modelState = useModelState();
    const [isReloading, setReloading] = useState<boolean>(false);

    // Effect.
    useEffect(() => {
        const fetchDataAsync = async (): Promise<void> => {
            try {
                if (isInitialLoading) {
                    const responseDtos = await Promise.all([
                        productService.getListAsync(model.toRequestDto()),
                        brandService.getAllAsync(),
                        productCategoryService.getAllAsync()
                    ]);
                    setModel(model => model.fromResponseDtos(...responseDtos));
                    return;
                }

                setReloading(true);
                document.getElementById("content")!.scrollTo(0, 0);
                const responseDto = await productService.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            } catch (error) {
                if (error instanceof ValidationError) {
                    await alertModalStore.getSubmissionErrorConfirmationAsync();
                    if (isInitialLoading) {
                        await navigate(-1);
                    }
                    return;
                }

                throw error;
            } finally {
                if (isInitialLoading) {
                    onInitialLoadingFinished();
                }

                setReloading(false);
            }
        };

        fetchDataAsync().then();
    }, [model.page, model.brandId, model.categoryId]);

    const onPageButtonClicked = useCallback(async (page: number) => {
        setModel(model => model.from({ page }));
    }, []);

    return (
        <div className="row g-3 justify-content-end">
            {/* Pagination */}
            <div className="col col-12">
                <Filters model={model} setModel={setModel} modelState={modelState}
                        isReloading={isReloading} />
            </div>

            {/* Results */}
            <div className="col col-12">
                <Results model={model.items} isInitialLoading={isInitialLoading}
                        isReloading={isReloading} />
            </div>

            {/* Pagination */}
            {(model.pageCount > 1 && !isInitialLoading && !isReloading) && (
                <div className="col col-12 d-flex flex-row justify-content-center">
                    <MainPaginator page={model.page} pageCount={model.pageCount}
                            isReloading={isReloading}
                            onClick={onPageButtonClicked} />
                </div>
            )}
        </div>
    );
};

export default MainList;