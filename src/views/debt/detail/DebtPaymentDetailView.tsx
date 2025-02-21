import React, { useMemo } from "react";
import { useDebtPaymentService } from "@/services/debtPaymentService";
import { DebtPaymentDetailModel } from "@/models/debtPayment/debtPaymentDetailModel";

// Shared component.
import DebtDetailView from "./DebtDetailView";

// Component.
const DebtPaymentDetailView = ({ id }: { id: number }) => {
    // Dependencies.
    const service = useDebtPaymentService();

    return (
        <DebtDetailView
            displayName={(getDisplayName) => getDisplayName("debtPayment")}
            initializeModelAsync={async () => {
                const responseDto = await service.getDetailAsync(id);
                return new DebtPaymentDetailModel(responseDto);
            }}
        />
    );
};

export default DebtPaymentDetailView;