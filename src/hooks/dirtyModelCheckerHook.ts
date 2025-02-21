import { useRef } from "react";

export interface IDirtyModelChecker<TModel extends object> {
    get isModelDirty(): boolean;
    setOriginalModel: (model: TModel) => void;
}

export function useDirtyModelChecker<TModel extends object, TKey extends keyof TModel>
        (currentModel: TModel | undefined, excludedKeys?: TKey[]): IDirtyModelChecker<TModel> {
    const serializeModel = (model: TModel): string => {
        if (excludedKeys && excludedKeys.length) {
            return JSON.stringify(model, (key, value) => {
                if (!excludedKeys.includes(key as TKey)) {
                    return value;
                }
            });
        }

        return JSON.stringify(model);
    };
    const originalModelJson = useRef("");

    return {
        get isModelDirty(): boolean {
            const currentModelJson = currentModel ? serializeModel(currentModel) : "";
            return originalModelJson.current !== currentModelJson;
        },
        setOriginalModel(model) {
            originalModelJson.current = serializeModel(model);
        }
    };
}