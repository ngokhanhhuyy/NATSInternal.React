import type { CustomerListModel } from "@/models/customer/customerListModel";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";
import CreatingLink from "@/views/layouts/CreateLinkComponent";

// Form component.
import Label from "@/views/form/LabelComponent";
import TextInput from "@/views/form/TextInputComponent";
import SortingByFieldSelectInput from "@/views/form/SortingByFieldSelectInputComponent";
import BooleanSelectInput from "@/views/form/BooleanSelectInputComponent";

interface Props {
    model: CustomerListModel;
    onModelChanged: (changedData: Partial<CustomerListModel>) => any;
    isReloading: boolean;
}

const Filters = (props: Props) => {
    // Header.
    const computeHeader = () => {
        return (
            <>
                {props.isReloading && (
                    <div className="spinner-border spinner-border-sm me-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                <CreatingLink
                    to={props.model.createRoute}
                    disabled={props.isReloading}
                    canCreate={props.model.canCreate}
                />
            </>
        );
    };

    return (
        <MainBlock title="Danh sách khách hàng" header={computeHeader()} bodyPadding={2}>
            <div className="row g-3">
                <div className={"col col-12"}>
                    <div className="input-group">
                        {/* Search content */}
                        <TextInput
                            className="border-end-0"
                            type="text"
                            placeholder="Tìm kiếm tên, thông tin liên lạc ..."
                            value={props.model.searchByContent}
                            onValueChanged={searchByContent => {
                                props.onModelChanged({ searchByContent });
                            }}
                        />
                        
                        {/* Advance filters / collapse button */}
                        <button className="btn btn-outline-primary" type="button"
                                data-bs-target="#advanced-filters-container"
                                data-bs-toggle="collapse"
                                aria-expanded="false" role="button"
                                aria-controls="advanced-filters-container">
                            <i className="bi bi-sliders"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="row g-3 collapse" id="advanced-filters-container">
                {/* SortingByField */}
                <div className="col col-xl-4 col-sm-6 col-12">
                    <Label text="Trường sắp xếp" />
                    <SortingByFieldSelectInput
                        name="sortingByField"
                        options={(data) => data.customer.listSortingOptions}
                        value={props.model.sortingByField}
                        onValueChanged={sortingByField => {
                            props.onModelChanged({ sortingByField });
                        }}
                    />
                </div>

                {/* SortingByAscending */}
                <div className="col col-xl-4 col-sm-6 col-12">
                    <Label text="Thứ tự sắp xếp" />
                    <BooleanSelectInput
                        name="sortingByAscending"
                        trueDisplayName="Từ nhỏ đến lớn"
                        falseDisplayName="Từ lớn đến nhỏ"
                        value={props.model.sortingByAscending ?? true}
                        onValueChanged={(sortingByAscending) => {
                            props.onModelChanged({ sortingByAscending });
                        }}
                    />
                </div>

                {/* HasRemainingDebtOnly */}
                <div className="col col-xl-4 col-sm-12 col-12">
                    <Label text="Chế độ hiển thị" />
                    <BooleanSelectInput
                        name="hasRemainingDebtAmountOnly"
                        trueDisplayName="Chỉ hiển thị khách hàng còn nợ"
                        falseDisplayName="Hiển thị tất cả khách hàng"
                        value={props.model.hasRemainingDebtAmountOnly}
                        onValueChanged={hasRemainingDebtAmountOnly => {
                            props.onModelChanged({ hasRemainingDebtAmountOnly });
                        }}
                    />
                </div>
            </div>
        </MainBlock>
    );
};

export default Filters;