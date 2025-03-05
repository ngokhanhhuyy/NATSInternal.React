import { useState, useMemo, useCallback, useEffect, useTransition } from "react";
import { Link } from "react-router-dom";
import { useSupplyService } from "@/services/supplyService";
import { useOrderService } from "@/services/orderService";
import { useTreatmentService } from "@/services/treatmentService";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { SupplyBasicModel } from "@/models/supply/supplyBasicModel";
import { OrderBasicModel } from "@/models/order/orderBasicModel";
import { TreatmentBasicModel } from "@/models/treatment/treatmentBasicModel";
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
    const alertModalStore = useAlertModalStore();

    // Model and states.
    const [model, setModel] = useState<TList>(() => props.initialModel);
    const [isReloading, startReloadingTransition] = useTransition();

    // Effect.
    useEffect(() => {
        if (!props.isInitialRendering) {
            startReloadingTransition(reloadAsync);
        }
    }, [model.resultsPerPage]);

    const reloadAsync = async () => {
        try {
            const reloadedModel = await props.reloadAsync(model);
            setModel(reloadedModel);
        } catch (error) {
            if (error instanceof ValidationError) {
                await alertModalStore.getSubmissionErrorConfirmationAsync();
                return;
            }

            throw error;
        }
    };

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
            onValueChanged={resultsPerPage => setModel(model => ({
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

interface Props {
    productId: number;
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
}

const SupplyList = ({ productId, isInitialLoading, onInitialLoadingFinished }: Props) => {
    // Dependencies.
    const service = useSupplyService();

    return (
        <HasProductList
            productId={productId}
            resourceType="supply"
            blockColor="primary"
            isInitialLoading={isInitialLoading}
            onInitialLoadingFinished={onInitialLoadingFinished}
            onLoadAsync={async (requestDto) => {
                const responseDto = await service.getListAsync(requestDto);
                return responseDto.items.map(dto => new SupplyBasicModel(dto));
            }}
        />
    );
};

const OrderList = ({ productId, isInitialLoading, onInitialLoadingFinished }: Props) => {
    // Dependencies.
    const service = useOrderService();

    return (
        <HasProductList
            productId={productId}
            resourceType="order"
            blockColor="success"
            isInitialLoading={isInitialLoading}
            onInitialLoadingFinished={onInitialLoadingFinished}
            onLoadAsync={async (requestDto) => {
                const responseDto = await service.getListAsync(requestDto);
                return responseDto.items.map(dto => new OrderBasicModel(dto));
            }}
        />
    );
};

const TreatmentList = ({productId, isInitialLoading, onInitialLoadingFinished}: Props) => {
    // Dependencies.
    const service = useTreatmentService();

    return (
        <HasProductList
            productId={productId}
            resourceType="treatment"
            blockColor="danger"
            isInitialLoading={isInitialLoading}
            onInitialLoadingFinished={onInitialLoadingFinished}
            onLoadAsync={async (requestDto) => {
                const responseDto = await service.getListAsync(requestDto);
                return responseDto.items.map(dto => new TreatmentBasicModel(dto));
            }}
        />
    );
};

export { HasProductList, SupplyList, OrderList, TreatmentList };