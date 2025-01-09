import { useApiClient } from "./apiClient";

export type DisplayNames = { [key: string]: string };

const apiClient = useApiClient();
const service = {
    async getDisplayNamesAsync(): Promise<DisplayNames> {
        return await apiClient.getAsync("/utility/displayNames");
    },

    async getInitialDataAsync(): Promise<ResponseDtos.InitialData> {
        return await apiClient.getAsync("/utility/initialData");
    }
};

/**
 * A service to send requests and handle responses which represent the utility-related
 * operations.
 *
 * @returns An object containing the methods which perform the operations.
 */
export function useUtilityService() {
    return service;
}