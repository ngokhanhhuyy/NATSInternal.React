import { useState, useEffect, startTransition } from "react";
import { Navigate } from "react-router-dom";
import type { FallbackProps } from "react-error-boundary";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { usePageLoadProgressBarStore } from "@/stores/pageLoadProgressBarStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useRouteGenerator } from "./routeGenerator";
import { AuthorizationError, NotFoundError, OperationError, ValidationError } from "@/errors";

// Component.
const ErrorFallback = (props: FallbackProps) => {
    // Dependencies.
    const alertModalStore = useAlertModalStore();
    const finishPageLoading = usePageLoadProgressBarStore(store => store.finish);
    const routeGenerator = useRouteGenerator();

    // States.
    const [isConfirmed, setConfirmed] = useState<boolean>(() => false);

    // Effect.
    useEffect(() => {
        getConfirmation().then(() => setConfirmed(true));
        finishPageLoading();
    }, []);

    // Callbacks.
    const getConfirmation = async (): Promise<void> => {
        if (props.error instanceof NotFoundError) {
            await alertModalStore.getNotFoundConfirmationAsync();
        } else if (props.error instanceof ValidationError ||
                props.error instanceof OperationError) {
            await alertModalStore.getSubmissionErrorConfirmationAsync();
        } else if (props.error instanceof AuthorizationError) { 
            await alertModalStore.getUnauthorizationConfirmationAsync();
        } else {
            await alertModalStore.getUndefinedErrorConfirmationAsync();
        }
    };

    if (!isConfirmed) {
        return null;
    }

    switch (props.error.constructor) {
        case NotFoundError:
        case ValidationError:
        case OperationError:
        case AuthorizationError:
            return <Navigate to={routeGenerator.getHomeRoutePath()} />;
        default:
            window.location.reload();
            return null;
    }
};

export default ErrorFallback;