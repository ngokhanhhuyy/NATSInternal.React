import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useConsultantService } from "@/services/consultantService";
import { ConsultantListModel } from "@/models/consultant/consultantListModel";
import type { ConsultantBasicModel } from "@/models/consultant/consultantBasicModel";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAmountUtility } from "@/utilities/amountUtility";
import { ValidationError } from "@/errors";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Child components.
import Filters from "@/views/shared/hasStatsList/HasStatsListFiltersComponent";
import Results from "@/views/shared/hasStatsList/HasStatsListResultsComponent";

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
                        onChanged={(changedData) => {
                            setModel(model => model.from(changedData));
                        }}
                    />
                </div>
    
                {/* Results */}
                <div className="col col-12">
                    <Results
                        resourceType="consultant"
                        model={model.items}
                        isReloading={isReloading}
                        render={(item, index) => <ResultsItem model={item} key={index} />}
                    />
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

const ResultsItem = ({ model }: { model: ConsultantBasicModel }) => {
    // Dependency.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const computeClassName = () => {
        if (!model.isLocked) {
            return "bg-primary-subtle text-primary";
        }

        return "bg-danger-subtle text-danger";
    };

    return (
        <li className="list-group-item bg-transparent ps-3 p-2
                        d-flex align-items-center small">
            {/* Id */}
            <span className={`text-primary px-2 py-1 me-lg-3 me-md-2 me-3 rounded small
                            fw-bold ${computeClassName()}`}>
                #{model.id}
            </span>

            {/* Detail */}
            <div className="row gx-3 flex-fill">
                {/* Amount */}
                <div className="col col-md-3 col-12 justify-content-start ps-0
                                align-items-center mb-sm-0 mb-1">
                    <span className="text-primary px-1 rounded me-2">
                        <i className="bi bi-cash-coin"></i>
                    </span>
                    <span>
                        {amountUtility.getDisplayText(model.amount)}
                    </span>
                </div>

                {/* PaidDate */}
                <div className="col col-lg-3 col-md-12 col-12
                                justify-content-start ps-0 d-xl-block d-lg-none
                                d-md-none d-sm-none d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-calendar-week"></i>
                    </span>
                    <span>{model.statsDateTime.date}</span>
                </div>

                {/* PaidTime */}
                <div className="col col-lg-3 col-md-12 col-12 ps-0
                                justify-content-start align-items-center
                                d-xl-block d-lg-none d-md-none d-sm-none d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-clock"></i>
                    </span>
                    <span>{model.statsDateTime.time}</span>
                </div>

                {/* StatsDateTime */}
                <div className="col col-md-auto col-12 justify-content-start
                                ps-0 d-xl-none d-lg-block d-block
                                align-items-center mb-sm-0 mb-1">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-calendar-week"></i>
                    </span>
                    <span>{model.statsDateTime.dateTime}</span>
                </div>

                {/* Customer */}
                <div className="col col-md col-12 justify-content-start
                                ps-0 align-items-center mb-sm-0 mb-1 ms-md-3 ms-0">
                        <span className="px-1 rounded text-primary me-2">
                            <i className="bi bi-person-circle"></i>
                        </span>
                    <Link to={model.customer.detailRoute}>
                        {model.customer.fullName}
                    </Link>
                </div>
            </div>

            {/* Action button */}
            <Link to={model.detailRoute}
                    className="btn btn-outline-primary btn-sm flex-shrink-0 mx-2">
                <i className="bi bi-info-circle"></i>
            </Link>
        </li>
    );
};

export default ConsultantListView;