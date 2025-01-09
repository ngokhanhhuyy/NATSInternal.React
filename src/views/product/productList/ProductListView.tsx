import React, { useState, useEffect } from "react";
import { useViewStates } from "@/hooks/viewStatesHook";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child components.
import MainList from "./mainList/MainListComponent";
import { ProductCategoryList, BrandList } from "./secondaryList/SecondaryListComponent";

const ProductListView = () => {
    // States.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [initialLoadingState, setInitialLoadingState] = useState(() => ({
        productList: true,
        categoryList: true,
        brandList: true
    }));

    // Effect.
    useEffect(() => {
        const { productList, categoryList, brandList } = initialLoadingState;
        if (!productList && !categoryList && !brandList) {
            onInitialLoadingFinished();
        }
    }, [initialLoadingState]);

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-0 p-0">
                <div className="col col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12 p-0">
                    <MainList isInitialLoading={initialLoadingState.productList}
                            onInitialLoadingFinished={() => {
                                setInitialLoadingState(state => ({
                                    ...state, productList: false
                                }));
                            }}/>
                </div>
                <div className="col p-0">
                    <div className="row g-3">
                        <div className="col col-xl-12 col-lg-6 col-md-6 col-sm-6 col-12">
                            {/* Brand */}
                            <BrandList isInitialLoading={initialLoadingState.brandList}
                                    onInitialLoadingFinished={() => {
                                        setInitialLoadingState(state => ({
                                            ...state,
                                            brandList: false
                                        }));
                                    }} />
                        </div>
                        <div className="col col-xl-12 col-lg-6 col-md-6 col-sm-6 col-12">
                            <ProductCategoryList
                                    isInitialLoading={initialLoadingState.categoryList}
                                    onInitialLoadingFinished={() => {
                                        setInitialLoadingState(state => ({
                                            ...state,
                                            categoryList: false
                                        }));
                                    }} />
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
};

export default ProductListView;