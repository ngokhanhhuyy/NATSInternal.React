import React, { useState, useEffect } from "react";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError } from "@/errors";

// Layout component.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Shared computed.
import HasStatsListFilters from "../../hasStatsList/HasStatsListFiltersComponent";
import ExportProductListResults from "./ExportProductListResultsComponent";

// Props.
interface ExportProductListViewProps<
        TList extends
            IExportProductListModel<TList, TBasic, TAuthorization> &
            IClonableModel<TList>,
        TBasic extends IHasCustomerBasicModel<TAuthorization>,
        TAuthorization extends IHasStatsExistingAuthorizationModel> {
    resourceType: string;
    initializeModel: (initialData: ResponseDtos.InitialData) => TList;
    getListAsync: (
        model: TList,
        setModel: React.Dispatch<React.SetStateAction<TList>>) => Promise<void>;
}

// Component.
const ExportProductListView = <
            TList extends
                IExportProductListModel<TList, TBasic, TAuthorization> &
                IClonableModel<TList>,
            TBasic extends IHasCustomerBasicModel<TAuthorization>,
            TAuthorization extends IHasStatsExistingAuthorizationModel>
        (props: ExportProductListViewProps<TList, TBasic, TAuthorization>) => {
    const { resourceType, initializeModel, getListAsync } = props;

    // Dependencies.
    const getSubmissionErrorConfirmationAsync = useAlertModalStore(store => {
        return store.getSubmissionErrorConfirmationAsync;
    });

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished, initialData } = useViewStates();
    const [model, setModel] = useState(() => initializeModel(initialData));
    const [isReloading, setReloading] = useState<boolean>(() => false);

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                if (!isInitialLoading) {
                    setReloading(true);
                }
                
                await getListAsync(model, setModel);
            } catch (error) {
                if (error instanceof ValidationError) {
                    await getSubmissionErrorConfirmationAsync();
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
    }, [model.page, model.monthYear, model.sortingByField, model.sortingByAscending]);

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3 justify-content-center">
                {/* Filter */}
                <div className="col col-12">
                    <HasStatsListFilters
                        resourceType={resourceType}
                        isReloading={isReloading}
                        model={model}
                        setModel={setModel}
                    />
                </div>

                {/* Results */}
                <div className="col col-12">
                    <ExportProductListResults
                        resourceType={resourceType}
                        model={model.items}
                        isReloading={isReloading}
                    />
                </div>

                {/* Pagination */}
                {model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <MainPaginator
                            isReloading={isReloading}
                            page={model.page}
                            pageCount={model.pageCount}
                            onClick={(page) => {
                                setModel(model => model.from({ page } as Partial<TList>));
                            }}
                        />
                    </div>
                )}
            </div>
        </MainContainer>
    );
};

export default ExportProductListView;