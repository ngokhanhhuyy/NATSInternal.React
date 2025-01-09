import React from "react";
import { useInitialDataStore } from "@/stores/initialDataStore";

// Props.
export interface HasStatsListResultsProps<
        TBasic extends IHasStatsBasicModel<TAuthorization>,
        TAuthorization extends IHasStatsExistingAuthorizationModel> {
    resourceType: string;
    model: Readonly<TBasic[]>;
    isReloading: boolean;
    render: (item: TBasic, index: number) => React.ReactNode | React.ReactNode[];
}

// Component.
const HasStatsListResults = <
            TBasic extends IHasStatsBasicModel<TAuthorization>,
            TAuthorization extends IHasStatsExistingAuthorizationModel>
        (props: HasStatsListResultsProps<TBasic, TAuthorization>) => {
    const { resourceType, model, isReloading, render } = props;

    // Dependencies.
    const getDisplayName = useInitialDataStore(store => store.getDisplayName);
    const displayName = getDisplayName(resourceType);

    // Computed.
    const computeClassName = () => {
        if (isReloading) {
            return "opacity-50 pe-none";
        }

        return "";
    };

    return (
        <ul className={`list-group list-group-flush border rounded-3 bg-white overflow-hidden
                        ${computeClassName()}`}>
            {model.length > 0
                ? model.map((item, index) => render(item, index))
                : (
                    <li className="list-group-item bg-transparent p-3 d-flex
                                    justify-content-center align-items-center">
                        Không có {displayName} nào
                    </li>
                )
            }
        </ul>
    );
};

export default HasStatsListResults;