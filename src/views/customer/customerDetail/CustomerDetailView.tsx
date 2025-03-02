import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCustomerService } from "@/services/customerService";
import { CustomerDetailModel } from "@/models/customer/customerDetailModel";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child components.
import CustomerDetail from "./CustomerDetailComponent";
import CustomerDebtOperations from "./CustomerDebtOperationsComponent";
import { ConsultantList, OrderList, TreatmentList } from "./HasCustomerListComponent";

// Component.
const CustomerDetailView = ({ id }: { id: number }) => {
    // Dependencies.
    const customerService = useMemo(() => useCustomerService(), []);

    // Model and states.
    const { onInitialLoadingFinished } = useViewStates();
    const [initialLoadingStates, setInitialLoadingStates] = useState(() => ({
        customerDetail: true,
        consultantList: true,
        orderList: true,
        treatmentList: true
    }));
    const initializedModel = useAsyncModelInitializer({
        initializer: async () => {
            const responseDto = await customerService.getDetailAsync(id);
            return new CustomerDetailModel(responseDto);
        },
        cacheKey: "customerDetail"
    });
    const [model] = useState<CustomerDetailModel>(() => initializedModel);

    // Effect.
    useEffect(() => {
        onInitialLoadingFinished();
    }, []);

    // useEffect(() => {
    //     const { customerDetail, consultantList, orderList, treatmentList } = initialLoadingStates;
    //     if (!customerDetail && !consultantList && !orderList && !treatmentList) {
    //         onInitialLoadingFinished();
    //     }
    // }, [initialLoadingStates]);

    if (!model) {
        return null;
    }
    
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
                    <ConsultantList
                        customerId={id}
                        isInitialLoading={initialLoadingStates.consultantList}
                        onInitialLoadingFinished={() => {
                            setInitialLoadingStates(states => ({
                                ...states,
                                consultantList: false
                            }));
                        }}
                    />
                </div>

                {/* OrderList */}
                <div className="col col-12">
                    <OrderList
                        customerId={id}
                        isInitialLoading={initialLoadingStates.orderList}
                        onInitialLoadingFinished={() => {
                            setInitialLoadingStates(states => ({
                                ...states,
                                orderList: false
                            }));
                        }}
                    />
                </div>

                {/* TreatmentList */}
                <div className="col col-12">
                    <TreatmentList
                        customerId={id}
                        isInitialLoading={initialLoadingStates.treatmentList}
                        onInitialLoadingFinished={() => {
                            setInitialLoadingStates(states => ({
                                ...states,
                                treatmentList: false
                            }));
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