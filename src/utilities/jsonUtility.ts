interface JsonUtility {
    parseJson<T>(json: string): T | null;
}

export function useJsonUtility(): JsonUtility {
    function parseJson<T>(json: string): T | null {
        try {
            const jsonValue: T = JSON.parse(json);
            return jsonValue;
        } catch {
            return null;
        }
    }

    return { parseJson };
}