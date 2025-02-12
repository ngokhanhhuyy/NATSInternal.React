import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError } from "@/errors";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Shared components.
import HasStatsListFilters from "@/views/shared/hasStatsList/HasStatsListFiltersComponent";
import HasStatsListResults from "@/views/shared/hasStatsList/HasStatsListResultsComponent";

// Child component.
import ResultsItem from "./ResultsItemComponent";

// Props.
interface Props<
        TListModel extends IHasStatsListModel<TListModel, TBasicModel, TAuthorizationModel>,
        TBasicModel extends IDebtBasicModel<TAuthorizationModel>,
        TAuthorizationModel extends IHasStatsExistingAuthorizationModel> {
    resourceType: "debtIncurrence" | "debtPayment";
    initializeModel(initialData: ResponseDtos.InitialData): TListModel;
    loadAsync(
        model: TListModel,
        setModel: React.Dispatch<React.SetStateAction<TListModel>>): Promise<void>;
}

// Components.
const DebtListView = <
            TListModel extends IHasStatsListModel<
                TListModel,
                TBasicModel,
                TAuthorizationModel>,
            TBasicModel extends IDebtBasicModel<TAuthorizationModel>,
            TAuthorizationModel extends IHasStatsExistingAuthorizationModel>
        (props: Props<TListModel, TBasicModel, TAuthorizationModel>) => {
    // Dependencies.
    const initialData = useInitialDataStore(store => store.data);
    const getSubmissionErrorConfirmationAsync = useAlertModalStore(store => {
        return store.getSubmissionErrorConfirmationAsync;
    });
    const navigate = useNavigate();

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [model, setModel] = useState<TListModel>(() => {
        return props.initializeModel(initialData);
    });
    const [isReloading, setReloading] = useState<boolean>(() => false);

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            if (!isInitialLoading) {
                setReloading(true);
            }
    
            try {
                await props.loadAsync(model, setModel);
                document.getElementById("content")?.scrollTo({ top: 0, behavior: "smooth" });
            } catch (error) {
                if (error instanceof ValidationError) {
                    await getSubmissionErrorConfirmationAsync();
                    await navigate(-1);
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
            <div className="row g-3">
                <div className="col col-12">
                    <HasStatsListFilters
                        resourceType={props.resourceType}
                        isReloading={isReloading}
                        model={model}
                        onChanged={(changedData) => {
                            setModel(model => model.from(changedData as Partial<TListModel>));
                        }}
                    />
                </div>
            
                <div className="col col-12">
                    <HasStatsListResults
                        resourceType={props.resourceType}
                        model={model.items}
                        isReloading={isReloading}
                        render={(item) => <ResultsItem model={item} key={item.id} />}
                    />
                </div>
    
                {/* Pagination */}
                <div className="col col-12 d-flex flex-row justify-content-center">
                    <MainPaginator
                        page={model.page}
                        pageCount={model.pageCount}
                        onClick={(page) => {
                            setModel(model => model.from({ page } as Partial<TListModel>));
                        }}
                        isReloading={isReloading}
                    />
                </div>
            </div>
        </MainContainer>
    );
};

export default DebtListView;