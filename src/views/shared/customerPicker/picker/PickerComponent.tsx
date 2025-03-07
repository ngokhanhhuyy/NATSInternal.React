import React from "react";
import type { CustomerListModel } from "@/models/customer/customerListModel";
import type { CustomerBasicModel } from "@/models/customer/customerBasicModel";

// Layout components.
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Form components.
import { FormContext } from "@/views/form/FormComponent";
import Label from "@/views/form/LabelComponent";
import TextInput from "@/views/form/TextInputComponent";
import SortingByFieldSelectInput from "@/views/form/SortingByFieldSelectInputComponent";
import BooleanInput from "@/views/form/BooleanSelectInputComponent";

// Child components.
import PickerListResults from "./PickerListResultsComponent";

interface PickerProps {
    model: CustomerListModel;
    onModelChanged: (changedData: Partial<CustomerListModel>) => any;
    avatarStyle: React.CSSProperties;
    onSelected(customer: CustomerBasicModel): void;
    isReloading: boolean;
}

const Picker = (props: PickerProps) => {
    // Computed.
    const computeRowClassName = (): string => props.isReloading ? "opacity-50 pe-none" : "";

    return (
        <FormContext.Provider value={null}>
            {/* Search */}
            <div className={`row g-3 align-items-stretch ${computeRowClassName()}`}>
                {/* Search by content */}
                <div className="col d-flex flex-column">
                    <Label text="Tìm kiếm"/>
                    <div className="input-group">
                        {/* Search content */}
                        <TextInput
                            className="border-end-0"
                            placeholder="Tên, ngày sinh, số điện thoại ..."
                            value={props.model.searchByContent}
                            onValueChanged={(searchByContent) => {
                                props.onModelChanged({ searchByContent });
                            }}
                        />
                    </div>

                    {/* Example */}
                    <span className="small opacity-50">
                        Ví dụ: Nguyễn Văn An, 30-08-1997, 09037632117 ...
                    </span>
                </div>
            </div>

            {/* Sorting options */}
            <div className={`row g-3 ${computeRowClassName()}`}>
                {/* SortingByField */}
                <div className="col col-md-6 col-12">
                    <Label text="Trường sắp xếp"/>
                    <SortingByFieldSelectInput
                        name="sortingByField"
                        options={props.model.sortingOptions}
                        value={props.model.sortingByField}
                        onValueChanged={(sortingByField) => {
                            props.onModelChanged({ sortingByField });
                        }}
                    />
                </div>

                {/* SortingByAscending */}
                <div className="col col-md-6 col-12">
                    <Label text="Thứ tự sắp xếp"/>
                    <BooleanInput
                        name="sortingByAscending"
                        trueDisplayName="Từ nhỏ đến lớn"
                        falseDisplayName="Từ lớn đến nhỏ"
                        value={props.model.sortingByAscending}
                        onValueChanged={(sortingByAscending) => {
                            props.onModelChanged({ sortingByAscending });
                        }}
                    />
                </div>
            </div>

            {/* Top Paginator */}
            <div className="row g-3">
                {props.model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <MainPaginator
                            page={props.model.page}
                            pageCount={props.model.pageCount}
                            isReloading={props.isReloading}
                            onClick={(page) => props.onModelChanged({ page })}
                        />
                    </div>
                )}
            </div>

            {/* List results */}
            <div className={`row g-3 ${computeRowClassName()}`}>
                <div className="col col-12">
                    <PickerListResults
                        model={props.model.items}
                        avatarStyle={props.avatarStyle}
                        onSelected={props.onSelected}
                    />
                </div>
            </div>

            {/* Bottom Paginator */}
            <div className="row g-3">
                {props.model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <MainPaginator
                            page={props.model.page}
                            pageCount={props.model.pageCount}
                            isReloading={props.isReloading}
                            onClick={(page) => props.onModelChanged({ page })}
                        />
                    </div>
                )}
            </div>
        </FormContext.Provider>
    );
};

export default Picker;