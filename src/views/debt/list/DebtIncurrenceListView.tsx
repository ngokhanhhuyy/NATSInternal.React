import React, { useMemo } from "react";
import { useDebtIncurrenceService } from "@/services/debtIncurrenceService";
import { DebtIncurrenceListModel } from "@/models/debtIncurrence/debtIncurrenceListModel";

// Shared component.
import DebtListView from "./DebtListView";

// Component.
const DebtIncurrenceListView = () => {
    // Dependencies.
    const service = useDebtIncurrenceService();
    
    return (
        <DebtListView
            resourceType="debtIncurrence"
            initializeModel={(initialData) => {
                return new DebtIncurrenceListModel(initialData.debtIncurrence);
            }}
            loadAsync={async (model, setModel) => {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            }}
        />
    );
};

export default DebtIncurrenceListView;