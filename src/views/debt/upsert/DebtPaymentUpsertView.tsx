import React, { useMemo } from "react";
import { DebtPaymentUpsertModel } from "@/models/debtPayment/debtPaymentUpsertModel";
import { useDebtPaymentService } from "@/services/debtPaymentService";
import { AuthorizationError } from "@/errors";

// Shared component.
import DebtUpsertView from "./DebtUpsertView";

// Component.
const DebtPaymentUpsertView = ({ id }: { id?: number }) => {
    // Dependencies.
    const service = useDebtPaymentService();
    
    return (
        <DebtUpsertView
            displayName={(getDisplayName) => getDisplayName("debtPayment")}
            isForCreating={id == null}
            initializeModel={() => new DebtPaymentUpsertModel()}
            loadFromCreatingAuthorization={(initialData, setModel) => {
                const authorization = initialData.debtPayment.creatingAuthorization;
                if (!authorization) {
                    throw new AuthorizationError();
                }

                setModel(model => model.fromCreatingAuthorizationResponseDto(authorization));
            }}
            loadFromDetailAsync={async (setModel) => {
                const responseDto = await service.getDetailAsync(id!);
                setModel(model => model.fromDetailResponseDto(responseDto));
            }}
            submitAsync={async (model) => {
                if (!id) {
                    return await service.createAsync(model.toRequestDto());
                }

                await service.updateAsync(id, model.toRequestDto());
                return id;
            }}
            onSubmissionSucceededAsync={async (submissionResult, navigate, routeGenerator) => {
                await navigate(routeGenerator
                    .getDebtPaymentDetailRoutePath(submissionResult));
            }}
            deleteAsync={async () => await service.deleteAsync(id!)}
            onDeletionSucceededAsync={async (navigate, routeGenerator) => {
                await navigate(routeGenerator.getDebtPaymentListRoutePath());
            }}
        />
    );
};

export default DebtPaymentUpsertView;