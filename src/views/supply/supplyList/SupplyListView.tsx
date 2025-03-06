import { useState, useEffect, useTransition } from "react";
import { SupplyListModel } from "@/models/supply/supplyListModel";
import { useSupplyService } from "@/services/supplyService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useInitialDataStore } from "@/stores/initialDataStore";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Shared component.
import HasStatsListFilters from "@/views/shared/hasStatsList/HasStatsListFiltersComponent";

// Child components.
import Results from "../supplyList/ResultsComponent";

// Component.
const SupplyListView = () => {
    // Dependencies.
    const service = useSupplyService();
    const supplyInitialData = useInitialDataStore(store => store.data.supply);

    // Model and states.
    const { isInitialRendering } = useViewStates();
    const initialModel = useAsyncModelInitializer({
        initializer: async () => {
            const responseDto = await service.getListAsync();
            return new SupplyListModel(responseDto, supplyInitialData);
        },
        cacheKey: "supplyList"
    });
    const [model, setModel] = useState(() => initialModel);
    const [isReloading, startReloadingTransition] = useTransition();

    // Effect.
    useEffect(() => {
        if (!isInitialRendering) {
            startReloadingTransition(async () => {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            });
        }
    }, [model.page, model.sortingByAscending, model.sortingByField, model.monthYear]);

    return (
        <MainContainer>
            <div className="row g-3 p-0 justify-content-center">
                {/* Filter */}
                <div className="col col-12">
                    <HasStatsListFilters
                        resourceType="supply"
                        isReloading={isReloading}
                        model={model}
                        onModelChanged={(changedData) => {
                            setModel(model => model.from(changedData));
                        }}
                    />
                </div>
    
                {/* Results */}
                <div className="col col-12">
                    <Results model={model.items} isReloading={isReloading} />
                </div>
    
                {/* Pagination */}
                {model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <MainPaginator page={model.page}
                            pageCount={model.pageCount}
                            isReloading={isReloading}
                            onClick={page => setModel(model => model.from({ page }))}
                        />
                    </div>
                )}
            </div>
        </MainContainer>
    );
};

export default SupplyListView;