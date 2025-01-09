import type { RouteLocationNormalized } from "vue-router";
import { useAlertModalStore } from "@/stores/alertModal";
import type { IModelState } from "@/hooks/modelStateHook";

export function useUpsertViewUtility() {
    return {
        async routeLeaveConfirmation(
                confirmationBeforeLeaving: boolean,
                to: RouteLocationNormalized,
                modelState: IModelState): Promise<boolean>
        {
            if (confirmationBeforeLeaving && to.name !== "login") {
                const alertModalStore = useAlertModalStore();
                const answer = await alertModalStore.getDiscardingConfirmationAsync();
                if (answer) {
                    modelState.resetErrors();
                    return true;
                }
                return false;
            }

            modelState.resetErrors();
            return true;
        }
    }
}