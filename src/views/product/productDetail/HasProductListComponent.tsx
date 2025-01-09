import React, { useState, useMemo, useCallback, useEffect } from "react";
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
import { LoadingListBlock } from "@/views/layouts/LoadingView";

// Form components.
import SelectInput from "@/views/form/SelectInputComponent";

type BasicModel = SupplyBasicModel | OrderBasicModel | TreatmentBasicModel;
type RequestDto = { productId: number; resultsPerPage: number; };

interface Model<TBasicModel extends BasicModel> {
    readonly items: TBasicModel[];
    readonly resultsPerPage: number;
    readonly resultsPerPageOptions: number[],
}

export interface HasProductList<TBasicModel extends BasicModel> {
    productId: number;
    resourceType: string;
    blockColor: "primary" | "success" | "danger";
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
    onLoadAsync(requestDto: RequestDto): Promise<TBasicModel[]>;
}

const HasProductList = <TBasicModel extends BasicModel>
        (props: HasProductList<TBasicModel>) => {
    // Dependencies.
    const initialDataStore = useInitialDataStore();
    const alertModalStore = useAlertModalStore();

    // Model and states.
    const [model, setModel] = useState<Model<TBasicModel>>(() => {
        const requestDto = { resultsPerPage: 5 };
        return {
            items: [],
            resultsPerPage: requestDto.resultsPerPage,
            resultsPerPageOptions: [ 5, 10, 15, 20 ],
        };
    });
    const [isReloading, setReloading] = useState<boolean>(false);

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            if (!props.isInitialLoading) {
                setReloading(true);
            }

            try {
                const requestDto = {
                    productId: props.productId,
                    resultsPerPage: model.resultsPerPage
                };
                const basicModels = await props.onLoadAsync(requestDto);
                setModel(model => ({ ...model, items: basicModels }));
            } catch (error) {
                if (error instanceof ValidationError) {
                    await alertModalStore.getSubmissionErrorConfirmationAsync();
                    return;
                }

                throw error;
            } finally {
                if (props.isInitialLoading) {
                    props.onInitialLoadingFinished();
                }
            }
        };

        loadAsync().then(() => setReloading(false));
    }, [model.resultsPerPage]);

    const resourceDisplayName = useMemo<string>(() => {
        return initialDataStore.getDisplayName(props.resourceType);
    }, [props.resourceType]);

    const getIdClass = useCallback((isLocked: boolean): string => {
        const classNames = [ "fw-bold px-2 py-1 rounded" ];
        if (isLocked) {
            classNames.push("bg-danger-subtle text-danger");
        } else {
            classNames.push("bg-primary-subtle text-primary");
        }

        return classNames.join(" ");
    }, [model.items]);

    if (props.isInitialLoading) {
        return (
            <LoadingListBlock hasHeader color={props.blockColor} className="mb-3"
                    detailSecondaryTextLineCount={0}
                    length={model.resultsPerPage} />
        );
    }

    const header: React.ReactNode = (
        <SelectInput name="resultsPerPage"
                className={`form-select form-select-sm ${props.blockColor}`}
                style={{ width: "fit-content" }}
                disabled={isReloading}
                options={model.resultsPerPageOptions.map(option => ({
                    value: option.toString(),
                    displayName: option.toString()
                }))}
                value={model.resultsPerPage.toString()}
                onValueChanged={resultsPerPage => setModel(model => ({
                    ...model,
                    resultsPerPage: parseInt(resultsPerPage)
                }))} />
    );

    return (
        <MainBlock title={`${resourceDisplayName} gần nhất`} color={props.blockColor}
                className={`block-order-list mb-3 ${styles["hasProductList"]}`}
                header={header}
                bodyClassName={isReloading ? "opacity-50 pe-none" : ""}
                bodyPadding="0">
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
                                        <i className="bi bi-eye"></i>
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

const SupplyList = ({productId, isInitialLoading, onInitialLoadingFinished}: Props) => {
    // Dependencies.
    const service = useMemo(useSupplyService, []);

    return (
        <HasProductList productId={productId} resourceType="supply" blockColor="primary"
                isInitialLoading={isInitialLoading}
                onInitialLoadingFinished={onInitialLoadingFinished}
                onLoadAsync={async (requestDto) => {
                    const responseDto = await service.getListAsync(requestDto);
                    return responseDto.items.map(dto => new SupplyBasicModel(dto));
                }}/>
    );
};

const OrderList = ({productId, isInitialLoading, onInitialLoadingFinished}: Props) => {
    // Dependencies.
    const service = useMemo(useOrderService, []);

    return (
        <HasProductList productId={productId} resourceType="order" blockColor="success"
                isInitialLoading={isInitialLoading}
                onInitialLoadingFinished={onInitialLoadingFinished}
                onLoadAsync={async (requestDto) => {
                    const responseDto = await service.getListAsync(requestDto);
                    return responseDto.items.map(dto => new OrderBasicModel(dto));
                }}/>
    );
};

const TreatmentList = ({productId, isInitialLoading, onInitialLoadingFinished}: Props) => {
    // Dependencies.
    const service = useMemo(useTreatmentService, []);

    return (
        <HasProductList productId={productId} resourceType="treatment" blockColor="danger"
                isInitialLoading={isInitialLoading}
                onInitialLoadingFinished={onInitialLoadingFinished}
                onLoadAsync={async (requestDto) => {
                    const responseDto = await service.getListAsync(requestDto);
                    return responseDto.items.map(dto => new TreatmentBasicModel(dto));
                }}/>
    );
};

export { SupplyList, OrderList, TreatmentList };