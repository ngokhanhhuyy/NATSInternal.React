import { usePageLoadProgressBarStore } from "@/stores/pageLoadProgressBarStore";

export interface InitialLoadingState {
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
}

/**
 * Enables page initial loading state for a view.
 * 
 * @returns An object loading state API.
 */
export function useInitialLoadingState(): InitialLoadingState {
    const pageLoadProgressBarStore = usePageLoadProgressBarStore();

    return {
        get isInitialLoading() {
            return pageLoadProgressBarStore.phase === "waiting";
        },
        onInitialLoadingFinished: () => pageLoadProgressBarStore.finish()
    };
}