import { create } from "zustand/index";

export interface IStore {
    resolve: ((answer: boolean) => void) | null;
    getDeleteConfirmationAsync(): Promise<boolean>;
    isVisible: boolean;
}

export const useStore = create<IStore>((set, get) => {
    return {
        resolve: null,
        getDeleteConfirmationAsync: async (): Promise<boolean> => {
            return new Promise(promiseResolve => {
                set({
                    resolve: (answer: boolean) => {
                        promiseResolve(answer);
                        set({ resolve: null });
                    }
                });
            });
        },
        get isVisible(): boolean {
            return get().resolve != null;
        },

    };
});