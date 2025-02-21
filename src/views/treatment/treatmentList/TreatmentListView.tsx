import React, { useMemo } from "react";
import { useTreatmentService } from "@/services/treatmentService";
import { TreatmentListModel } from "@/models/treatment/treatmentListModel";

// Shared component.
import ExportProductListView
    from "@/views/shared/exportProduct/exportProductList/ExportProductListView";

// Component.
const TreatmentListView = () => {
    // Dependencies.
    const service = useTreatmentService();

    return (
        <ExportProductListView
            resourceType="treatment"
            initializeModel={(initialData) => new TreatmentListModel(initialData.treatment)}
            getListAsync={async (model, setModel) => {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            }}
        />
    );
};

export default TreatmentListView;