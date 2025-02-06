import React from "react";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { ListSortingOptionsModel } from "@/models/listSortingModels";
import SelectInput, { type SelectInputProps, type SelectInputOption }
    from "./SelectInputComponent";

type OptionSelector =
    | ((initialData: ResponseDtos.InitialData) => ResponseDtos.List.SortingOptions)
    | ListSortingOptionsModel;

interface SortingByFieldInputProps
        extends Omit<SelectInputProps, "value" | "onValueChanged" | "options"> {
    name: string;
    options: OptionSelector | undefined;
    value: string | undefined;
    onValueChanged(value: string): void;
}

const SortingByFieldInput = (props: SortingByFieldInputProps) => {
    const { options, ...rest } = props;

    // Dependency.
    const initialData = useInitialDataStore(store => store.data);

    // Computed.
    const getSortingOptionsModel = (): ListSortingOptionsModel | undefined => {
        if (typeof options === "function") {
            return new ListSortingOptionsModel(options(initialData));
        }

        return options;
    };

    const getComputedOptions = (): SelectInputOption[] | undefined => {
        return getSortingOptionsModel()?.fieldOptions.map(option => ({
            value: option.name,
            displayName: option.displayName
        }));
    };

    return (
        <SelectInput
            options={getComputedOptions() ?? []}
            {...rest}
            value={props.value ?? ""}
            onValueChanged={props.onValueChanged}
        />
    );
};

export default SortingByFieldInput;