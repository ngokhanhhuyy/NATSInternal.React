import React, { useMemo } from "react";
import { OrderUpsertModel } from "@/models/order/orderUpsertModel";
import { OrderUpsertItemModel } from "@/models/order/orderItem/orderUpsertItemModel";
import { useOrderService } from "@/services/orderService";
import { AuthorizationError } from "@/errors";

// Shared component.
import ExportProductUpsertView
    from "@/views/shared/exportProduct/exportProductUpsert/ExportProductUpsertView";

// Component.
const OrderUpsertView = ({ id }: { id?: number }) => {
    // Dependencies.
    const service = useMemo(useOrderService, []);

    // Callbacks.
    const initialLoadAsync = async (
            model: OrderUpsertModel,
            initialData: ResponseDtos.InitialData) =>
    {
        if (id == null) {
            const authorization = initialData.order.creatingAuthorization;
            if (!authorization) {
                throw new AuthorizationError();
            }

            return model.fromCreatingAuthorizationResponseDto(authorization);
        } else {
            const responseDto = await service.getDetailAsync(id);
            return model.fromDetailResponseDto(responseDto);
        }
    };

    const handleSubmissionAsync = async (model: OrderUpsertModel) => {
        if (id == null) {
            return await service.createAsync(model.toRequestDto());
        }

        await service.updateAsync(id, model.toRequestDto());
        return id;
    };

    const handleDeletionAsync = async () => {
        if (id != null) {
            await service.deleteAsync(id);
        }
    };

    return (
        <ExportProductUpsertView
            resourceType="order"
            isForCreating={id == null}
            initializeModel={() => new OrderUpsertModel()}
            initialLoadAsync={initialLoadAsync}
            initializeItemModel={(product) => new OrderUpsertItemModel(product)}
            submitAsync={handleSubmissionAsync}
            deleteAsync={handleDeletionAsync}
            getListRoute={(routeGenerator) => routeGenerator.getOrderListRoutePath()}
            getDetailRoute={(routeGenerator, id) => routeGenerator.getOrderDetailRoutePath(id)}
        />
    );
};

export default OrderUpsertView;