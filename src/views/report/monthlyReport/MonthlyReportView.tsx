import React, { useRef, useState, useEffect } from "react";
import { MonthlyReportModel } from "@/models/report/ReportModel";
import { useStatsService } from "@/services/statsService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError, NotFoundError } from "@/errors";

// Shared component.
import ReportView from "../report/ReportView";

// Child component.
import Filters from "./FiltersComponent";
import FinanceAreaGraph from "@/views/report/monthlyReport/FinanceAreaGraphComponent";

// Component.
const MonthlyReportView = () => {
    // Dependencies.
    const alertModelStore = useAlertModalStore();
    const service = useStatsService();

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [model, setModel] = useState<MonthlyReportModel>(() => new MonthlyReportModel());
    const isAdjustingAfterFirstLoading = useRef<boolean>(false);
    const [isReloading, setReloading] = useState<boolean>(() => false);

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                if (isInitialLoading) {
                    const [monthlyDetail, dateOptions] = await Promise.all([
                        service.getMonthlyDetailAsync(),
                        service.getStatsDateOptionsAsync()
                    ]);
    
                    setModel(model => model
                        .fromMonthlyDetail(monthlyDetail)
                        .fromDateOptions(dateOptions));
                    isAdjustingAfterFirstLoading.current = true;
                } else {
                    if (isAdjustingAfterFirstLoading.current) {
                        isAdjustingAfterFirstLoading.current = false;
                        return;
                    }

                    setReloading(true);
                    const [year, month] = model.recordedMonthYear;
                    const monthlyDetail = await service.getMonthlyDetailAsync({
                        recordedYear: year,
                        recordedMonth: month
                    });
    
                    setModel(model => model.fromMonthlyDetail(monthlyDetail));
                }
            } catch (error) {
                if (error instanceof ValidationError) {
                    await alertModelStore.getSubmissionErrorConfirmationAsync();
                    return;
                }

                if (error instanceof NotFoundError) {
                    await alertModelStore.getNotFoundConfirmationAsync();
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
    }, [model.recordedMonthYear]);

    if (!model.stats) {
        return null;
    }

    return (
        <ReportView
            model={model.stats}
            isInitialLoading={isInitialLoading}
            isReloading={isReloading}
            renderTop={(statsModel, groupLabelColumnClassName) => (
                <div className="row g-3">
                    <div className="col col-12">
                        <Filters model={model} setModel={setModel} isReloading={isReloading} />
                    </div>

                    <div className={`${groupLabelColumnClassName} mt-3`}>
                        {"Biểu đồ".toUpperCase()}
                    </div>

                    <div className="col col-12">
                        <FinanceAreaGraph
                            model={statsModel.dailyStats}
                            isReloading={isReloading}
                        />
                    </div>
                </div>
            )}
        />
    );
};

export default MonthlyReportView;