import { useRef, useEffect } from "react";
import { useModelState } from "@/hooks/modelStateHook";
import { usePageLoadProgressBarStore } from "@/stores/pageLoadProgressBarStore";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useRouteGenerator } from "@/router/routeGenerator";

/**
 * Providing initial loading state controlling API, modelState for errors, initial data store
 * and route generator utilities for a View.
 * 
 * @returns An object containing the loading state and model state APIs.
 */
export function useViewStates() {
    // Dependencies.
    const initialDataStore = useInitialDataStore();
    const finishPageLoading = usePageLoadProgressBarStore(store => store.finish);
    const routeGenerator = useRouteGenerator();

    // States.
    const modelState = useModelState();
    const isInitialRendering = useRef<boolean>(true);

    useEffect(() => {
        finishPageLoading();
        isInitialRendering.current = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return {
        modelState,
        isInitialRendering: isInitialRendering.current,
        get initialData(): ResponseDtos.InitialData {
            return initialDataStore.data;
        },
        getDisplayName: initialDataStore.getDisplayName,
        routeGenerator
    };
}