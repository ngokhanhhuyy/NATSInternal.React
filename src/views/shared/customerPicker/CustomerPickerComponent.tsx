import React, { useState, useMemo, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CustomerListModel } from "@/models/customer/customerListModel";
import { CustomerBasicModel } from "@/models/customer/customerBasicModel";
import { Gender } from "@/services/dtos/enums";
import { useCustomerService } from "@/services/customerService";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError } from "@/errors";

// Layout components.
import MainPaginator from "@/views/layouts/MainPaginatorComponent";
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form components.
import { FormContext } from "@/views/form/FormComponent";
import Label from "@/views/form/LabelComponent";
import TextInput from "@/views/form/TextInputComponent";
import SortingByFieldSelectInput from "@/views/form/SortingByFieldSelectInputComponent";
import BooleanInput from "@/views/form/BooleanSelectInputComponent";
import * as styles from "./CustomerPickerComponent.module.css";

// Props.
interface CustomerPickerProps {
    value: CustomerBasicModel | null;
    onValueChanged(value: CustomerBasicModel | null): void;
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
    disabled?: boolean;
}

// Component.
const CustomerPicker = (props: CustomerPickerProps) => {
    const { value, onValueChanged } = props;
    const { isInitialLoading, onInitialLoadingFinished, disabled } = props;

    // Dependency.
    const initialResponseDto = useInitialDataStore(store => store.data.customer);
    const alertModalStore = useAlertModalStore();
    const service = useCustomerService();

    // Model.
    const [isReloading, setReloading] = useState<boolean>(false);
    const formContext = useContext(FormContext);
    const modelState = formContext?.modelState;
    const [model, setModel] = useState(() => {
        return new CustomerListModel(initialResponseDto, { resultsPerPage: 10 });
    });

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            if (!isInitialLoading) {
                setReloading(true);
            }

            try {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            } catch (error) {
                if (error instanceof ValidationError) {
                    await alertModalStore.getSubmissionErrorConfirmationAsync();
                    return;
                }

                return error;
            }
        };

        loadAsync().finally(() => {
            if (isInitialLoading) {
                onInitialLoadingFinished();
            }

            setReloading(false);
        });
    }, [model.page, model.sortingByAscending, model.sortingByField, model.searchByContent]);

    // Computed.
    const computeBlockTitle = (): string => {
        const errorMessage = modelState?.getError("customerId");
        if (!value && errorMessage) {
            return errorMessage;
        }

        return value ? "Khách hàng" : "Tìm chọn khách hàng";
    };
    
    const computeBlockColor = (): "primary" | "danger" => {
        if (!value && modelState?.hasError("customerId")) {
            return "danger";
        }

        return "primary";
    };

    // Header.
    const computeHeader = (): React.ReactNode => {
        if (value && !disabled) {
            return (
                <button type="button" className="btn btn-outline-danger btn-sm"
                        onClick={() => onValueChanged(null)}>
                    <i className="bi bi-x-lg"></i>
                    <span className="ms-2">Chọn khách hàng khác</span>
                </button>
            );
        }

        return null;
    };

    return (
        <MainBlock title={computeBlockTitle()}
            color={computeBlockColor()}
            header={computeHeader()}
            bodyPadding={[0, 2, 2, 2]}
        >
            {value ? (
                <SelectedCustomer model={value} />
            ) : (
                <Selector model={model}
                    setModel={setModel}
                    isInitialLoading={isInitialLoading}
                    isReloading={isReloading}
                    onSelected={customer => onValueChanged(customer)}
                />
            )}
        </MainBlock>
    );
};

