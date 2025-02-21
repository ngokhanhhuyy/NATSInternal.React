import { create } from "zustand";
import type { IModelStateErrors } from "@/errors";

export type Mode =
    | "discardingConfirmation"
    | "deletingConfirmation"
    | "notFoundNotification"
    | "forbiddenNotification"
    | "connectionErrorNotification"
    | "submissionErrorNotification"
    | "submissionSuccessNotification"
    | "dataUnchangedSubmissionNotification"
    | "unauthorizationConfirmation"
    | "fileTooLargeConfirmation"
    | "undefinedErrorNotification";

export interface IAlertModalStore {
    errors: IModelStateErrors | null;
    deletingConfirmationResolve: ((value: PromiseLike<boolean> | boolean) => void) | null;
    notFoundConfirmationResolve: ((value: PromiseLike<void> | void) => void) | null;
    discardingConfirmationResolve: ((value: PromiseLike<boolean> | boolean) => void) | null;
    submissionErrorConfirmationResolve: ((value: PromiseLike<void> | void) => void) | null;
    submissionSuccessConfirmationResolve: ((value: PromiseLike<void> | void) => void) | null;
    dataUnchangedSubmissionConfirmationResolve: ((value: PromiseLike<void> | void) => void) | null;
    unauthorizationConfirmationResolve: ((value: PromiseLike<void> | void) => void) | null;
    fileTooLargeConfirmationResolve: ((value: PromiseLike<void> | void) => void) | null;
    undefinedErrorConfirmationResolve: ((value: PromiseLike<void> | void) => void) | null;
    reset(): void;
    getDeletingConfirmationAsync(): Promise<boolean>;
    getNotFoundConfirmationAsync(): Promise<void>;
    getDiscardingConfirmationAsync(): Promise<boolean>;
    getSubmissionSuccessConfirmationAsync(): Promise<void>;
    getSubmissionErrorConfirmationAsync(errors?: IModelStateErrors): Promise<void>;
    getDataUnchangedSubmissionConfirmationAsync(): Promise<void>;
    getUnauthorizationConfirmationAsync(): Promise<void>;
    getFileTooLargeConfirmationAsync(): Promise<void>;
    getUndefinedErrorConfirmationAsync(): Promise<void>;
}

export const useAlertModalStore = create<IAlertModalStore>((set, get) => {
    return {
        errors: null,
        deletingConfirmationResolve: null,
        notFoundConfirmationResolve: null,
        discardingConfirmationResolve: null,
        submissionErrorConfirmationResolve: null,
        submissionSuccessConfirmationResolve: null,
        dataUnchangedSubmissionConfirmationResolve: null,
        unauthorizationConfirmationResolve: null,
        fileTooLargeConfirmationResolve: null,
        undefinedErrorConfirmationResolve: null,
        reset(): void {
            set({
                errors: null,
                deletingConfirmationResolve: null,
                notFoundConfirmationResolve: null,
                discardingConfirmationResolve: null,
                submissionErrorConfirmationResolve: null,
                submissionSuccessConfirmationResolve: null,
                dataUnchangedSubmissionConfirmationResolve: null,
                unauthorizationConfirmationResolve: null,
                fileTooLargeConfirmationResolve: null,
                undefinedErrorConfirmationResolve: null,
            });
        },
        async getDeletingConfirmationAsync(): Promise<boolean> {
            return new Promise<boolean>(resolve => {
                const computedResolve = (answer: boolean) => {
                    resolve(answer);
                    get().reset();
                };
                set({ deletingConfirmationResolve: computedResolve });
            });
        },
        async getNotFoundConfirmationAsync(): Promise<void> {
            await new Promise<void>(resolve => {
                const computedResolve = () => {
                    resolve();
                    get().reset();
                };
                set({ notFoundConfirmationResolve: computedResolve });
            });
        },
        async getDiscardingConfirmationAsync(): Promise<boolean> {
            return await new Promise<boolean>(resolve => {
                const computedResolve = (answer: boolean) => {
                    resolve(answer);
                    get().reset();
                };
                set({ discardingConfirmationResolve: computedResolve });
            });
        },
        async getSubmissionErrorConfirmationAsync(errors?: IModelStateErrors): Promise<void> {
            if (errors) {
                set({ errors: errors });
            }

            return await new Promise(resolve => {
                const computedResolve = () => {
                    if (get().errors != null) {
                        set({ errors: null });
                    }
                    resolve();
                };

                set({ submissionErrorConfirmationResolve: computedResolve });
            });
        },
        async getSubmissionSuccessConfirmationAsync(): Promise<void> {
            await new Promise(resolve => set({
                submissionSuccessConfirmationResolve: resolve
            }));
        },
        async getDataUnchangedSubmissionConfirmationAsync(): Promise<void> {
            await new Promise(resolve => set({
                dataUnchangedSubmissionConfirmationResolve: resolve
            }));
        },
        async getUnauthorizationConfirmationAsync(): Promise<void> {
            await new Promise(resolve => set({ unauthorizationConfirmationResolve: resolve }));
        },
        async getUndefinedErrorConfirmationAsync(): Promise<void> {
            await new Promise(resolve => set({ undefinedErrorConfirmationResolve: resolve }));
        },
        async getFileTooLargeConfirmationAsync(): Promise<void> {
            await new Promise(resolve => set({ fileTooLargeConfirmationResolve: resolve }));
        },
    };
});