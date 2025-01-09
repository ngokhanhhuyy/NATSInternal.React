import React, { useMemo } from "react";
import type { CustomerListModel } from "@/models/customer/customerListModel";

// Layout component.
import MainBlock from "../../layouts/MainBlockComponent";
import CreatingLink from "../../layouts/CreateLinkComponent";

// Form component.
import Form from "@/views/form/FormComponent";
import Label from "../../form/LabelComponent";
import TextInput from "../../form/TextInputComponent";
import SelectInput, { type SelectInputOption } from "../../form/SelectInputComponent";
import SortingByFieldSelectInput from "../../form/SortingByFieldSelectInputComponent";
import SubmitButton from "@/views/form/SubmitButtonComponent";

interface Props {
    model: CustomerListModel;
    setModel: React.Dispatch<React.SetStateAction<CustomerListModel>>;
    loadListAsync: () => Promise<void>;
}

const Filters = ({ model, setModel, loadListAsync }: Props) => {
    // Computed.
    const isSearchContentValid = () => {
        return !model.searchByContent.length || model.searchByContent.length >= 3;
    };

    const computeSearchColumnClassName = () => {
        return isSearchContentValid() ? "" : "pb-0";
    };

    const hasRemainingDebtAmountOnlyOptions = useMemo<SelectInputOption[]>(() => {
        return [
            { value: "false", displayName: "Hiển thị tất cả khách hàng" },
            { value: "true", displayName: "Chỉ hiển thị khách hàng còn nợ" }
        ];
    }, []);

    // Header.
    let header: React.ReactNode = null;
    if (model.canCreate) {
        header = <CreatingLink to={model.createRoute} canCreate={model.canCreate} />;
    }

    return (
        <MainBlock title="Danh sách khách hàng" header={header} bodyPadding={2}>
            <Form className="w-100 h-100"
                    submittingAction={loadListAsync}
                    submissionSucceededModal={false}>
                <div className="row g-3">
                    <div className={`col ${computeSearchColumnClassName}`}>
                        <div className="input-group">
                            {/* Search content */}
                            <TextInput className="border-end-0" type="text"
                                    placeholder="Tìm kiếm tên, thông tin liên lạc ..."
                                    value={model.searchByContent}
                                    onValueChanged={searchByContent => {
                                        setModel(model => model.from({ searchByContent }));
                                    }} />
                            
                            {/* Advance filters / collapse button */}
                            <button className="btn btn-outline-primary" type="button"
                                    data-bs-target="#advanced-filters-container"
                                    data-bs-toggle="collapse"
                                    aria-expanded="false" role="button"
                                    aria-controls="advanced-filters-container">
                                <i className="bi bi-sliders"></i>
                            </button>
                        </div>

                        {/* Validation message */}
                        {!isSearchContentValid && (
                            <span className="small opacity-50">
                                * Nội dung tìm kiếm phải chứa ít nhất 3 ký tự.
                            </span>
                        )}
                    </div>
                
                    <div className="col col-auto">
                        <SubmitButton disabled={!isSearchContentValid}>
                            <i className="bi bi-search"></i>
                            <span className="ms-2 d-sm-inline d-none">Tìm kiếm</span>
                        </SubmitButton>
                    </div>
                </div>

                <div className="row g-3 collapse" id="advanced-filters-container">
                    {/* SortingByField */}
                    <div className="col col-xl-4 col-sm-6 col-12">
                        <Label text="Trường sắp xếp" />
                        <SortingByFieldSelectInput name="sortingByField"
                                options={(data) => data.customer.listSortingOptions}
                                value={model.sortingByField}
                                onValueChanged={sortingByField => {
                                    setModel(model => model.from({ sortingByField }));
                                }} />
                    </div>

                    {/* SortingByAscending */}
                    <div className="col col-xl-4 col-sm-6 col-12">
                        <Label text="Thứ tự sắp xếp" />
                        <SelectInput name="sortingByAscending"
                                options={[
                                    { value: "true", displayName: "Từ nhỏ đến lớn" },
                                    { value: "false", displayName: "Từ lớn đến nhỏ" }
                                ]}
                                value={model.sortingByAscending?.toString() ?? ""}
                                onValueChanged={(ascending) => {
                                    setModel(model => model.from({
                                        sortingByAscending: JSON.parse(ascending) as boolean
                                    }));
                                }}>
                        </SelectInput>
                    </div>

                    {/* HasRemainingDebtOnly */}
                    <div className="col col-xl-4 col-sm-12 col-12">
                        <Label text="Chế độ hiển thị" />
                        <SelectInput name="hasRemainingDebtAmountOnly"
                                options={hasRemainingDebtAmountOnlyOptions}
                                value={model.hasRemainingDebtAmountOnly.toString()}
                                onValueChanged={value => {
                                    const parsedValue: boolean = JSON.parse(value);
                                    setModel(model => model.from({
                                        hasRemainingDebtAmountOnly: parsedValue
                                    }));
                                }} />
                    </div>
                </div>
            </Form>
        </MainBlock>
    );
};

export default Filters;