const SelectedCustomer = ({ model }: { model: CustomerBasicModel }) => {
    // Memo.
    const genderClassName = useMemo((): string => {
        if (model.gender === Gender.Male) {
            return "text-primary";
        }
        return "text-danger";
    }, []);

    return (
        <div className="row gx-4 pt-2 align-items-stretch">
            <div className="col col-auto d-flex align-items-center justify-content-center">
                {/* Thumbnail */}
                <img className={`img-thumbnail rounded-circle
                                ${styles["selectedCustomerAvatar"]}`}
                        src={model.avatarUrl} />
            </div>
            <div className="col d-flex flex-column">
                {/* FullName */}
                <Link to={model.detailRoute} className="fw-bold">
                    {model.fullName}
                </Link>

                {/* NickName */}
                {model.nickName && (
                    <span className="fst-italic small">
                        {model.nickName}
                    </span>
                )}

                {/* Gender and PhoneNumber */}
                <div className="small">
                    {/* Gender */}
                    <span className={genderClassName}>
                        {model.gender === Gender.Male ? "Nam" : "Nữ"}
                    </span>,&nbsp;

                    {/* PhoneNumber */}
                    {model.phoneNumber && (
                        <span>
                            {model.phoneNumber}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

interface Selector {
    model: CustomerListModel;
    setModel: React.Dispatch<React.SetStateAction<CustomerListModel>>;
    onSelected(customer: CustomerBasicModel): void;
    isInitialLoading: boolean;
    isReloading: boolean;
}

const Selector = (props: Selector) => {
    const { model, setModel, onSelected, isInitialLoading, isReloading } = props;

    // Computed.
    const computeRowClassName = (): string => isReloading ? "opacity-50 pe-none" : "";

    const isSearchContentValid = () => {
        return !model.searchByContent.length || model.searchByContent.length >= 3;
    };

    const computeSearchButtonClassName = (): string => {
        if (isSearchContentValid()) {
            return "btn-outline-primary";
        }
    
        return "btn-outline-danger";
    };

    const computeSearchIconClassName = () => {
        if (isSearchContentValid()) {
            return <i className="bi bi-search" />;
        }

        return <i className="bi bi-x-lg" />;
    };

    const isSearchButtonDisabled = () => {
        return !isSearchContentValid || isInitialLoading || isReloading;
    };

    return (
        <FormContext.Provider value={null}>
            {/* Search */}
            <div className={`row g-3 align-items-stretch ${computeRowClassName()}`}>
                {/* Search by content */}
                <div className="col d-flex flex-column">
                    <Label text="Tìm kiếm"/>
                    <div className="input-group">
                        {/* Search content */}
                        <TextInput className="border-end-0"
                            placeholder="Tên, ngày sinh, số điện thoại ..."
                            value={model.searchByContent}
                            onValueChanged={searchByContent => {
                                setModel(model => model.from({searchByContent}));
                            }}
                        />

                        {/* Search button */}
                        <button type="button"
                            className={`btn ${computeSearchButtonClassName()}`}
                            disabled={isSearchButtonDisabled()}
                            onClick={() => setModel(model => model.from({page: 1}))}
                        >
                            {computeSearchIconClassName()}
                            <span className="ms-1 d-sm-inline d-none">Tìm kiếm</span>
                        </button>
                    </div>

                    {/* Validation Text */}
                    {!isSearchContentValid && (
                        <span className="text-danger">
                            Vui lòng nhập tối thiểu 3 ký tự.
                        </span>
                    )}

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
                    <SortingByFieldSelectInput name="sortingByField"
                        options={model.sortingOptions}
                        value={model.sortingByField}
                        onValueChanged={sortingByField => {
                            setModel(model => model.from({sortingByField}));
                        }}
                    />
                </div>

                {/* SortingByAscending */}
                <div className="col col-md-6 col-12">
                    <Label text="Thứ tự sắp xếp"/>
                    <BooleanInput name="sortingByAscending"
                        trueDisplayName="Từ nhỏ đến lớn"
                        falseDisplayName="Từ lớn đến nhỏ"
                        value={model.sortingByAscending}
                        onValueChanged={sortingByAscending => {
                            setModel(model => model.from({sortingByAscending}));
                        }}
                    />
                </div>
            </div>

            {/* Top Paginator */}
            <div className="row g-3">
                {model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <MainPaginator page={model.page}
                            pageCount={model.pageCount}
                            isReloading={isReloading}
                            onClick={page => setModel(model => model.from({page}))}
                        />
                    </div>
                )}
            </div>

            {/* List results */}
            <div className={`row g-3 ${computeRowClassName()}`}>
                <div className="col col-12">
                    <ListResults model={model.items} onSelected={onSelected} />
                </div>
            </div>

            {/* Bottom Paginator */}
            <div className="row g-3">
                {model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <MainPaginator page={model.page}
                            pageCount={model.pageCount}
                            isReloading={isReloading}
                            onClick={page => setModel(model => model.from({page}))}
                        />
                    </div>
                )}
            </div>
        </FormContext.Provider>
    );
};

interface ListResultsProps {
    model: CustomerBasicModel[];
    onSelected(customer: CustomerBasicModel): void;
}

const ListResults = ({ model, onSelected }: ListResultsProps) => {

    return (
        <ul className="list-group">
            {model.map(customer => (
                <ListResultsItem model={customer}
                    onSelected={onSelected}
                    key={customer.id}
                />
            ))}
        </ul>
    );
};

interface ListResultsItemProps {
    model: CustomerBasicModel;
    onSelected(customer: CustomerBasicModel): void;
}

const ListResultsItem = ({ model, onSelected }: ListResultsItemProps) => {
    // Memo.
    const genderClassName = useMemo((): string => {
        if (model.gender === Gender.Male) {
            return "text-primary";
        }
        return "text-danger";
    }, []);

    return (
        <li className="list-group-item d-flex align-items-center">
            {/* Avatar */}
            <Link to={model.detailRoute}>
                <img className={`img-thumbnail rounded-circle me-2 ${styles["avatar"]}`}
                        src={model.avatarUrl} />
            </Link>

            {/* Detail */}
            <div className="detail d-flex flex-column justify-content-center
                            align-items-start flex-fill">
                {/* FullName */}
                <Link className="fullname fw-bold" to={model.detailRoute}>
                    {model.fullName}
                </Link>

                {/* NickName */}
                <span className="nickname small">
                    {model.nickName}
                </span>
                
                {/* Additional details */}
                <div className="small">
                    {/* Gender */}
                    <span className={genderClassName}>
                        {model.gender === Gender.Male ? "Nam" : "Nữ"}
                    </span>,&nbsp;

                    {/* PhoneNumber */}
                    {model.phoneNumber && (
                        <span>{model.phoneNumber}</span>
                    )}
                </div>
            </div>

            {/* Select button */}
            <button type="button" className="btn btn-outline-primary btn-sm"
                    onClick={() => onSelected(model)}>
                <i className="bi bi-check2-circle"></i>
                <span className="d-sm-inline d-none ms-2">Chọn</span>
            </button>
        </li>
    );
};

export default CustomerPicker;