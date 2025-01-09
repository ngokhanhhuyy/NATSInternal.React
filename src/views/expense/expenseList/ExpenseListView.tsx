import React, { useState, useMemo, useEffect } from "react";
import { useExpenseService } from "@/services/expenseService";
import { ExpenseListModel } from "@/models/expense/expenseListModel";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { ValidationError } from "@/errors";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Child component.
import Filters from "@/views/shared/hasStatsList/HasStatsListFiltersComponent";
import Results from "./ResultsComponent";

// Component.
const ExpenseListView = () => {
    // Dependencies.
    const alertModalStore = useAlertModalStore();
    const initialData = useInitialDataStore(store => store.data);
    const service = useMemo(useExpenseService, []);

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [isReloading, setReloading] = useState<boolean>(() => false);
    const [model, setModel] = useState(() => new ExpenseListModel(initialData.expense));

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                if (!isInitialLoading) { 
                    setReloading(true);
                }
                
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
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
            <div className="row g-3 justify-content-center">
                {/* Filter */}
                <div className="col col-12">
                    <Filters
                        resourceType="expense"
                        isReloading={isReloading}
                        model={model}
                        setModel={setModel}
                    />
                </div>

                {/* Results */}
                <div className="col col-12">
                    <Results model={model.items} isReloading={isReloading} />
                </div>

                {/* Pagination */}
                {model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <MainPaginator
                            isReloading={isReloading}
                            page={model.page}
                            pageCount={model.pageCount}
                            onClick={(page) => setModel(model => model.from({ page }))} />
                    </div>
                )}
            </div>
        </MainContainer>
    );
};

export default ExpenseListView;