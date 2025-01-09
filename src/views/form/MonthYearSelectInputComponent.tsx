import React from "react";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { ListMonthYearModel, ListMonthYearOptionsModel } from "@/models/listMonthYearModels";

// Form component.
import SelectInput, { SelectInputOption } from "./SelectInputComponent";

// Props.
type OptionSelector =
    | ((initialData: ResponseDtos.InitialData) => ResponseDtos.List.MonthYearOptions)
    | ListMonthYearOptionsModel;

interface MonthYearSelectInputProps
        extends Omit<React.ComponentPropsWithoutRef<"select">, "value"> {
    name: string;
    monthYearOptions: OptionSelector | undefined;
    value: ListMonthYearModel | undefined;
    onValueChanged(value: ListMonthYearModel | undefined): void;
}

const MonthYearSelectInput = (props: MonthYearSelectInputProps) => {
    const { monthYearOptions, ...rest } = props;

    // Dependency.
    const initialData = useInitialDataStore(store => store.data);

    // Computed.
    const getMonthYearOptionsModel = (): ListMonthYearOptionsModel | undefined => {
        if (typeof monthYearOptions === "function") {
            return new ListMonthYearOptionsModel(monthYearOptions(initialData));
        }

        return monthYearOptions;
    };
    
    const getComputedOptions = (): SelectInputOption[] | undefined => {
        return [
            { value: "", displayName: "Tất cả" },
            ...getMonthYearOptionsModel()?.options.map(option => ({
                value: `${option.year}/${option.month}`,
                displayName: option.toString()
            })) ?? []
        ];
    };

    // Callbacks.
    const handleValueChanged = (monthYearAsString: string) => {
        if (!monthYearAsString) {
            props.onValueChanged(undefined);
        } else {
            const [year, month] = monthYearAsString.split("/");
            const monthYear = getMonthYearOptionsModel()?.options.find(option =>
                option.year === parseInt(year) &&
                option.month === parseInt(month))
                ?? new ListMonthYearModel({
                    year: parseInt(year),
                    month: parseInt(month),
                });

            props.onValueChanged(monthYear);
        }
        
    };

    return (
        <SelectInput options={getComputedOptions() ?? []} {...rest}
                value={props.value ? `${props.value.year}/${props.value.month}` : ""}
                onValueChanged={handleValueChanged} />
    );
};

export default MonthYearSelectInput;