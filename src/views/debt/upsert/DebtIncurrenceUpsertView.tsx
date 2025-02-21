import React, { useMemo } from "react";
import { DebtIncurrenceUpsertModel } from "@/models/debtIncurrence/debtIncurrenceUpsertModel";
import { useDebtIncurrenceService } from "@/services/debtIncurrenceService";
import { AuthorizationError } from "@/errors";

// Shared component.
import DebtUpsertView from "./DebtUpsertView";

// Component.
const DebtIncurrenceUpsertView = ({ id }: { id?: number }) => {
    // Dependencies.
    const service = useDebtIncurrenceService();
    
    return (
        <DebtUpsertView
            displayName={(getDisplayName) => getDisplayName("debtIncurrence")}
            isForCreating={id == null}
            initializeModel={() => new DebtIncurrenceUpsertModel()}
            loadFromCreatingAuthorization={(initialData, setModel) => {
                const authorization = initialData.debtIncurrence.creatingAuthorization;
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
                    .getDebtIncurrenceDetailRoutePath(submissionResult));
            }}
            deleteAsync={async () => await service.deleteAsync(id!)}
            onDeletionSucceededAsync={async (navigate, routeGenerator) => {
                await navigate(routeGenerator.getDebtIncurrenceListRoutePath());
            }}
        />
    );
};

export default DebtIncurrenceUpsertView;