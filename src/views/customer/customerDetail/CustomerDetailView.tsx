import React, { useState, useEffect, startTransition } from "react";
import { Link } from "react-router-dom";
import { useCustomerService } from "@/services/customerService";
import { useOrderService } from "@/services/orderService";
import { useTreatmentService } from "@/services/treatmentService";
import { useConsultantService } from "@/services/consultantService";
import { CustomerDetailModel } from "@/models/customer/customerDetailModel";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child components.
import CustomerDetail from "./CustomerDetailComponent";
import CustomerDebtOperations from "./CustomerDebtOperationsComponent";
import TransactionList from "./TransactionList";

// Component.
const CustomerDetailView = ({ id }: { id: number }) => {
    // Dependencies.
    const customerService = useCustomerService();
    const consultantService = useConsultantService();
    const orderService = useOrderService();
    const treatmentService = useTreatmentService();

    // Model and states.
    const { isInitialRendering } = useViewStates();
    const initializedModel = useAsyncModelInitializer({
        initializer: async () => {
            const listsRequestDto = { customerId: id, resultsPerPage: 5 };
            const responseDtos = await Promise.all([
                customerService.getDetailAsync(id),
                consultantService.getListAsync(listsRequestDto),
                orderService.getListAsync(listsRequestDto),
                treatmentService.getListAsync(listsRequestDto)
            ]);

            return new CustomerDetailModel(...responseDtos);
        },
        cacheKey: "customerDetail"
    });
    const [model, setModel] = useState<CustomerDetailModel>(() => initializedModel);
    const [reloadingStates, setReloadingStates] = useState(() => ({
        consultantList: false,
        orderList: false,
        treatmentList: false
    }));

    // Effect.
    useEffect(() => {
        if (!isInitialRendering) {
            reload();
        }
    }, [reloadingStates, model]);

    // Callbacks.
    const reload = () => {
        startTransition(async () => {
            if (reloadingStates.consultantList) {
                const requestDto = model.toConsultantListRequestDto();
                const responseDto = await consultantService.getListAsync(requestDto);
                setModel(model => model.from({
                    consultantList: model.consultantList.fromListResponseDto(responseDto)
                }));
                setReloadingStates(states => ({ ...states, consultantList: false }));
            }
            
            if (reloadingStates.orderList) {
                const requestDto = model.toOrderListRequestDto();
                const responseDto = await orderService.getListAsync(requestDto);
                setModel(model => model.from({
                    orderList: model.orderList.fromListResponseDto(responseDto)
                }));
                setReloadingStates(states => ({ ...states, orderList: false }));
            }
            
            if (reloadingStates.treatmentList) {
                const requestDto = model.toTreatmentListRequestDto();
                const responseDto = await treatmentService.getListAsync(requestDto);
                setModel(model => model.from({
                    treatmentList: model.treatmentList.fromListResponseDto(responseDto)
                }));
                setReloadingStates(states => ({ ...states, treatmentList: false }));
            }
        });
    };
    
    return (
        <MainContainer>
            <div className="row g-3">
                {/* Detail */}
                <div className="col col-12">
                    <CustomerDetail model={model} />
                </div>

                {/* Debt */}
                {(!model || model.debtOperations.length != 0) && (
                    <div className="col col-12">
                        <CustomerDebtOperations model={model} />
                    </div>
                )}
            </div>

            <div className="row g-3">
                {/* Consultant */}
                <div className="col col-12">
                    <TransactionList
                        resourceType="consultant"
                        blockColor="primary"
                        idPrefix="TV"
                        customerId={id}
                        isReloading={reloadingStates.consultantList}
                        model={model.consultantList}
                        onModelChanged={(changedData) => {
                            setReloadingStates(states => ({
                                ...states,
                                consultantList: true
                            }));
                            const changedListModel = model.consultantList.from(changedData);
                            setModel(model => model.fromConsultantList(changedListModel));
                        }}
                    />
                </div>

                {/* OrderList */}
                <div className="col col-12">
                    <TransactionList
                        resourceType="order"
                        blockColor="success"
                        idPrefix="BL"
                        customerId={id}
                        isReloading={reloadingStates.orderList}
                        model={model.orderList}
                        onModelChanged={(changedData) => {
                            setReloadingStates(states => ({
                                ...states,
                                orderList: true
                            }));
                            const changedListModel = model.orderList.from(changedData);
                            setModel(model => model.fromOrderList(changedListModel));
                        }}
                    />
                </div>

                {/* TreatmentList */}
                <div className="col col-12">
                    <TransactionList
                        resourceType="treatment"
                        blockColor="danger"
                        idPrefix="LT"
                        customerId={id}
                        isReloading={reloadingStates.treatmentList}
                        model={model.treatmentList}
                        onModelChanged={(changedData) => {
                            setReloadingStates(states => ({
                                ...states,
                                treatmentList: true
                            }));
                            const changedListModel = model.treatmentList.from(changedData);
                            setModel(model => model.fromTreatmentList(changedListModel));
                        }}
                    />
                </div>
            </div>

            {/* Action button */}
            <div className="row g-3 justify-content-end">
                {/* Edit button */}
                {model?.authorization.canEdit && (
                    <div className="col col-auto">
                        <Link to={model.updateRoute} className="btn btn-primary px-3">
                            <i className="bi bi-pencil-square me-1"></i>
                            Sửa
                        </Link>
                    </div>
                )}
            </div>
        </MainContainer>
    );
};

export default CustomerDetailView;