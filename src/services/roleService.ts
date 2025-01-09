import { useApiClient } from "./apiClient";

/**
 * A service to send requests and handle responses which represent the role-related operations.
 *
 * @returns An object containing the methods those perform the operations.
 */
export function useRoleService() {
    const apiClient = useApiClient();
    
    return {
        /**
         * Retrieves a list of all roles available in the application.
         *
         * @returns A {@link Promise} representing the asynchronous operation, which result is
         * an array of objects, containing the results.
         */
        async getAllAsync(): Promise<ResponseDtos.Role.Minimal[]> {
            return await apiClient.getAsync("/role");
        },
    };
}