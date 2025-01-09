import { useApiClient } from "./apiClient";

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves a list of supplies with the basic information, based on the specified
     * filtering, sorting and paginating conditions.
     *
     * @param requestDto (Optional) An object containing the conditions for the results.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the results and the additional information for pagination.
     * @example getListAsync();
     * @example getListAsync(supplyListRequestDto);
     *
     * @throws {ValidationError} Throws when the specified filtering conditions violates
     * some validation rules.
     */
    async getListAsync(requestDto?: RequestDtos.Supply.List):
        Promise<ResponseDtos.Supply.List> {
        return await apiClient.getAsync("/supply", requestDto);
    },

    /**
     * Retrieves the details of a specific supply, specified by the id of the supply.
     *
     * @param id A {@link number} representing the id of the retrieving supply.
     * @returns A {@link Promise} representing the asynchronous operation, which results is an
     * object containing the details of the supply.
     * @example getDetailAsync(1);
     *
     * @throws {NotFoundError} Throws when the supply with the specified id doesn't exist or
     * has already been deleted.
     */
    async getDetailAsync(id: number): Promise<ResponseDtos.Supply.Detail> {
        return await apiClient.getAsync(`/supply/${id}`);
    },

    /**
     * Creates a new supply with the specified data.
     *
     * @param requestDto An object containing the data for a new supply.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a
     * {@link number} representing the id of the new supply.
     * @example createAsync(supplyUpsertRequestDto);
     *
     * @throws {ValidationError} Throws when the specified data violates some of the validation
     * rules.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to perform the operation.
     * @throws {OperationError} Throws when the product with the id specified by property
     * `productId` in the provided data object doesn't exist or has already been deleted.
     */
    async createAsync(requestDto: RequestDtos.Supply.Upsert): Promise<number> {
        return await apiClient.postAsync("/supply", requestDto);
    },

    /**
     * Update the supply which has the specified id.
     *
     * @param id - A {@link number} representing the id of the supply to update.
     * @param requestDto - An object containing the updated data for the supply.
     * @returns A {@link Promise} instance representing the asynchronous operation.
     * @example updateAsync(1, supplyUpsertRequestDto);
     *
     * @throws {ValidationError} Throws when the specified data violates some of the validation
     * rules.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permission to perform the operation.
     * @throws {NotFoundError} Throws when the supply which has the specified id doesn't exist.
     * @throws {ConcurrencyError} Throws when there is concurrency related conflict during the
     * operation.
     * @throws {OperationError} Throws when the product with the id specified by property
     * `productId` in the provided data object doesn't exist or has already been deleted.
     */
    async updateAsync(
        id: number,
        requestDto: RequestDtos.Supply.Upsert): Promise<void> {
        return await apiClient.putAndIgnoreAsync(`/supply/${id}`, requestDto);
    },

    /**
     * Delete the supply which has the specified id.
     *
     * @param id A {@link number} representing the id of the supply.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example deleteAsync(id);
     *
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to perform the operation.
     * @throws {NotFoundError} Throws when the supply which has the specified id doesn't exist.
     * @throws {ConcurrencyError} Throws when there is concurrency related conflict during the
     * operation.
     * @throws {OperationError} Throws when the supply deletion is restricted due to the
     * existence of some related data.
     */
    async deleteAsync(id: number): Promise<void> {
        return await apiClient.deleteAndIgnoreAsync(`/supply/${id}`);
    },

    /**
     * Retrieve all fields those are used as options to sort the results in list retrieving
     * operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the options with name and display names of the fields and the default
     * field.
     * @example getListSortingOptionsAsync();
     */
    async getListSortingOptionsAsync(): Promise<ResponseDtos.List.SortingOptions> {
        return await apiClient.getAsync("/supply/listSortingOptions");
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
    async getListMonthYearOptionsAsync(): Promise<ResponseDtos.List.MonthYearOptions> {
        return await apiClient.getAsync("/supply/listMonthYearOptions");
    },

    /**
     * Check if the requesting user has permission to create a new supply.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * `true` if the requesting user has the permission. Otherwise, `false`.
     * @example getCreatingPermissionAsync();
     */
    async getCreatingPermissionAsync(): Promise<boolean> {
        return await apiClient.getAsync("/supply/creatingPermission");
    },

    /**
     * Check if the requesting user has permission to create a new supply and retrieve the
     * authorization information for creating operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the authorization information for the operation when the requesting
     * user has permission to perform the operation. Otherwise, `null`.
     * @example getCreatingAuthorizationAsync();
     */
    async getCreatingAuthorizationAsync()
        : Promise<ResponseDtos.Supply.CreatingAuthorization | null> {
        return await apiClient.getAsync("/supply/creatingAuthorization");
    }
};

/**
 * A service to send requests and handle responses which represent the supply-related
 * operations.
 *
 * @returns An object containing the methods which perform the operations.
 */
export function useSupplyService() {
    return service;
}