import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useCustomerService } from "@/services/customerService";
import { CustomerListModel } from "@/models/customer/customerListModel";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
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
    const customerService = useMemo(() => useCustomerService(), []);
    const alertModelStore = useAlertModalStore();

    // Model and states.
    const {
        isInitialLoading,
        onInitialLoadingFinished,
        initialData,
        ValidationError
    } = useViewStates();

    const [model, setModel] = useState(() => new CustomerListModel(initialData.customer));
    const [isReloading, setReloading] = useState<boolean>(() => false);

    // Effect.
    useEffect(() => {
        loadListAsync().finally(() => {
            if (isInitialLoading) {
                onInitialLoadingFinished();
            }
        });
    }, [model.page]);

    // Callbacks.
    const loadListAsync = async () => {
        if (!isInitialLoading) {
            setReloading(true);
        }

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
    };

    const onSearchButtonClickedAsync = useCallback(async (): Promise<void> => {
        setModel(model => model.from({ page: 1 }));
        if (!model.searchByContent || model.searchByContent.length >= 3) {
            await loadListAsync();
        }
    }, [model]);

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3">
                {/* Search */}
                <div className="col col-12">
                    <Filters model={model} setModel={setModel}
                            loadListAsync={onSearchButtonClickedAsync} />
                </div>
    
                {/* Pagination */}
                {/* {paginationElement} */}
    
                {/* Results */}
                <div className="col col-12">
                    <div className={`block bg-white p-0 h-100 d-flex flex-column
                                    overflow-hidden rounded-3 border overflow-hidden
                                    ${styles["customerListBlock"]}`}>
                        <Results model={model.items} isInitialLoading={isInitialLoading}
                                isReloading={isReloading} />
                    </div>
                </div>
    
                {/* Pagination */}
                {model.pageCount > 0 && (
                    <div className="col col-12">
                        <MainPaginator page={model.page} pageCount={model.pageCount}
                                isReloading={isReloading}
                                onClick={page =>  setModel(model => model.from({ page }))} />
                    </div>
                )}
            </div>
        </MainContainer>
    );
};

export default CustomerListView;