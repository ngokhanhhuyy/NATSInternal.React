import React, { useMemo } from "react";
import { useOrderService } from "@/services/orderService";
import { OrderDetailModel } from "@/models/order/orderDetailModel";

// Shared component.
import ExportProductDetailView from
    "@/views/shared/exportProduct/exportProductDetail/ExportProductDetailView";

// Component.
const OrderDetailView = ({ id }: { id: number }) => {
    // Dependency.
    const service = useOrderService();

    // Callbacks.
    const initialLoadAsync = async () => {
        const responseDto = await service.getDetailAsync(id);
        return new OrderDetailModel(responseDto);
    };

    return (
        <ExportProductDetailView
            resourceType="order"
            initialLoadAsync={initialLoadAsync}
        />
    );
};

export default OrderDetailView;