import React, { useState, useEffect, useTransition } from "react";
import { Link } from "react-router-dom";
import { useExpenseService } from "@/services/expenseService";
import { ExpenseCategory } from "@/services/dtos/enums";
import { ExpenseListModel } from "@/models/expense/expenseListModel";
import type { ExpenseBasicModel } from "@/models/expense/expenseBasicModel";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Child component.
import Filters from "@/views/shared/hasStatsList/HasStatsListFiltersComponent";
import Results from "@/views/shared/hasStatsList/HasStatsListResultsComponent";

// Component.
const ExpenseListView = () => {
    // Dependencies.
    const expenseInitialData = useInitialDataStore(store => store.data.expense);
    const service = useExpenseService();

    // Model and states.
    const { isInitialRendering } = useViewStates();
    const initialModel = useAsyncModelInitializer({
        initializer: async () => {
            const responseDto = await service.getListAsync();
            return new ExpenseListModel(responseDto, expenseInitialData);
        },
        cacheKey: "expenseList"
    });
    const [model, setModel] = useState(() => initialModel);
    const [isReloading, setReloadingTransition] = useTransition();

    // Effect.
    useEffect(() => {
        if (!isInitialRendering) {
            setReloadingTransition(async () => {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            });
        }
    }, [model.page, model.sortingByAscending, model.sortingByField, model.monthYear]);

    return (
        <MainContainer>
            <div className="row g-3 justify-content-center">
                {/* Filter */}
                <div className="col col-12">
                    <Filters
                        resourceType="expense"
                        isReloading={isReloading}
                        model={model}
                        onModelChanged={(changedData) => {
                            setModel(model => model.from(changedData));
                        }}
                    />
                </div>

                {/* Results */}
                <div className="col col-12">
                    <Results
                        resourceType="expense"
                        model={model.items}
                        isReloading={isReloading}
                        render={(item, index) => <Item model={item} key={index} />}
                    />
                </div>

                {/* Pagination */}
                {model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <MainPaginator
                            isReloading={isReloading}
                            page={model.page}
                            pageCount={model.pageCount}
                            onClick={(page) => setModel(model => model.from({ page }))}
                        />
                    </div>
                )}
            </div>
        </MainContainer>
    );
};

const Item = ({ model }: { model: ExpenseBasicModel }) => {
    // Dependency.
    const amountUtility = useAmountUtility();

    // Computed.
    const computeIdClassName = (): string => {
        if (!model.isLocked) {
            return "bg-primary-subtle text-primary";
        }

        return "bg-danger-subtle text-danger";
    };

    const computeCategoryText = () => {
        switch (model.category) {
            case ExpenseCategory.Equipment:
                return "Trang thiết bị";
            case ExpenseCategory.Office:
                return "Thuê mặt bằng";
            case ExpenseCategory.Staff:
                return "Lương/thưởng";
            case ExpenseCategory.Utilities:
                return "Tiện ích";
            default:
                return "";
        }
    };

    return (
        <li className="list-group-item bg-transparent ps-3 p-2
                        d-flex align-items-center small">
            {/* Id */}
            <span className={`text-primary px-2 py-1 me-md-5 me-3 rounded small fw-bold
                            ${computeIdClassName()}`}>
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

                {/* Category */}
                <div className="col col-lg-3 col-md-12 col-12 justify-content-start ps-0
                                align-items-center mb-sm-0 mb-1">
                    <span className="text-primary px-1 rounded me-2">
                        <i className="bi bi-tag"></i>
                    </span>
                    <span>
                        {computeCategoryText()}
                    </span>
                </div>

                {/* StatsDate */}
                <div className="col col-lg-3 col-md-12 col-12 justify-content-start ps-0
                            d-xl-block d-lg-none d-md-none d-sm-none d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-calendar-week"></i>
                    </span>
                    <span>{model.statsDateTime.date}</span>
                </div>

                {/* StatsTime */}
                <div className="col col-lg-3 col-md-12 col-12 justify-content-start
                                ps-0 align-items-center d-xl-block d-lg-none
                                d-md-none d-sm-none d-none">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-clock"></i>
                    </span>
                    <span>{model.statsDateTime.time}</span>
                </div>

                {/* StatsDateTime */}
                <div className="col justify-content-start ps-0 d-xl-none d-lg-block d-block
                                align-items-center mb-sm-0 mb-1">
                    <span className="px-1 rounded text-primary me-2">
                        <i className="bi bi-calendar-week"></i>
                    </span>
                    <span>{model.statsDateTime.dateTime}</span>
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

export default ExpenseListView;