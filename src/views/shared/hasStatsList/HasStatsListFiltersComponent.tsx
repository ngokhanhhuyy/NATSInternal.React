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
    onModelChanged: (changedData: Partial<TList>) => void;
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

    // Computed.
    const blockTitle = useMemo<string>(() => {
        const resourceDisplayName = initialDataStore.getDisplayName(props.resourceType);
        return `Danh sách ${resourceDisplayName}`;
    }, [props.resourceType]);

    const computeBodyClassName = (): string => {
        const classNames = ["row g-3 transition-reloading"];
        if (props.isReloading) {
            classNames.push("opacity-50 pe-none");
        }

        return classNames.join(" ");
    };

    // Header
    const computeHeader = () => {
        if (props.model.canCreate) {
            return (
                <>
                    {props.isReloading && (
                        <div className="spinner-border spinner-border-sm me-3" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    )}
                    <CreatingLink
                        to={props.model.createRoute}
                        canCreate={props.model.canCreate}
                    />
                </>
            );
        }

        return null;
    };

    return (
        <MainBlock
            title={blockTitle}
            header={computeHeader()}
            bodyPadding={[0, 2, 2, 2]}
            bodyClassName={computeBodyClassName()}
        >
            {/* MonthYear */}
            <div className="col col-lg-4 col-md-12 col-sm-12 col-12">
                <Label text="Tháng và năm" />
                <MonthYearSelectInput name="monthYear"
                    monthYearOptions={props.model.monthYearOptions}
                    value={props.model.monthYear}
                    onValueChanged={monthYear => {
                        props.onModelChanged({ monthYear } as Partial<TList>);
                    }}
                />
            </div>

            {/* SortingByField */}
            <div className="col col-lg-4 col-md-6 col-sm-12 col-12">
                <Label text="Trường sắp xếp" />
                <SortingByFieldSelectInput name="sortingByField"
                    options={props.model.sortingOptions}
                    value={props.model.sortingByField}
                    onValueChanged={sortingByField => {
                        props.onModelChanged({ sortingByField } as Partial<TList>);
                    }}
                />
            </div>

            {/* SortingByAscending */}
            <div className="col col-lg-4 col-md-6 col-sm-12 col-12">
                <Label text="Thứ tự sắp xếp" />
                <BooleanSelectInput name="sortingByAscending"
                    trueDisplayName="Từ nhỏ đến lớn"
                    falseDisplayName="Từ lớn đến nhỏ"
                    value={props.model.sortingByAscending}
                    onValueChanged={sortingByAscending => {
                        props.onModelChanged({ sortingByAscending } as Partial<TList>);
                    }}
                />
            </div>
        </MainBlock>
    );
};

export default HasStatsListFilters;