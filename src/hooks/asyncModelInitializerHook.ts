import { use, useEffect } from "react";

interface AsyncModelInitializerParameters<TModel> {
    initializer: () => Promise<TModel>;
    cacheKey: string;
}

let cache: Map<string, Promise<any> | null> = new Map();

export function useAsyncModelInitializer<TModel>
        ({ initializer, cacheKey }: AsyncModelInitializerParameters<TModel>): TModel {
    let promise = cache.get(cacheKey);
    if (!promise) {
        promise = initializer();
        cache.set(cacheKey, promise);
    }

    useEffect(() => {
        return () => {
            cache.delete(cacheKey);
        };
    }, []);

    const model: TModel = use(promise);
    return model;
}

export function clearAsyncModelInitializerCache(): void {
    cache = new Map();
};