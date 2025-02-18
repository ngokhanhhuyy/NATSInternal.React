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
    const [initialLoadingStates, setInitialLoadingStates] = useState(() => ({
        productDetail: true,
        supplyList: true,
        orderList: true,
        treatmentList: true
    }));

    // Effect.
    useEffect(() => {
        const { productDetail, supplyList, orderList, treatmentList } = initialLoadingStates;
        if (!productDetail && !supplyList && !orderList && !treatmentList) {
            onInitialLoadingFinished();
        }
    }, [initialLoadingStates]);

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3">
                {/* Product Detail */}
                <div className="col col-xl-4 col-lg-5 col-md-5 col-sm-12 col-12
                                mb-md-0 mb-sm-3">
                    <ProductDetail
                        id={id}
                        onInitialLoadingFinished={() => {
                            setInitialLoadingStates(states => ({
                                ...states,
                                productDetail: false
                            }));
                        }}
                    />
                </div>

                {/* Recent supply, orders and treatments */}
                {!initialLoadingStates.productDetail && (
                    <div className="col">
                        <div className="d-flex flex-column">
                            {/* Most recent supplies */}
                            <SupplyList
                                productId={id}
                                isInitialLoading={initialLoadingStates.supplyList}
                                onInitialLoadingFinished={() => {
                                    setInitialLoadingStates(states => ({
                                        ...states,
                                        supplyList: false
                                    }));
                                }}
                            />

                            {/* Most recent orders */}
                            <OrderList
                                productId={id}
                                isInitialLoading={initialLoadingStates.orderList}
                                onInitialLoadingFinished={() => {
                                    setInitialLoadingStates(states => ({
                                        ...states,
                                        orderList: false
                                    }));
                                }}
                            />

                            {/* Most recent treatments */}
                            <TreatmentList
                                productId={id}
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
                )}
            </div>
        </MainContainer>
    );
};

export default ProductDetailView;