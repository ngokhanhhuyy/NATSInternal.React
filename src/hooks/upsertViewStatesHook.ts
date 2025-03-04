import { useViewStates } from "./viewStatesHook";

export function useUpsertViewStates() {
    // States.
    const {
        isInitialRendering,
        modelState,
        initialData,
        getDisplayName,
        routeGenerator
    } = useViewStates();

    return {
        isInitialRendering,
        modelState,
        initialData,
        getDisplayName,
        routeGenerator,
    };
}