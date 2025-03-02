import { useEffect, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { AuthorizationError, NotFoundError, OperationError, ValidationError } from "@/errors";

// Props.
interface ErrorFallbackProps {
    error: any;
};

const ErrorFallback = (props: ErrorFallbackProps) => {
    // Dependencies.
    const navigate = useNavigate();
    const alertModalStore = useAlertModalStore();

    // Effect.
    useEffect(() => {
        let alertPromise: Promise<void>;
        if (props.error instanceof NotFoundError) {
            alertPromise = alertModalStore.getNotFoundConfirmationAsync();
        } else if (props.error instanceof ValidationError ||
                props.error instanceof OperationError) {
            alertPromise = alertModalStore.getSubmissionErrorConfirmationAsync();
        } else if (props.error instanceof AuthorizationError) { 
            alertPromise = alertModalStore.getUnauthorizationConfirmationAsync();
        } else {
            alertPromise = alertModalStore.getUndefinedErrorConfirmationAsync();
        }

        alertPromise.then(() => {
            startTransition(() => {
                navigate(-1);
            });
        });
    });

    return null;
};

export default ErrorFallback;