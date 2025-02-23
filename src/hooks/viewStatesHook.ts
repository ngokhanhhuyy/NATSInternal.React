import { useMemo, useEffect } from "react";
import { useModelState } from "@/hooks/modelStateHook";
import { useInitialLoadingState } from "./initialLoadingStateHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { AuthorizationError, ValidationError } from "@/errors";
import { useRouteGenerator } from "@/router/routeGenerator";

/**
 * Providing initial loading state controlling API, modelState for errors, initial data store
 * and route generator utilities for a View.
 * 
 * @returns An object containing the loading state and model state APIs.
 */
export function useViewStates() {
    const { isInitialLoading, onInitialLoadingFinished } = useInitialLoadingState();
    const modelState = useModelState();
    const initialDataStore = useInitialDataStore();
    const routeGenerator = useMemo(() => useRouteGenerator(), []);

    useEffect(() => {
        // setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return {
        isInitialLoading, onInitialLoadingFinished,
        modelState,
        AuthorizationError,
        ValidationError,
        get initialData(): ResponseDtos.InitialData {
            return initialDataStore.data;
        },
        getDisplayName: initialDataStore.getDisplayName,
        routeGenerator
    };
}