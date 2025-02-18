import React, { useState, useMemo, useCallback, createContext } from "react";
import { useNavigate } from "react-router-dom";
import type { IModelState } from "@/hooks/modelStateHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import {
    ValidationError,
    OperationError,
    NotFoundError,
    DuplicatedError,
    AuthorizationError } from "@/errors";

export interface FormContext {
    formId: string | null;
    isSubmitting: boolean;
    isDeleting: boolean;
    delete: () => void;
    modelState: IModelState | null;
}

export const FormContext = createContext<FormContext | null>(null);

export interface FormProps<TSubmissionResult>
        extends Omit<React.ComponentPropsWithoutRef<"form">, "action"> {
    children: React.ReactNode | React.ReactNode[];
    modelState?: IModelState;
    formId?: string;
    disabled?: boolean;
    submittingAction: () => Promise<TSubmissionResult>;
    onSubmissionSucceeded: (submissionResult: TSubmissionResult) => Promise<void>;
    submissionSucceededModal?: boolean;
    deletingAction?: () => Promise<void>;
    onDeletionSucceeded?: () => Promise<void>;
    deletionSucceededModal?: boolean;
    row?: boolean;
    gutter?: number;
    justifyContentEnd?: boolean;
}

const Form = <TSubmissionResult,>(props: FormProps<TSubmissionResult>) => {
    const { modelState,
        submittingAction,
        onSubmissionSucceeded,
        deletingAction,
        onDeletionSucceeded } = props;
    const submissionSucceededModal = props.submissionSucceededModal ?? true;
    const deletionSucceededModal = props.deletionSucceededModal ?? true;
    

    // Dependencies.
    const navigate = useNavigate();
    const alertModalStore = useAlertModalStore();
    const routeGenerator = useMemo(useRouteGenerator, []);

    // State.
    const [isSubmitting, setSubmitting] = useState<boolean>(() => false);
    const [isDeleting, setDeleting] = useState<boolean>(() => false);

    // Memo.
    const contextValue = useMemo<FormContext>(() => ({
        formId: props.id ?? null,
        isSubmitting,
        isDeleting,
        delete: async () => await handleDeletionAsync(),
        modelState: props.modelState ?? null
    }), [props.id, isSubmitting, isDeleting, props.modelState]);

    // Computed.
    const computeClassName = () => {
        const names: (string | number | boolean | undefined)[] = [
            props.className,
            props.row && "row",
            props.gutter && `g-${props.gutter}`,
            props.justifyContentEnd && "justify-content-end",
            (isSubmitting || isDeleting || props.disabled) && "pe-none opacity-50"
        ];

        return names.filter(n => n != null).join(" ");
    };

    const computeTabIndex = (): number | undefined => {
        if (isSubmitting || isDeleting) {
            return -1;
        }
    };

    // Callbacks.
    const handleSubmissionAsync = async (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        if (!submittingAction) {
            return;
        }

        setSubmitting(true);

        try {
            const submissionResult = await submittingAction();
            modelState?.clearErrors();
            if (submissionSucceededModal ?? true) {
                await alertModalStore.getSubmissionSuccessConfirmationAsync();
            }
            onSubmissionSucceeded(submissionResult);
        } catch (error) {
            const isValidationError = error instanceof ValidationError;
            const isOperationError = error instanceof OperationError;
            const isDuplicatedError = error instanceof DuplicatedError;
            if (isValidationError || isOperationError || isDuplicatedError) {
                modelState?.setErrors(error.errors);
                await alertModalStore.getSubmissionErrorConfirmationAsync(error.errors);
                document.getElementById("content")?.scrollTo({ top: 0, behavior: "smooth" });
            } else  if (error instanceof AuthorizationError) {
                await alertModalStore.getUnauthorizationConfirmationAsync();
                await navigate(routeGenerator.getHomeRoutePath());
            } else {
                throw error;
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletionAsync = useCallback(async () => {
        if (!deletingAction) {
            return;
        }

        const confirmationAnswer = await alertModalStore.getDeletingConfirmationAsync();
        if (confirmationAnswer) {
            setDeleting(true);
            try {
                await deletingAction();
                // clearLeavingConfirmation();
                modelState?.clearErrors();
                await alertModalStore.getSubmissionSuccessConfirmationAsync();
                onDeletionSucceeded?.();
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await alertModalStore.getNotFoundConfirmationAsync();
                    return;
                }

                if (error instanceof OperationError) {
                    modelState?.setErrors(error.errors);
                    await alertModalStore.getSubmissionErrorConfirmationAsync(error.errors);
                    return;
                }
                
                throw error;
            } finally {
                setDeleting(false);
            }
        }
    }, [deletingAction, onDeletionSucceeded, deletionSucceededModal]);

    const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    }, []);

    return (
        <FormContext.Provider value={contextValue}>
            <form className={computeClassName()} id={props.id}
                    tabIndex={computeTabIndex()}
                    onKeyDown={handleKeyPress}
                    onSubmit={handleSubmissionAsync}>
                {props.children}
            </form>
        </FormContext.Provider>
    );
};

export default Form;