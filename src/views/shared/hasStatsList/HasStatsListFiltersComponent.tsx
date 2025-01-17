import React, { useMemo } from "react";
import { useInitialDataStore } from "@/stores/initialDataStore";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";
import CreatingLink from "@/views/layouts/CreateLinkComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import BooleanSelectInput from "@/views/form/BooleanSelectInputComponent";
import SortingByFieldSelectInput from "@/views/form/SortingByFieldSelectInputComponent";
import MonthYearSelectInput from "@/views/form/MonthYearSelectInputComponent";

// Props.
interface Props<
        TList extends
            IHasStatsListModel<TList, TBasic, TAuthorization> &
            IClonableModel<TList>,
        TBasic extends IHasStatsBasicModel<TAuthorization>,
        TAuthorization extends IHasStatsExistingAuthorizationModel> {
    resourceType: string;
    isReloading: boolean;
    model: TList;
    onChanged: (changedData: Partial<TList>) => void;
}

// Component.
const HasStatsListFilters = <
            TList extends
                IHasStatsListModel<TList, TBasic, TAuthorization> &
                IClonableModel<TList>,
            TBasic extends IHasStatsBasicModel<TAuthorization>,
            TAuthorization extends IHasStatsExistingAuthorizationModel>
        (props: Props<TList, TBasic, TAuthorization>) =>
{
    // Dependencies.
    const initialDataStore = useInitialDataStore();

    // States.
    const { isReloading, resourceType, model, onChanged } = props;

    // Computed.
    const blockTitle = useMemo<string>(() => {
        const resourceDisplayName = initialDataStore.getDisplayName(resourceType);
        return `Danh sách ${resourceDisplayName}`;
    }, [resourceType]);

    const computeRowClassName = (): string => {
        if (isReloading) {
            return "opacity-50 pe-none";
        }

        return "";
    };

    // Header
    const computeHeader = () => {
        if (model.canCreate) {
            return (
                <>
                    {isReloading && (
                        <div className="spinner-border spinner-border-sm me-3" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    )}
                    <CreatingLink to={model.createRoute} canCreate={model.canCreate} />
                </>
            );
        }

        return null;
    };

    return (
        <MainBlock title={blockTitle} bodyPadding={[0, 2, 2, 2]} header={computeHeader()}>
            <div className={`row g-3 ${computeRowClassName()}`}>
                {/* MonthYear */}
                <div className="col col-lg-4 col-md-12 col-sm-12 col-12">
                    <Label text="Tháng và năm" />
                    <MonthYearSelectInput name="monthYear"
                        monthYearOptions={model.monthYearOptions}
                        value={model.monthYear}
                        onValueChanged={monthYear => {
                            onChanged({ monthYear } as Partial<TList>);
                        }}
                    />
                </div>
    
                {/* OrderByField */}
                <div className="col col-lg-4 col-md-6 col-sm-12 col-12">
                    <Label text="Trường sắp xếp" />
                    <SortingByFieldSelectInput name="sortingByField"
                        options={model.sortingOptions}
                        value={model.sortingByField}
                        onValueChanged={sortingByField => {
                            onChanged({ sortingByField } as Partial<TList>);
                        }}
                    />
                </div>
    
                {/* OrderByAscending */}
                <div className="col col-lg-4 col-md-6 col-sm-12 col-12">
                    <Label text="Thứ tự sắp xếp" />
                    <BooleanSelectInput name="sortingByAscending"
                        trueDisplayName="Từ nhỏ đến lớn"
                        falseDisplayName="Từ lớn đến nhỏ"
                        value={model.sortingByAscending}
                        onValueChanged={sortingByAscending => {
                            onChanged({ sortingByAscending } as Partial<TList>);
                        }}
                    />
                </div>
            </div>
        </MainBlock>
    );
};

export default HasStatsListFilters;