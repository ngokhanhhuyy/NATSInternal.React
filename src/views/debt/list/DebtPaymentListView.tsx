import React, { useMemo } from "react";
import { useDebtPaymentService } from "@/services/debtPaymentService";
import { DebtPaymentListModel } from "@/models/debtPayment/debtPaymentListModel";

// Shared component.
import DebtListView from "./DebtListView";

// Component.
const DebtPaymentListView = () => {
    // Dependencies.
    const service = useDebtPaymentService();
    
    return (
        <DebtListView
            resourceType="debtPayment"
            initializeModel={(initialData) => {
                return new DebtPaymentListModel(initialData.debtPayment);
            }}
            loadAsync={async (model, setModel) => {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            }}
        />
    );
};

export default DebtPaymentListView;