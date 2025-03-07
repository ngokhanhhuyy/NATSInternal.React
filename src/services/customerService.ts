import { useApiClient } from "./apiClient";

type ListRequestDto = RequestDtos.Customer.List;
type ListResponseDto = ResponseDtos.Customer.List;

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves a list of customers with the basic information, based on the filtering,
     * sorting and paginating conditions.
     *
     * @param requestDto (Optional) An object containing the conditions for the results.
     * @param delay (Optional, default: true) A flag to indicate whether the operation should
     * be delayed (last at least 300ms).
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the results and the additional information for pagination.
     * @example getListAsync();
     * @example getListAsync(customerListRequestDto);
     *
     * @throws {ValidationError} Throws when the values of the conditions in the argument for
     * the `requestDto` parameter (if specified) is invalid.
     */
    async getListAsync(
            requestDto?: ListRequestDto,
            delay: boolean = true): Promise<ListResponseDto> {
        return apiClient.getAsync("/customer", requestDto, delay ? undefined : 0);
    },

    /**
     * Retrieves the basic information of a specific customer, based on the specified
     * id.
     *
     * @param id A {@link number} representing the id of the customer to retrieve.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the basic information of the customer.
     * @example getBasicAsync(1);
     *
     * @throws {NotFoundError} Throws when the customer with the specified id doesn't exist or
     * has already been deleted.
     */
    async getBasicAsync(id: number): Promise<ResponseDtos.Customer.Basic> {
        return await apiClient.getAsync(`/customer/${id}/basic`);
    },

    /**
     * Retrieves the details of a specific customer, based on the specified id.
     *
     * @param id A {@link number} representing the id of the customer to retrieve.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the details of the customer.
     * @example getDetailAsync(1);
     *
     * @throws {NotFoundError} Throws when the customer with the specified id doesn't exist or
     * has already been deleted.
     */
    async getDetailAsync(id: number): Promise<ResponseDtos.Customer.Detail> {
        return await apiClient.getAsync(`/customer/${id}`);
    },

    /**
     * Creates a new customer with the specified data.
     *
     * @param requestDto An object containing the data for the new customer.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a
     * {@link number} representing the id of the new customer.
     * @example createAsync(customerUpsertRequestDto);
     *
     * @throws {ValidationError} Throws when the data specified in the argument for
     * `requestDto` parameter is invalid.
     * @throws {OperationError} Throws when the customer who is this customer's introducer,
     * specified by the value of the property `introducerId` in the argument for the
     * `requestDto` parameter, doesn't exist or has already been deleted.
     */
    async createAsync(requestDto: RequestDtos.Customer.Upsert): Promise<number> {
        return await apiClient.postAsync("/customer", requestDto);
    },

    /**
     * Updates a specific customer based on the specified id.
     *
     * @param id The {@link number} representing the id of the customer to update.
     * @param requestDto An object containing the data for the customer to be updated.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example updaterAsync(1, customerUpsertRequestDto);
     *
     * @throws {ValidationError} Throws when the data specified in the argument for
     * `requestDto` parameter is invalid.
     * @throws {NotFoundError} Throws when the customer with the specified id doesn't exist or
     * has already been deleted.
     * @throws {OperationError} Throws when the customer who is this customer's introducer,
     * specified by the value of the property `introducerId` in the argument for the
     * `requestDto` parameter, doesn't exist or has already been deleted.
     */
    async updateAsync(id: number, requestDto: RequestDtos.Customer.Upsert): Promise<void> {
        return await apiClient.putAndIgnoreAsync(`/customer/${id}`, requestDto);
    },

    /**
     * Deletes a specific customer based on the specified id.
     *
     * @param id A {@link number} representing the id of the customer to be deleted.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example deleteAsync(1);
     *
     * @throws {NotFoundError} Throws when the customer with the specified id doesn't exist or
     * has already been deleted.
     */
    async deleteAsync(id: number): Promise<void> {
        return await apiClient.deleteAndIgnoreAsync(`/customer/${id}`);
    },

    /**
     * Get all fields those are used as options to order the results in list retrieving
     * operation.
     *
     * @returns An instance of the {@link ResponseDtos.List.SortingOptions} DTO, containing
     * the options with name and display names of the fields and the default field.
     * @example getListSortingOptionsAsync();
     */
    async getListSortingOptionAsync(): Promise<ResponseDtos.List.SortingOptions> {
        return await apiClient.getAsync("/customer/listSortingOptions");
    },

    /**
     * Check if the requesting user has permission to create a new consultant.
     *
     * @returns `true` if the requesting user has the permission. Otherwise, `false`.
     * @example getCreatingPermissionAsync();
     */
    async getCreatingPermissionAsync(): Promise<boolean> {
        return await apiClient.getAsync("/customer/creatingPermission");
    },
};

/**
 * A service to send requests and handle responses which represent the customer-related
 * operations.
 */
export function useCustomerService() {
    return service;
}