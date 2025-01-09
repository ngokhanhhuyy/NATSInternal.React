import { useApiClient } from "./apiClient";

type ListRequestDto = RequestDtos.Order.List;
type ListResponseDto = ResponseDtos.Order.List;
type CreatingAuthorizationResponseDto = ResponseDtos.Order.CreatingAuthorization | null;

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves a list of orders based on the specified filtering and paginating
     * conditions.
     *
     * @param requestDto An object containing the filtering and paginating conditions for the
     * results.
     * @returns A {@link Promise} representing the asynchronous operation, which resolves to an
     * object containing the results and some additional information for pagination.
     * @example getListAsync();
     * @example getListAsync(orderListRequestDto);
     *
     * @throws {ValidationError} Throws when the specified data in the `requestDto` object is
     * invalid.
     */
    async getListAsync(requestDto?: ListRequestDto): Promise<ListResponseDto> {
        return await apiClient.getAsync("/order", requestDto);
    },

    /**
     * Retrieves the details of a specific order by its id.
     *
     * @param id A {@link number} representing the id of the order to retrieve.
     * @returns A {@link Promise} representing the asynchronous operation, which resolves to an
     * object containing the details of the order.
     * @example getDetailAsync(1);
     *
     * @throws {NotFoundError} Throws when the order with the specified id doesn't exist or has
     * already been deleted.
     */
    async getDetailAsync(id: number): Promise<ResponseDtos.Order.Detail> {
        return await apiClient.getAsync(`/order/${id}`);
    },

    /**
     * Creates a new order based on the specified request data.
     *
     * @param requestDto An object containing the data for the new order.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * {@link number} representing the id of the new order.
     * @example createAsync(orderUpsertRequestDto);
     *
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to perform the operation.
     * @throws {OperationError} Throws when the customer with the id specified by the property
     * `customerId` in the argument for the `requestDto` parameter doesn't exist or has already
     * been deleted.
     */
    async createAsync(requestDto: RequestDtos.Order.Upsert): Promise<number> {
        return await apiClient.postAsync("/order", requestDto);
    },

    /**
     * Updates an existing order based on the specified request data.
     *
     * @param id A {@link number} representing the id of the order to update.
     * @param requestDto An object containing the data for the order to be updated.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example updateAsync(1, orderUpsertRequestDto);
     *
     * @throws {NotFoundError} Throws when the order with the specified id doesn't exist or has
     * already been deleted.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to perform the operation.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {OperationError} Throws when the customer with the id specified by the property
     * `customerId` in the argument for the `requestDto` parameter doesn't exist or has already
     * been deleted.
     */
    async updateAsync(id: number, requestDto: RequestDtos.Order.Upsert): Promise<void> {
        return await apiClient.putAndIgnoreAsync(`/order/${id}`, requestDto);
    },

    /**
     * Delete an existing order.
     *
     * @param id A {@link number} representing the id of the order to be deleted.
     * @returns A {@link Promise} representing the asynchronous operation.
     *
     * @throws {NotFoundError} Throws when the order with the specified id doesn't exist or has
     * already been deleted.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to perform the operation.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {OperationError} Throws when the order's deletion is restricted due to the
     * existence of some related data.
     */
    async deleteAsync(id: number): Promise<void> {
        return await apiClient.deleteAndIgnoreAsync(`/order/${id}`);
    },

    /**
     * Retrieve all fields those are used as options to sort the results in list
     * retrieving operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the options with name and display names of the fields and the default
     * field.
     * @example getListSortingOptionsAsync();
     */
    async getListSortingOptionsAsync(): Promise<ResponseDtos.List.SortingOptions> {
        return await apiClient.getAsync("/order/sortingOptions");
    },


    /**
     * Retrieve month year options which user can select as the filtering condition and the
     * default option, used in the list retrieving operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the options when there is any existing treatment information.
     * Otherwise, `null`.
     * @example getListSortingOptionsAsync();
     */
    async getListMonthYearOptionsAsync(): Promise<ResponseDtos.List.MonthYearOptions | null> {
        return await apiClient.getAsync("/order/monthYearOptions");
    },

    /**
     * Check if the requesting user has permission to create a new order.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * `true` if the requesting user has the permission. Otherwise, `false`.
     */
    async getCreatingPermissionAsync(): Promise<boolean> {
        return await apiClient.getAsync("/order/creatingPermission");
    },

    /**
     * Check if the requesting user has permission to create a new order and retrieve the
     * authorization information for creating operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the authorization information for the operation when the requesting
     * user has permission to perform the operation. Otherwise, `null`.
     */
    async getCreatingAuthorizationAsync() : Promise<CreatingAuthorizationResponseDto> {
        return await apiClient.getAsync("/order/creatingAuthorization");
    }
};

/**
 * A service to send requests and handle responses representing the order related operations.
 *
 * @returns An object containing the methods which perform the operations.
 */
export function useOrderService() {
    return service;
}