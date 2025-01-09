import React, { useMemo } from "react";
import type { BrandMinimalModel } from "@/models/product/brand/brandMinimalModel";
import type { ProductCategoryMinimalModel }
    from "@/models/product/productCategory/productCategoryMinimalModel";
import { useInitialDataStore } from "@/stores/initialDataStore";

// Input component.
import SelectInput, { type SelectInputOption, type SelectInputProps } from "@/views/form/SelectInputComponent";

interface BrandOptionsSelectInputProps
        extends Omit<SelectInputProps, "options" | "value" | "onValueChanged"> {
    resourceType: "brand";
    options: Readonly<BrandMinimalModel[]> | undefined;
    value: number | undefined,
    onValueChanged: (value: number | undefined) => any;
}

interface ProductCategorOptionsSelectInputProps
    extends Omit<SelectInputProps, "options" | "value" | "onValueChanged"> {
    resourceType: "category";
    options: Readonly<ProductCategoryMinimalModel[]> | undefined;
    value: number | undefined,
    onValueChanged: (value: number | undefined) => any;
}

const OptionsSelectInput =
        (props: BrandOptionsSelectInputProps | ProductCategorOptionsSelectInputProps) => {
    const { resourceType, options, value, onValueChanged, ...rest } = props;

    const store = useInitialDataStore();
    const displayName = useMemo<string>(() => {
        return store.getDisplayName(resourceType);
    }, [resourceType]);

    const computedOptions = useMemo<SelectInputOption[]>(() => {
        let resultsOptions = [
            { value: "", displayName: `Tất cả ${displayName.toLowerCase()}` }
        ];
        if (options?.length) {
            resultsOptions = [
                ...resultsOptions,
                ...options.map(option => ({
                    value: option.id.toString(),
                    displayName: option.name
                }))
            ];
        }

        return resultsOptions;
    }, [options]);

    return (
        <SelectInput {...rest}
                disabled={(options?.length ?? 0) === 0}
                options={computedOptions}
                value={value?.toString() ?? ""}
                onValueChanged={value => {
                    onValueChanged(value ? parseInt(value) : undefined);
                }} />
    );
};

export default OptionsSelectInput;
export type { BrandOptionsSelectInputProps, ProductCategorOptionsSelectInputProps };