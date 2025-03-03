import { useViewStates } from "./viewStatesHook";

export function useUpsertViewStates() {
    // States.
    const {
        modelState,
        AuthorizationError,
        ValidationError,
        initialData,
        getDisplayName,
        routeGenerator
    } = useViewStates();

    return {
        modelState,
        initialData,
        getDisplayName,
        routeGenerator,
        AuthorizationError,
        ValidationError,
    };
}