import React, { useState, useMemo, useEffect } from "react";
import { SupplyListModel } from "@/models/supply/supplyListModel";
import { useSupplyService } from "@/services/supplyService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError } from "@/errors";

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
    const alertModalStore = useAlertModalStore();
    const service = useMemo(useSupplyService, []);

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished, initialData } = useViewStates();
    const [isReloading, setReloading] = useState<boolean>(false);
    const [model, setModel] = useState(() => {
        return new SupplyListModel(initialData.supply.listSortingOptions);
    });

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                if (isInitialLoading) {
                    const list = await service.getListAsync(model.toRequestDto());
                    const monthYearOptions = initialData.supply.listMonthYearOptions;
                    const canCreate = initialData.supply.creatingPermission;

                    setModel(model => {
                        return model.fromResponseDtos(list, monthYearOptions, canCreate);
                    });
                } else {
                    setReloading(true);
                    const responseDto = await service.getListAsync(model.toRequestDto());
                    setModel(model => model.fromListResponseDto(responseDto));
                }

                document.getElementById("content")?.scrollTo({ top: 0, behavior: "smooth" });
            } catch (error) {
                if (error instanceof ValidationError) {
                    await alertModalStore.getSubmissionErrorConfirmationAsync();
                    return;
                }

                throw error;
            }
        };

        loadAsync().finally(() => {
            if (isInitialLoading) {
                onInitialLoadingFinished();
            }

            setReloading(false);
        });

    }, [model.page, model.sortingByAscending, model.sortingByField, model.monthYear]);

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3 p-0 justify-content-center">
                {/* Filter */}
                <div className="col col-12">
                    <HasStatsListFilters
                        resourceType="supply"
                        isReloading={isReloading}
                        model={model}
                        onMonthYearChanged={monthYear => {
                            setModel(model => model.from({ monthYear }));
                        }}
                        onSortingByFieldChanged={sortingByField => {
                            setModel(model => model.from({ sortingByField }));
                        }}
                        onSortingByAscendingChanged={sortingByAscending => {
                            setModel(model => model.from({ sortingByAscending }));
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