import React, { useState, useRef, useEffect, useTransition } from "react";
import { useCustomerService } from "@/services/customerService";
import { CustomerListModel } from "@/models/customer/customerListModel";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { ValidationError } from "@/errors";
import * as styles from "./CustomerListView.module.css";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

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
            const responseDto = await customerService.getListAsync();
            return new CustomerListModel(responseDto, initialData.customer);
        },
        cacheKey: "customerList"
    });
    const [model, setModel] = useState(() => initializedModel);
    const [isReloading, startReloadingTransition] = useTransition();
    const debouncingTimeoutId = useRef<number | null>(null);

    // Effect.
    useEffect(() => {
        if (!isInitialRendering) {
            startReloadingTransition(async () => {
                    window.clearTimeout(debouncingTimeoutId.current ?? undefined);
                    debouncingTimeoutId.current = null;

                await new Promise<void>(resolve => {
                    debouncingTimeoutId.current = window.setTimeout(async () => {
                        const responseDto = await customerService
                            .getListAsync(model.toRequestDto());
                        setModel(model => model.fromListResponseDto(responseDto));
                        document.getElementById("content")
                            ?.scrollTo({ top: 0, behavior: "smooth" });
                        resolve();
                    }, 300);
                });
            });
        }
    }, [
        model.page,
        model.sortingByField,
        model.sortingByAscending,
        model.hasRemainingDebtAmountOnly,
        model.searchByContent
    ]);

    return (
        <MainContainer>
            <div className="row g-3">
                {/* Search */}
                <div className="col col-12">
                    <Filters
                        isReloading={isReloading}
                        model={model}
                        onModelChanged={changedData => {
                            setModel(model => model.from(changedData));
                        }}
                    />
                </div>
    
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
                            onClick={page => setModel(model => model.from({ page }))}
                        />
                    </div>
                )}
            </div>
        </MainContainer>
    );
};

export default CustomerListView;