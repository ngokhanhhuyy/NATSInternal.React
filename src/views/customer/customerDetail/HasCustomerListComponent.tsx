import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ConsultantListModel } from "@/models/consultant/consultantListModel";
import { OrderListModel } from "@/models/order/orderListModel";
import { TreatmentListModel } from "@/models/treatment/treatmentListModel";
import { useConsultantService } from "@/services/consultantService";
import { useOrderService } from "@/services/orderService";
import { useTreatmentService } from "@/services/treatmentService";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useAmountUtility } from "@/utilities/amountUtility";
import { useRouteGenerator } from "@/router/routeGenerator";
import { ValidationError } from "@/errors";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";
import MainBlockPaginator from "@/views/layouts/MainBlockPaginatorComponent";
import { LoadingListBlock } from "@/views/layouts/LoadingView";

// Utility.
const amountUtility = useAmountUtility();

export interface HasCustomerListProps<
        TListModel extends IHasCustomerListModel<TBasicModel, TAuthorizationModel>,
        TBasicModel extends IHasCustomerBasicModel<TAuthorizationModel>,
        TAuthorizationModel extends IHasStatsExistingAuthorizationModel> {
    resourceType: string;
    blockColor: "primary" | "success" | "danger";
    idPrefix: string;
    customerId: number;
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
    initializeModel: (
        requestDto: { customerId: number, resultsPerPage: number },
        initialData: ResponseDtos.InitialData) => TListModel;
    onLoadAsync: (
        model: TListModel,
        setModel: React.Dispatch<React.SetStateAction<TListModel>>) => Promise<void>;
};

