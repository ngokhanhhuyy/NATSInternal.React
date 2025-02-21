import React, { useMemo } from "react";
import { useDebtIncurrenceService } from "@/services/debtIncurrenceService";
import { DebtIncurrenceDetailModel } from "@/models/debtIncurrence/debtIncurrenceDetailModel";

// Shared component.
import DebtDetailView from "./DebtDetailView";

// Component.
const DebtIncurrenceDetailView = ({ id }: { id: number }) => {
    // Dependencies.
    const service = useDebtIncurrenceService();

    return (
        <DebtDetailView
            displayName={(getDisplayName) => getDisplayName("debtIncurrence")}
            initializeModelAsync={async () => {
                const responseDto = await service.getDetailAsync(id);
                return new DebtIncurrenceDetailModel(responseDto);
            }}
        />
    );
};

export default DebtIncurrenceDetailView;