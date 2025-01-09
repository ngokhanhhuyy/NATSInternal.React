import React, { useState, useMemo, useEffect } from "react";
import { useConsultantService } from "@/services/consultantService";
import { ConsultantListModel } from "@/models/consultant/consultantListModel";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useViewStates } from "@/hooks/viewStatesHook";
import { ValidationError } from "@/errors";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Child components.
import Filters from "@/views/shared/hasStatsList/HasStatsListFiltersComponent";
import Results from "./ResultsComponent";

const ConsultantListView = () => {
    // Dependencies.
    const alertModalStore = useAlertModalStore();
    const service = useMemo(useConsultantService, []);
    
    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished, initialData } = useViewStates();
    const [isReloading, setReloading] = useState<boolean>(false);
    const [model, setModel] = useState(() => new ConsultantListModel(initialData.consultant));

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                if (isInitialLoading) {
                    const list = await service.getListAsync(model.toRequestDto());
                    const monthYearOptions = initialData.consultant.listMonthYearOptions;
                    const canCreate = initialData.consultant.creatingPermission;

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
                    await alertModalStore.getSubmissionErrorConfirmationAsync(error.errors);
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
    }, [model.page, model.monthYear, model.sortingByAscending, model.sortingByField]);

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3 justify-content-center">
                {/* Filter */}
                <div className="col col-12">
                    <Filters
                        resourceType="consultant"
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
    
                {/* Bottom pagination */}
                {model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <MainPaginator page={model.page} pageCount={model.pageCount}
                            isReloading={isReloading}
                            onClick={page => setModel(model => model.from({ page }))}
                        />
                    </div>
                )}
            </div>
        </MainContainer>
    );
};

export default ConsultantListView;