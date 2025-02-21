import React, { useState, useMemo, useEffect } from "react";
import { useCustomerService } from "@/services/customerService";
import { CustomerListModel } from "@/models/customer/customerListModel";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError } from "@/errors";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";
import MainBlockPaginator from "@/views/layouts/MainBlockPaginatorComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import SortingByFieldInput from "@/views/form/SortingByFieldSelectInputComponent";
import BooleanSelectInput from "@/views/form/BooleanSelectInputComponent";

// Child components.
import Results from "./ResultsComponent";

// Props.
interface CustomerListProps {
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
}

// Component.
const CustomerList = (props: CustomerListProps) => {
    // Dependencies.
    const service = useCustomerService();
    const initialData = useInitialDataStore(store => store.data.customer);
    const getSubmissionErrorConfirmationAsync = useAlertModalStore(store => {
        return store.getSubmissionErrorConfirmationAsync;
    });

    // Model and states.
    const [model, setModel] = useState(() => {
        const requestDto: RequestDtos.Customer.List = {
            sortingByField: "DebtRemainingAmount",
            sortingByAscending: false,
            hasRemainingDebtAmountOnly: true
        };
        return new CustomerListModel(initialData, requestDto);
    });
    const [isReloading, setReloading] = useState<boolean>(() => false);

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            if (!props.isInitialLoading) {
                setReloading(true);
            }

            try {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            } catch (error) {
                if (error instanceof ValidationError) {
                    await getSubmissionErrorConfirmationAsync();
                } else {
                    throw error;
                }
            }
        };

        loadAsync().finally(() => {
            if (props.isInitialLoading) {
                props.onInitialLoadingFinished();
            }
            
            setReloading(false);
        });
    }, [model.sortingByAscending, model.sortingByField, model.page]);

    if (props.isInitialLoading) {
        return null;
    }
    // Callbacks.
    const onPageChanged = (page: number) => {
        setModel(model => model.from({ page }));
    };

    return (
        <MainBlock title="Danh sách khoản nợ" bodyPadding={[0, 2, 2, 2]}>
            {/* Sorting options */}
            <div className="row g-3">
                {/* SortingByField */}
                <div className="col col-md-6 col-sm-12 col-12">
                    <Label text="Trường sắp xếp" />
                    <SortingByFieldInput name="sortingByField"
                        options={initialData => initialData.customer.listSortingOptions}
                        value={model.sortingByField}
                        onValueChanged={(sortingByField) => {
                            setModel(model => model.from({ sortingByField }));
                        }}
                    />
                </div>

                {/* SortingByAscending */}
                <div className="col col-md-6 col-sm-12 col-12">
                    <Label text="Thứ tự sắp xếp" />
                    <BooleanSelectInput name="sortingByAscending"
                        falseDisplayName="Từ lớn đến nhỏ"
                        trueDisplayName="Từ nhỏ đến lớn"
                        value={model.sortingByAscending}
                        onValueChanged={(sortingByAscending) => {
                            setModel(model => model.from({ sortingByAscending }));
                        }}
                    />
                </div>
            </div>

            <div className="row g-3">
                {/* Top pagination */}
                {model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <MainBlockPaginator
                            page={model.page}
                            pageCount={model.pageCount}
                            onPageChanged={onPageChanged}
                        />
                    </div>
                )}

                {/* Results */}
                <Results model={model} isReloading={isReloading} />

                {/* Bottom pagination */}
                {model.pageCount > 1 && (
                    <div className="col col-12 d-flex justify-content-center">
                        <MainBlockPaginator
                            page={model.page}
                            pageCount={model.pageCount}
                            onPageChanged={onPageChanged}
                        />
                    </div>
                )}
            </div>
        </MainBlock>
    );
};

export default CustomerList;