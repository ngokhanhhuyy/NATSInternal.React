import React, { useMemo } from "react";
import type { MonthlyReportModel } from "@/models/report/ReportModel";
import { useInitialDataStore } from "@/stores/initialDataStore";

// Layout component.
import MainBlock from "../../layouts/MainBlockComponent";

// Form components.
import SelectInput, { type SelectInputOption } from "../../form/SelectInputComponent";

// Props.
interface FiltersProps {
    model: MonthlyReportModel;
    setModel: React.Dispatch<React.SetStateAction<MonthlyReportModel>>;
    isReloading: boolean;
}

// Component.
const Filters = (props: FiltersProps) => {
    // Dependencies.
    const getDisplayName = useInitialDataStore(store => store.getDisplayName);

    // Computed.
    const yearOptions = useMemo<SelectInputOption[]>(() => {
        return props.model.yearOptions.map(option => ({
            value: option.toString(),
            displayName: option.toString()
        }));
    }, [props.model.yearOptions]);

    const monthOptions = useMemo<SelectInputOption[]>(() => {
        return props.model.monthOptions.map(option => ({
            value: option.toString(),
            displayName: option.toString()
        }));
    }, [props.model.monthOptions]);

    const bodyClassName = ((): string => {
        const classNames = ["row g-3"];
        if (props.isReloading) {
            classNames.push("pe-none");
        }

        return classNames.filter(name => name).join(" ");
    })();

    const header = (() => {
        if (props.isReloading) {
            return (
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            );
        }

        return null;
    })();

    return (
        <MainBlock
            title="Báo cáo theo tháng"
            header={header}
            bodyPadding={[0, 2, 2, 2]}
            bodyClassName={bodyClassName}
        >
            {/* Year */}
            <div className="col col-12">
                <span className="fw-bold">{getDisplayName("year")}</span>
                <SelectInput
                    name="recordedYear"
                    options={yearOptions}
                    value={props.model.recordedYear.toString()}
                    onValueChanged={(yearAsString) => {
                        const year = parseInt(yearAsString);
                        props.setModel(model => model.fromRecordedYear(year));
                    }}
                />
            </div>

            {/* Month */}
            <div className="col col-12">
                <span className="fw-bold">{getDisplayName("month")}</span>
                <SelectInput
                    name="recordedMonth"
                    options={monthOptions}
                    value={props.model.recordedMonth.toString()}
                    onValueChanged={(monthAsString) => {
                        const month = parseInt(monthAsString);
                        props.setModel(model => model.fromRecordedMonth(month));
                    }}
                />
            </div>
        </MainBlock>
    );
};

export default Filters;