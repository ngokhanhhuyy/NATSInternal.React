import { useEffect } from "react";
import type { FallbackProps } from "react-error-boundary";
import { usePageLoadProgressBarStore } from "@/stores/pageLoadProgressBarStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { AuthorizationError, NotFoundError, OperationError, ValidationError } from "@/errors";

// Component.
const ErrorFallback = (props: FallbackProps) => {
    // Dependencies.
    const alertModalStore = useAlertModalStore();
    const finishPageLoading = usePageLoadProgressBarStore(store => store.finish);

    // Effect.
    useEffect(() => {
        getConfirmation().then(() => {
            props.resetErrorBoundary(props.error.constructor.name as string);
        });
        finishPageLoading();
    }, []);

    // Callbacks.
    const getConfirmation = async (): Promise<void> => {
        if (props.error instanceof NotFoundError) {
            console.log("NotFound");
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

    return null;
};

export default ErrorFallback;