import React, { useMemo } from "react";
import { useOrderService } from "@/services/orderService";
import { OrderListModel } from "@/models/order/orderListModel";

// Shared component.
import ExportProductListView
    from "@/views/shared/exportProduct/exportProductList/ExportProductListView";

// Component.
const OrderListView = () => {
    // Dependencies.
    const service = useMemo(useOrderService, []);

    return (
        <ExportProductListView
            resourceType="order"
            initializeModel={(initialData) => new OrderListModel(initialData.order)}
            getListAsync={async (model, setModel) => {
                const responseDto = await service.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            }}
        />
    );
};

export default OrderListView;