const HasCustomerList = <
            TListModel extends IHasCustomerListModel<TBasicModel, TAuthorizationModel>,
            TBasicModel extends IHasCustomerBasicModel<TAuthorizationModel>,
            TAuthorizationModel extends IHasStatsExistingAuthorizationModel>
        (props: HasCustomerListProps<TListModel, TBasicModel, TAuthorizationModel>) => {
    // Dependencies.
    const initialDataStore = useInitialDataStore();
    const alertModalStore = useAlertModalStore();
    const navigate = useNavigate();
    const routeGenerator = useMemo(() => useRouteGenerator(), []);

    // Model and state.
    const [model, setModel] = useState<TListModel>(() => {
        const requestDto = { resultsPerPage: 5, customerId: props.customerId };
        return props.initializeModel(requestDto, initialDataStore.data);
    });

    const [isReloading, setIsReloading] = useState<boolean>(false);

    // Computed.
    const resourceDisplayName = useMemo(() => {
        return initialDataStore.getDisplayName(props.resourceType);
    }, []);

    // Effect.
    useEffect(() => { 
        const fetchData = async () => {
            try {
                await props.onLoadAsync(model, setModel);
            } catch (error) {
                if (error instanceof ValidationError) {
                    await alertModalStore.getSubmissionErrorConfirmationAsync();
                    await navigate(routeGenerator.getCustomerListRoutePath());
                    return;
                }

                throw error;
            } finally {
                props.onInitialLoadingFinished();
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!props.isInitialLoading) {
            reloadAsync(); 
        }
    }, [model.page]);

    if (props.isInitialLoading) {
        return <LoadingListBlock color={props.blockColor} hasHeader length={3}
                detailSecondaryTextLineCount={0} />;
    }

    // Functions.
    const reloadAsync = async (): Promise<void> => {
        setIsReloading(true);
        try {
            await Promise.all([
                props.onLoadAsync(model, setModel),
                new Promise(resolve => setTimeout(resolve, 250))
            ]);
        } catch (error) {
            if (error instanceof ValidationError) {
                await alertModalStore.getSubmissionErrorConfirmationAsync();
                return;
            }

            throw error;
        } finally {
            props.onInitialLoadingFinished();
            setIsReloading(false);
        }
    };

    const computeHeader = () => {
        if (!model.items.length) {
            return null;
        }

        return  (
            <MainBlockPaginator page={model.page}
                    onPageChanged={(page) => setModel({ ...model, page })}
                    pageCount={model.pageCount}
                    onPageCountChanged={(pageCount) => setModel({ ...model, pageCount })}
                    color={props.blockColor} />
        );
    };

    return (
        <MainBlock title={resourceDisplayName} className="h-100" header={computeHeader()}
                bodyClassName="h-100" bodyPadding={0} color={props.blockColor}
                style={{ pointerEvents: isReloading ? "none" : "auto" }}>
            <ul className="list-group list-group-flush">
                <ListBody model={model} resourceDisplayName={resourceDisplayName}
                        idPrefix={props.idPrefix} />
            </ul>
        </MainBlock>
    );
};

interface ListBodyProps<
        TListModel extends IHasCustomerListModel<TBasicModel, TAuthorizationModel>,
        TBasicModel extends IHasCustomerBasicModel<TAuthorizationModel>,
        TAuthorizationModel extends IHasStatsExistingAuthorizationModel> {
    model: TListModel,
    resourceDisplayName: string,
    idPrefix: string;
}

const ListBody = <
            TListModel extends IHasCustomerListModel<TBasicModel, TAuthorizationModel>,
            TBasicModel extends IHasCustomerBasicModel<TAuthorizationModel>,
            TAuthorizationModel extends IHasStatsExistingAuthorizationModel>
        (props: ListBodyProps<TListModel, TBasicModel, TAuthorizationModel>) => {
    const { model, resourceDisplayName } = props;
    if (!model.items.length) {
        return (
            <li className="list-group-item p-4 bg-transparent d-flex justify-content-center
                            align-items-center opacity-50">
                Không có { resourceDisplayName.toLowerCase() } nào
            </li>
        );
    }
    
    function getIdClass(isLocked: boolean): string {
        return !isLocked ? "text-primary" : "text-danger";
    }

    return model.items.map(resource => (
        <li className="list-group-item p-0 bg-transparent
                        d-flex align-items-center px-2 py-lg-0 py-2"
                key={resource.id}>
            <div className="row gx-3 small flex-fill">
                <div className="col col-md-5 col-12 d-flex flex-column justify-content-center">
                    <div className="row gx-3">
                        {/* Id */}
                        <div className={`col col-lg-5 col-12
                                        ${getIdClass(resource.isLocked)}`}>
                            <i className="bi bi-record-circle me-2"></i>
                            {props.idPrefix}{resource.id}
                        </div>

                        {/* Amount */}
                        <div className="col">
                            <i className="bi bi-cash me-2 text-primary"></i>
                            {amountUtility.getDisplayText(resource.amount)}
                        </div>
                    </div>
                </div>
                <div className="col d-flex flex-column">
                    <div className="row gx-3 d-md-flex d-none">
                        {/* Date */}
                        <div className="col col-lg-7 col-12">
                            <i className="bi bi-calendar-week me-2 text-primary"></i>
                            {resource.statsDateTime.date}
                        </div>

                        {/* Time */}
                        <div className="col">
                            <i className="bi bi-clock me-2 text-primary"></i>
                            {resource.statsDateTime.time}
                        </div>
                    </div>

                    <div className="d-md-none d-flex px-2">
                        <i className="bi bi-calendar-week me-2 text-primary"></i>
                        <span className="mx-1">
                            {resource.statsDateTime.dateTime}
                        </span>
                    </div>
                </div>
            </div>

            {/* Route */}
            <Link to={resource.detailRoute}
                    className="btn btn-outline-primary btn-sm m-2 flex-shrink-0">
                <i className="bi bi-eye"></i>
            </Link>
        </li>
    ));
};

interface Props {
    customerId: number;
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
}

export const ConsultantList = (props: Props) => {
    const service = useMemo(useConsultantService, []);

    return (
        <HasCustomerList resourceType="consultant" blockColor="primary" idPrefix="TV"
                customerId={props.customerId} isInitialLoading={props.isInitialLoading}
                onInitialLoadingFinished={props.onInitialLoadingFinished}
                initializeModel={(requestDto, initialData) => {
                    return new ConsultantListModel(initialData.consultant, requestDto);
                }}
                onLoadAsync={async (model, setModel) => {
                    const responseDto = await service.getListAsync(model.toRequestDto());
                    setModel(model => model.fromListResponseDto(responseDto));
                }} />
    );
};

export const OrderList = (props: Props) => {
    const service = useMemo(useOrderService, []);

    return (
        <HasCustomerList resourceType="order" blockColor="success" idPrefix="BL"
                customerId={props.customerId} isInitialLoading={props.isInitialLoading}
                onInitialLoadingFinished={props.onInitialLoadingFinished}
                initializeModel={(requestDto, initialData) => {
                    return new OrderListModel(initialData.order, requestDto);
                }}
                onLoadAsync={async (model, setModel) => {
                    const responseDto = await service.getListAsync(model.toRequestDto());
                    setModel(model => model.fromListResponseDto(responseDto));
                }} />
    );
};

export const TreatmentList = (props: Props) => {
    const service = useMemo(useTreatmentService, []);

    return (
        <HasCustomerList resourceType="treatment" blockColor="danger" idPrefix="LT"
                customerId={props.customerId} isInitialLoading={props.isInitialLoading}
                onInitialLoadingFinished={props.onInitialLoadingFinished}
                initializeModel={(requestDto, initialData) => {
                    return new TreatmentListModel(initialData.order, requestDto);
                }}
                onLoadAsync={async (model, setModel) => {
                    const responseDto = await service.getListAsync(model.toRequestDto());
                    setModel(model => model.fromListResponseDto(responseDto));
                }} />
    );
};