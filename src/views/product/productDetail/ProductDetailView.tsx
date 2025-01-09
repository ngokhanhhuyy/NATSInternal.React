import React, { useState, useEffect } from "react";
import { useViewStates } from "@/hooks/viewStatesHook";

// Layout components.
import MainContainer from "@layouts/MainContainerComponent";

// Child component.
import ProductDetail from "./ProductDetailComponent";
import { SupplyList, OrderList, TreatmentList } from "./HasProductListComponent";

// Component.
const ProductDetailView = ({ id }: { id: number }) => {
    // States.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [initialLoadingState, setInitialLoadingState] = useState(() => ({
        productDetail: true,
        supplyList: true,
        orderList: true,
        treatmentList: true
    }));

    // Effect.
    useEffect(() => {
        const { productDetail, supplyList, orderList, treatmentList } = initialLoadingState;
        if (!productDetail && !supplyList && !orderList && !treatmentList) {
            onInitialLoadingFinished();
        }
    }, [initialLoadingState]);

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3">
                {/* Resource Access */}
                {/* <div className="col col-12">
                    <ResourceAccess resourceType="product" :resource-primary-id="model.id"
                            access-mode="Detail" />
                </div> */}

                {/* Product Detail */}
                <div className="col col-xl-4 col-lg-5 col-md-5 col-sm-12 col-12
                                mb-md-0 mb-sm-3">
                    <ProductDetail id={id}
                            onInitialLoadingFinished={() => {
                                setInitialLoadingState(state => ({
                                    ...state,
                                    productDetail: false
                                }));
                            }} />
                </div>

                {/* Recent supply, orders and treatments */}
                <div className="col">
                    <div className="d-flex flex-column">
                        {/* Most recent supplies */}
                        <SupplyList productId={id}
                                isInitialLoading={initialLoadingState.supplyList}
                                onInitialLoadingFinished={() => {
                                    setInitialLoadingState(state => ({
                                        ...state,
                                        supplyList: false
                                    }));
                                }} />

                        {/* Most recent orders */}
                        <OrderList productId={id}
                                isInitialLoading={initialLoadingState.orderList}
                                onInitialLoadingFinished={() => {
                                    setInitialLoadingState(state => ({
                                        ...state,
                                        orderList: false
                                    }));
                                }} />

                        {/* Most recent treatments */}
                        <TreatmentList productId={id}
                                isInitialLoading={initialLoadingState.treatmentList}
                                onInitialLoadingFinished={() => {
                                    setInitialLoadingState(state => ({
                                        ...state,
                                        treatmentList: false
                                    }));
                                }} />
                    </div>
                </div>
            </div>
        </MainContainer>
    );
};

export default ProductDetailView;