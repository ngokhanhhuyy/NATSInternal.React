import { useApiClient } from "./apiClient";

/**
 * A service to send requests and handle responses which represent the notification-related
 * operations.
 *
 * @returns An object containing the methods to perform the operations.
 */
export function useNotificationService() {
    const apiClient = useApiClient();

    return {
        /**
         * Retrieves a list of notifications, based on the filtering and paginating conditions
         * (if specified).
         *
         * @param requestDto (Optional) An object containing the conditions for the results.
         * @returns A {@link Promise} representing the asynchronous operation, which result is
         * an object containing the results and the additional information for pagination.
         * @example getListAsync();
         * @example getListAsync(notificationListRequestDto);
         *
         * @throws {ValidationError} Throws when the data specified in the `requestDto`
         * argument is invalid.
         */
        async getListAsync(requestDto?: RequestDtos.Notification.List):
                Promise<ResponseDtos.Notification.List> {
            return apiClient.getAsync("/notification", requestDto);
        },

        /**
         * Retrieves the information of a specific notification, based on its id.
         *
         * @param id A {@link number} representing the id of the notification to retrieve.
         * @returns A {@link Promise} representing the asynchronous operation, which result is
         * an object containing the information of the notification.
         * @example getSingleAsync(1);
         *
         * @throws {NotFoundError} Throws when the notification with the specified id doesn't
         * exist.
         */
        async getSingleAsync(id: number): Promise<ResponseDtos.Notification.Single> {
            return await apiClient.getAsync(`/notification/${id}`);
        },

        /**
         * Marks a specific notification as read, based on its id.
         *
         * @param id A {@link number} representing the id of the notification to mark.
         * @returns A {@link Promise} representing the asynchronous operation.
         * @example markAsReadAsync(1);
         *
         * @throws {NotFoundError} Throws when the notification with the specified id doesn't
         * exist.
         */
        async markAsReadAsync(id: number): Promise<void> {
            return await apiClient.postAndIgnoreAsync(`/notification/${id}/markAsRead`, {});
        },

        /**
         * Marks all the notification which belong to the requesting user as read.
         *
         * @returns A {@link Promise} representing the asynchronous operation.
         */
        async markAllAsReadAsync(): Promise<void> {
            return await apiClient.postAndIgnoreAsync("/notification/markAllAsRead", {});
        }
    };
}