import { useState, useMemo, useCallback, useEffect, useTransition } from "react";
import { Link } from "react-router-dom";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError } from "@/errors";
import * as styles from "./HasProductListComponent.module.css";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form components.
import SelectInput from "@/views/form/SelectInputComponent";

export interface HasProductListProps<
        TList extends IHasProductListModel<TList, TBasic, TAuthorization>,
        TBasic extends IHasStatsBasicModel<TAuthorization>,
        TAuthorization extends IHasStatsExistingAuthorizationModel> {
    productId: number;
    resourceType: string;
    blockColor: "primary" | "success" | "danger";
    isInitialRendering: boolean;
    initialModel: TList;
    reloadAsync(model: TList): Promise<TList>;
}

const HasProductList = <
            TList extends IHasProductListModel<TList, TBasic, TAuthorization>,
            TBasic extends IHasStatsBasicModel<TAuthorization>,
            TAuthorization extends IHasStatsExistingAuthorizationModel>
        (props: HasProductListProps<TList, TBasic, TAuthorization>) => {
    // Dependencies.
    const initialDataStore = useInitialDataStore();
    const getSubmissionErrorConfirmationAsync = useAlertModalStore(store => {
        return store.getSubmissionErrorConfirmationAsync;
    });

    // Model and states.
    const [model, setModel] = useState<TList>(() => props.initialModel);
    const [isReloading, startReloadingTransition] = useTransition();

    // Effect.
    useEffect(() => {
        if (!props.isInitialRendering) {
            startReloadingTransition(async () => {
                try {
                    const reloadedModel = await props.reloadAsync(model);
                    setModel(reloadedModel);
                } catch (error) {
                    if (error instanceof ValidationError) {
                        await getSubmissionErrorConfirmationAsync();
                        return;
                    }
        
                    throw error;
                }
            });
        }
    }, [model.resultsPerPage]);

    // Computed.
    const resourceDisplayName = useMemo<string>(() => {
        return initialDataStore.getDisplayName(props.resourceType);
    }, [props.resourceType]);

    const resultsPerPageOptions = useMemo<number[]>(() => [5, 10, 15, 20], []);

    const getIdClass = useCallback((isLocked: boolean): string => {
        const classNames = [ "fw-bold px-2 py-1 rounded" ];
        if (isLocked) {
            classNames.push("bg-danger-subtle text-danger");
        } else {
            classNames.push("bg-primary-subtle text-primary");
        }

        return classNames.join(" ");
    }, [model.items]);

    const header: React.ReactNode = (
        <SelectInput
            name="resultsPerPage"
            className={`form-select form-select-sm ${props.blockColor}`}
            style={{ width: "fit-content" }}
            disabled={isReloading}
            options={resultsPerPageOptions.map(option => ({
                value: option.toString(),
                displayName: option.toString()
            }))}
            value={model.resultsPerPage?.toString() ?? "5"}
            onValueChanged={resultsPerPage => setModel(model => model.from({
                ...model,
                resultsPerPage: parseInt(resultsPerPage)
            }))}
        />
    );

    return (
        <MainBlock
            title={`${resourceDisplayName} gần nhất`}
            color={props.blockColor}
            className={`block-order-list mb-3 ${styles["hasProductList"]}`}
            header={header}
            bodyClassName={isReloading ? "opacity-50 pe-none" : ""}
            bodyPadding="0"
        >
            {model.items.length > 0 ? (
                <ul className="list-group list-group-flush">
                    {model.items.map(basicModel => (
                        <li className="list-group-item bg-transparent px-1"
                            key={basicModel.id}>
                            <div className="row small">
                                {/* Id */}
                                <div className="col col-2 d-flex justify-content-start
                                                align-items-center">
                                    <span className={getIdClass(basicModel.isLocked)}>
                                        #{basicModel.id}
                                    </span>
                                </div>

                                {/* StatsDate */}
                                <div className="col col-6 justify-content-center
                                            align-items-center d-xl-flex d-none">
                                    <i className="bi bi-calendar-week text-primary me-2" />
                                    <span>{basicModel.statsDateTime.date}</span>
                                </div>

                                {/* StatsTime */}
                                <div className="col col-2 justify-content-center
                                                align-items-center d-xl-flex d-none">
                                    <i className="bi bi-clock text-primary me-2"></i>
                                    <span>{basicModel.statsDateTime.time}</span>
                                </div>

                                {/* StatsDateTime */}
                                <div className="col col-8 justify-content-center
                                                align-items-center d-xl-none d-flex">
                                    <i className="bi bi-calendar-week text-primary me-2" />
                                    <span>{basicModel.statsDateTime.dateTime}</span>
                                </div>

                                {/* Link */}
                                <div className="col col-2 d-flex justify-content-end">
                                    <Link className="btn btn-outline-primary btn-sm"
                                        to={basicModel.detailRoute}>
                                        <i className="bi bi-info-circle"></i>
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-success-emphasis text-center opacity-50 p-4">
                    Không có {resourceDisplayName} nào chứa sản phẩm này
                </div>
            )}
        </MainBlock>
    );
};

export default HasProductList;