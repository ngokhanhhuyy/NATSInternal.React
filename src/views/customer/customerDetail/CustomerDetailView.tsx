import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type CustomerDetailModel } from "@/models/customer/customerDetailModel";
import { useViewStates } from "@/hooks/viewStatesHook";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child components.
import CustomerDetail from "./CustomerDetailComponent";
import CustomerDebtOperations from "./CustomerDebtOperationsComponent";
import { ConsultantList, OrderList, TreatmentList } from "./HasCustomerListComponent";

// Component.
const CustomerDetailView = ({ id }: { id: number }) => {
    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [loadingState, setLoadingState] = useState(() => ({
        customerDetail: true,
        consultantList: true,
        orderList: true,
        treatmentList: true
    }));
    const [model, setModel] = useState<CustomerDetailModel>();

    // Effect.
    useEffect(() => {
        const { customerDetail, consultantList, orderList, treatmentList } = loadingState;
        if (!customerDetail && !consultantList && !orderList && !treatmentList) {
            onInitialLoadingFinished();
        }
    }, [loadingState]);
    
    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3">

                {/* ResourceAccess */}
                {/* <div className="col col-12">
                    <ResourceAccess resource-type="Customer" :resource-primary-id="model.id"
                            accessMode="Detail" />
                </div> */}

                {/* Detail */}
                <div className="col col-12">
                    <CustomerDetail customerId={id} model={model} setModel={setModel}
                            onInitialLoadingFinished={() => {
                                setLoadingState(state => ({
                                    ...state,
                                    customerDetail: false
                                }));
                            }} />
                </div>

                {/* Debt */}
                {(!model || model?.debtOperations.length) && (
                    <div className="col col-12">
                        <CustomerDebtOperations model={model} />
                    </div>
                )}
            </div>
            <div className="row g-3">

                {/* Consultant */}
                <div className="col col-12">
                    <ConsultantList customerId={id}
                            isInitialLoading={loadingState.consultantList}
                            onInitialLoadingFinished={() => {
                                setLoadingState(state => ({
                                    ...state,
                                    consultantList: false
                                }));
                            }} />
                </div>

                {/* OrderList */}
                <div className="col col-12">
                    <OrderList customerId={id}
                            isInitialLoading={loadingState.orderList}
                            onInitialLoadingFinished={() => {
                                setLoadingState(state => ({
                                    ...state,
                                    orderList: false
                                }));
                            }} />
                </div>

                {/* TreatmentList */}
                <div className="col col-12">
                    <TreatmentList customerId={id}
                            isInitialLoading={loadingState.treatmentList}
                            onInitialLoadingFinished={() => {
                                setLoadingState(state => ({
                                    ...state,
                                    treatmentList: false
                                }));
                            }} />
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