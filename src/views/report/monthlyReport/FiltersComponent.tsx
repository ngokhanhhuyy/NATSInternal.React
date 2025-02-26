import React, { useMemo } from "react";
import type { MonthlyReportModel } from "@/models/report/ReportModel";

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
    // Computed.
    const monthYearOptions = useMemo<SelectInputOption[]>(() => {
        return props.model.monthYearOptions.map(option => {
            const [year, month] = option;
            return {
                value: JSON.stringify([year, month]),
                displayName: `Tháng ${month.toString().padStart(2, "0")}, ${year}`
            };
        });
    }, [props.model.monthYearOptions]);

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
            headerClassName="pe-3"
            bodyPadding={[0, 2, 2, 2]}
            bodyClassName={bodyClassName}
        >
            <div className="col col-12">
                <span className="fw-bold">Tháng và năm</span>
                <SelectInput
                    name="recordedMonthYear"
                    options={monthYearOptions}
                    value={JSON.stringify(props.model.recordedMonthYear)}
                    onValueChanged={(monthYearJSON) => {
                        const recordedMonthYear: [number, number] = JSON.parse(monthYearJSON);
                        props.setModel(model => model.from({ recordedMonthYear }));
                    }}
                />
            </div>
        </MainBlock>
    );
};

export default Filters;