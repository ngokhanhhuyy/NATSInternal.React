import { useState, useEffect, useTransition } from "react";
import { ProductListModel } from "@/models/product/productListModel";
import { useProductService } from "@/services/productService";

// Layout component.
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Child components.
import Filters from "./FiltersComponent";
import Results from "./ResultsComponent";

// Props.
interface MainListProps {
    initialModel: ProductListModel;
    isInitialRendering: boolean;
}

// Component.
const MainList = (props: MainListProps) => {
    // Dependencies.
    const productService = useProductService();

    // Model and states.
    const [model, setModel] = useState(() => props.initialModel);
    const [isReloading, startReloadingTransition] = useTransition();

    // Effect.
    useEffect(() => {
        if (!props.isInitialRendering) {
            reload();
        }
    }, [model.page, model.brandId, model.categoryId]);

    // Callbacks.
    const reload = (): void => {
        startReloadingTransition(async () => {
            const responseDto = await productService.getListAsync(model.toRequestDto());
            setModel(model => model.fromListResponseDto(responseDto));
            document.getElementById("content")!.scrollTo({ top: 0, behavior: "smooth" });
        });
    };

    return (
        <div className="row g-3 justify-content-end">
            {/* Pagination */}
            <div className="col col-12">
                <Filters
                    isReloading={isReloading}
                    model={model}
                    onModelChanged={(changedData) => {
                        setModel(model => model.from(changedData));
                    }}
                />
            </div>

            {/* Results */}
            <div className="col col-12">
                <Results
                    isReloading={isReloading}
                    model={model.items}
                    isInitialLoading={props.isInitialRendering}
                />
            </div>

            {/* Pagination */}
            {(model.pageCount > 1 && !isReloading) && (
                <div className="col col-12 d-flex flex-row justify-content-center">
                    <MainPaginator
                        page={model.page}
                        pageCount={model.pageCount}
                        isReloading={isReloading}
                        onClick={(page) => setModel(model => model.from({ page }))}
                    />
                </div>
            )}
        </div>
    );
};

export default MainList;