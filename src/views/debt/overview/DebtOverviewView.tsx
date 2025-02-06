import React, { useState, useMemo, useEffect } from "react";
import { useDebtIncurrenceService } from "@/services/debtIncurrenceService";
import { useDebtPaymentService } from "@/services/debtPaymentService";
import { DebtIncurrenceListModel } from "@/models/debtIncurrence/debtIncurrenceListModel";
import { DebtPaymentListModel } from "@/models/debtPayment/debtPaymentListModel";
import { useViewStates } from "@/hooks/viewStatesHook";

// Layout component.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child component.
import CustomerList from "./customerList/CustomerListComponent";
import DebtList from "./debtList/DebtListComponent";

// Component.
const DebtOverviewView = () => {
    // Dependencies.
    const debtIncurrenceService = useMemo(useDebtIncurrenceService, []);
    const debtPaymentService = useMemo(useDebtPaymentService, []);

    // States.
    const [initialLoadingState, setInitialLoadingState] = useState(() => ({
        customerList: true,
        debtIncurrenceList: true,
        debtPaymentList: true
    }));
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();

    // Effect.
    useEffect(() => {
        const { customerList, debtIncurrenceList, debtPaymentList } = initialLoadingState;
        if (!customerList && !debtIncurrenceList && !debtPaymentList) {
            onInitialLoadingFinished();
        }
    }, [initialLoadingState]);

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3 justify-content-start">
                {/* Filter */}
                <div className="col col-12">
                    <CustomerList
                        isInitialLoading={initialLoadingState.customerList}
                        onInitialLoadingFinished={() => {
                            setInitialLoadingState(state => ({
                                ...state,
                                customerList: false
                            }));
                        }}
                    />
                </div>
    
                {/* DebtIncurrences */}
                <div className="col col-xl-6 col-12">
                    <DebtList
                        displayName={(store) => store.getDisplayName("debtIncurrence")}
                        color="danger"
                        listRoute={(routeGenerator) => {
                            return routeGenerator.getDebtIncurrenceListRoutePath();
                        }}
                        initializeModel={(initialData, requestDto) => {
                            return new DebtIncurrenceListModel(
                                initialData.debtIncurrence,
                                requestDto);
                        }}
                        loadAsync={async (model, setModel) => {
                            const responseDto = await debtIncurrenceService
                                .getListAsync(model.toRequestDto());
                            setModel(model => model.fromListResponseDto(responseDto));
                        }}
                        isInitialLoading={initialLoadingState.debtIncurrenceList}
                        onInitialLoadingFinished={() => {
                            setInitialLoadingState(state => ({
                                ...state,
                                debtIncurrenceList: false
                            }));
                        }}
                    />
                </div>
    
                {/* DebtPayment */}
                <div className="col col-xl-6 col-12">
                    <DebtList
                        displayName={(store) => store.getDisplayName("debtPayment")}
                        color="success"
                        listRoute={(routeGenerator) => {
                            return routeGenerator.getDebtPaymentListRoutePath();
                        }}
                        initializeModel={(initialData, requestDto) => {
                            return new DebtPaymentListModel(
                                initialData.debtPayment,
                                requestDto);
                        }}
                        loadAsync={async (model, setModel) => {
                            const responseDto = await debtPaymentService
                                .getListAsync(model.toRequestDto());
                            setModel(model => model.fromListResponseDto(responseDto));
                        }}
                        isInitialLoading={initialLoadingState.debtIncurrenceList}
                        onInitialLoadingFinished={() => {
                            setInitialLoadingState(state => ({
                                ...state,
                                debtPaymentList: false
                            }));
                        }}
                    />
                </div>
            </div>
        </MainContainer>
    );
};

export default DebtOverviewView;