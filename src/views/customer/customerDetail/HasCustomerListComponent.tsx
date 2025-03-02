import React, { useState, useMemo, useEffect, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ConsultantListModel } from "@/models/consultant/consultantListModel";
import { OrderListModel } from "@/models/order/orderListModel";
import { TreatmentListModel } from "@/models/treatment/treatmentListModel";
import { useConsultantService } from "@/services/consultantService";
import { useOrderService } from "@/services/orderService";
import { useTreatmentService } from "@/services/treatmentService";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useAmountUtility } from "@/utilities/amountUtility";
import { useRouteGenerator } from "@/router/routeGenerator";
import { ValidationError } from "@/errors";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";
import MainBlockPaginator from "@/views/layouts/MainBlockPaginatorComponent";

// Utility.
const amountUtility = useAmountUtility();

// Services.
const consultantService = useConsultantService();
const orderService = useOrderService();
const treatmentService = useTreatmentService();

export interface HasCustomerListProps<
        TList extends IHasCustomerListModel<TList, TBasic, TAuthorization>,
        TBasic extends IHasCustomerBasicModel<TAuthorization>,
        TAuthorization extends IHasStatsExistingAuthorizationModel> {
    resourceType: string;
    blockColor: "primary" | "success" | "danger";
    idPrefix: string;
    customerId: number;
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
    initializeModelAsync: (
        requestDto: { customerId: number, resultsPerPage: number },
        initialData: ResponseDtos.InitialData) => Promise<TList>;
    onModelReloadAsync: (
        model: TList,
        setModel: React.Dispatch<React.SetStateAction<TList>>) => Promise<void>;
};

const HasCustomerList = <
            TList extends IHasCustomerListModel<TList, TBasic, TAuthorization>,
            TBasic extends IHasCustomerBasicModel<TAuthorization>,
            TAuthorization extends IHasStatsExistingAuthorizationModel>
        (props: HasCustomerListProps<TList, TBasic, TAuthorization>) => {
    // Dependencies.
    const initialDataStore = useInitialDataStore();
    const alertModalStore = useAlertModalStore();
    const navigate = useNavigate();
    const routeGenerator = useMemo(() => useRouteGenerator(), []);

    // Model and state.
    const initializedModel = useAsyncModelInitializer({
        initializer: async () => {
            const requestDto = { resultsPerPage: 5, customerId: props.customerId };
            return props.initializeModelAsync(requestDto, initialDataStore.data);
        },
        cacheKey: `customerDetail_${props.resourceType}List`
    });
    const [model, setModel] = useState<TList>(() => initializedModel);
    const [isReloading, setIsReloading] = useState<boolean>(false);

    // Computed.
    const resourceDisplayName = useMemo(() => {
        return initialDataStore.getDisplayName(props.resourceType);
    }, []);

    // Effect.
    useEffect(() => { 
        if (!props.isInitialLoading) {
            setIsReloading(true);
            startTransition(async () => {
                try {
                    await props.onModelReloadAsync(model, setModel);
                } catch (error) {
                    if (error instanceof ValidationError) {
                        await alertModalStore.getSubmissionErrorConfirmationAsync();
                        await navigate(routeGenerator.getCustomerListRoutePath());
                        return;
                    }
    
                    throw error;
                } finally {
                    setIsReloading(false);
                }
            });
        } else {
            props.onInitialLoadingFinished();
        }
    }, [model.page]);

    // Header.
    const computeHeader = () => {
        if (!model.items.length) {
            return null;
        }

        return (
            <>
                {isReloading && (
                    <div className="spinner-border spinner-border-sm me-3" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                )}
                <MainBlockPaginator
                    page={model.page}
                    onPageChanged={(page) => setModel(model => model.from({ ...model, page }))}
                    pageCount={model.pageCount}
                    onPageCountChanged={(pageCount) => setModel({ ...model, pageCount })}
                    color={props.blockColor}
                />
            </>
        );
    };

    return (
        <MainBlock
            title={resourceDisplayName}
            className="h-100"
            header={computeHeader()}
            bodyClassName="h-100" bodyPadding={0} color={props.blockColor}
            style={{ pointerEvents: isReloading ? "none" : "auto" }}
        >
            <ul className={`list-group list-group-flush
                            ${isReloading ? "opacity-50 pe-none" : ""}`}>
                <ListBody
                    model={model}
                    resourceDisplayName={resourceDisplayName}
                    idPrefix={props.idPrefix}
                />
            </ul>
        </MainBlock>
    );
};

interface ListBodyProps<
        TList extends IHasCustomerListModel<TList, TBasic, TAuthorization>,
        TBasic extends IHasCustomerBasicModel<TAuthorization>,
        TAuthorization extends IHasStatsExistingAuthorizationModel> {
    model: TList,
    resourceDisplayName: string,
    idPrefix: string;
}

const ListBody = <
            TList extends IHasCustomerListModel<TList, TBasic, TAuthorizationModel>,
            TBasic extends IHasCustomerBasicModel<TAuthorizationModel>,
            TAuthorizationModel extends IHasStatsExistingAuthorizationModel>
        (props: ListBodyProps<TList, TBasic, TAuthorizationModel>) => {
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
                <i className="bi bi-info-circle"></i>
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
    // Dependencies.
    const service = useConsultantService();

    return (
        <HasCustomerList
            resourceType="consultant"
            blockColor="primary"
            idPrefix="TV"
            customerId={props.customerId}
            isInitialLoading={props.isInitialLoading}
            onInitialLoadingFinished={props.onInitialLoadingFinished}
            initializeModelAsync={async (requestDto, initialData) => {
                const responseDto = await consultantService.getListAsync(requestDto);
                return new ConsultantListModel(initialData.consultant, requestDto)
                    .fromListResponseDto(responseDto);
            }}
            onModelReloadAsync={async (model, setModel) => {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            }}
        />
    );
};

export const OrderList = (props: Props) => {
    const service = useOrderService();

    return (
        <HasCustomerList
            resourceType="order"
            blockColor="success"
            idPrefix="BL"
            customerId={props.customerId}
            isInitialLoading={props.isInitialLoading}
            onInitialLoadingFinished={props.onInitialLoadingFinished}
            initializeModelAsync={async (requestDto, initialData) => {
                const responseDto = await orderService.getListAsync(requestDto);
                return new OrderListModel(initialData.order, requestDto)
                    .fromListResponseDto(responseDto);
            }}
            onModelReloadAsync={async (model, setModel) => {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            }}
        />
    );
};

export const TreatmentList = (props: Props) => {
    const service = useTreatmentService();

    return (
        <HasCustomerList
            resourceType="treatment"
            blockColor="danger"
            idPrefix="LT"
            customerId={props.customerId}
            isInitialLoading={props.isInitialLoading}
            onInitialLoadingFinished={props.onInitialLoadingFinished}
            initializeModelAsync={async (requestDto, initialData) => {
                const responseDto = await treatmentService.getListAsync(requestDto);
                return new TreatmentListModel(initialData.order, requestDto)
                    .fromListResponseDto(responseDto);
            }}
            onModelReloadAsync={async (model, setModel) => {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            }}
        />
    );
};