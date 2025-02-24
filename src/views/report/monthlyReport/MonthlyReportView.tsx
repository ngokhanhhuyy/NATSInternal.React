import React, { useState, useEffect } from "react";
import { MonthlyReportModel } from "@/models/report/ReportModel";
import { useStatsService } from "@/services/statsService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError, NotFoundError } from "@/errors";

// Layout component;
import MainContainer from "../../layouts/MainContainerComponent";

// Shared component.
import ReportView from "../report/ReportView";

// Child component.
import Filters from "./FiltersComponent";

// Component.
const MonthlyReportView = () => {
    // Dependencies.
    const alertModelStore = useAlertModalStore();
    const service = useStatsService();

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [model, setModel] = useState<MonthlyReportModel>(() => new MonthlyReportModel());
    const [isReloading, setReloading] = useState<boolean>(() => false);

    // Effect.
    useEffect(() => {
        const initialLoadAsync = async () => {
            try {
                const [monthlyDetail, dateOptions] = await Promise.all([
                    service.getMonthlyDetailAsync(),
                    service.getStatsDateOptionsAsync()
                ]);

                setModel(model => model
                    .fromMonthlyDetail(monthlyDetail)
                    .fromDateOptions(dateOptions));
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

        initialLoadAsync().finally(onInitialLoadingFinished);
    }, []);

    useEffect(() => {
        const reloadAsync = async () => {
            setReloading(true);
    
            try {
                const monthlyDetail = await service.getMonthlyDetailAsync({
                    recordedYear: model.recordedYear,
                    recordedMonth: model.recordedMonth
                });

                setModel(model => model.fromMonthlyDetail(monthlyDetail));
                return;
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

        if (!isInitialLoading) {
            reloadAsync().finally(() => {
                setReloading(false);
            });
        }

    }, [model.recordedYear, model.recordedMonth]);

    if (!model.stats) {
        return null;
    }

    return (
        <ReportView
            model={model.stats}
            isInitialLoading={isInitialLoading}
            isReloading={isReloading}
            renderTop={() => (
                <div className="row g-3 justify-content-center">
                    <div className="col col-12">
                        <Filters model={model} setModel={setModel} isReloading={isReloading} />
                    </div>
                </div>
            )}
        />
    );
};

export default MonthlyReportView;