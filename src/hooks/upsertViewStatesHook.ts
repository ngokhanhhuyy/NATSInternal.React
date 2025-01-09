import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useViewStates } from "./viewStatesHook";

export function useUpsertViewStates() {
    const alertModalStore = useAlertModalStore();
    const navigate = useNavigate();
    const [pendingNavigation, setPendingNavigation] = useState<{ to: any } | null>(null);
    let leavingConfirmation = true;

    const clearLeavingConfirmation = () => { leavingConfirmation = false; };
    const {
        isInitialLoading,
        onInitialLoadingFinished,
        modelState,
        AuthorizationError,
        ValidationError,
        initialData,
        getDisplayName,
        routeGenerator
    } = useViewStates();

    // useBlocker(({ nextLocation }) => {
    //     if (!leavingConfirmation) {
    //         return true;
    //     }

    //     setPendingNavigation({ to: nextLocation });
    //     alertModalStore.getDiscardingConfirmationAsync().then(answer => {
    //         if (answer) {
    //             navigate(pendingNavigation!.to.pathname);
    //         }
    //     });
    //     return false;
    // });

    return {
        isInitialLoading, onInitialLoadingFinished,
        modelState,
        clearLeavingConfirmation,
        initialData,
        getDisplayName,
        routeGenerator,
        AuthorizationError,
        ValidationError,
    };
}