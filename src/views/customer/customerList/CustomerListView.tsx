import React, { useState, useCallback, useEffect, startTransition } from "react";
import { useCustomerService } from "@/services/customerService";
import { CustomerListModel } from "@/models/customer/customerListModel";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { ValidationError } from "@/errors";
import * as styles from "./CustomerListView.module.css";

// Layout components.
import MainContainer from "../../layouts/MainContainerComponent";
import MainPaginator from "../../layouts/MainPaginatorComponent";

// Child components.
import Filters from "./FiltersComponent";
import Results from "./ResultsComponent";

// Component.
const CustomerListView = () => {
    // Dependencies.
    const alertModelStore = useAlertModalStore();
    const customerService = useCustomerService();
    const initialData = useInitialDataStore(store => store.data);

    // Model and states.
    const { isInitialRendering } = useViewStates();
    const initializedModel = useAsyncModelInitializer({
        initializer: async () => {
            const model = new CustomerListModel(initialData.customer);
            const responseDto = await customerService.getListAsync();
            return model.fromListResponseDto(responseDto);
        },
        cacheKey: "customerList"
    });
    const [model, setModel] = useState(() => initializedModel);
    const [isReloading, setReloading] = useState<boolean>(() => false);

    // Effect.
    useEffect(() => {
        if (!isInitialRendering) {
            reload();
        }
    }, [
        model.page,
        model.sortingByField,
        model.sortingByAscending,
        model.hasRemainingDebtAmountOnly
    ]);

    // Callbacks.
    const reload = () => {
        setReloading(true);
        startTransition(async () => {
            try {
                const responseDto = await customerService.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
                document.getElementById("content")?.scrollTo({ top: 0, behavior: "smooth" });
            } catch (error) {
                if (error instanceof ValidationError) {
                    await alertModelStore.getSubmissionErrorConfirmationAsync();
                    return;
                }
    
                throw error;
            } finally {
                setReloading(false);
            }
        });
    };

    const onSearchButtonClickedAsync = useCallback(async (): Promise<void> => {
        setModel(model => model.from({ page: 1 }));
        if (!model.searchByContent || model.searchByContent.length >= 3) {
            reload();
        }
    }, [model]);
    return (
        <MainContainer>
            <div className="row g-3">
                {/* Search */}
                <div className="col col-12">
                    <Filters
                        model={model}
                        setModel={setModel}
                        loadListAsync={onSearchButtonClickedAsync}
                    />
                </div>
    
                {/* Pagination */}
                {/* {paginationElement} */}
    
                {/* Results */}
                <div className="col col-12">
                    <div className={`block bg-white p-0 h-100 d-flex flex-column
                                    overflow-hidden rounded-3 border overflow-hidden
                                    ${styles["customerListBlock"]}`}>
                        <Results model={model.items} isReloading={isReloading} />
                    </div>
                </div>
    
                {/* Pagination */}
                {model.pageCount > 0 && (
                    <div className="col col-12">
                        <MainPaginator
                            page={model.page}
                            pageCount={model.pageCount}
                            isReloading={isReloading}
                            onClick={page =>  setModel(model => model.from({ page }))}
                        />
                    </div>
                )}
            </div>
        </MainContainer>
    );
};

export default CustomerListView;