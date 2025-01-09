import { useApiClient } from "./apiClient";

type ListRequestDto = RequestDtos.Treatment.List;
type ListResponseDto = ResponseDtos.Treatment.List;

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves a list of treatments based on the specified filtering and paginating
     * conditions.
     *
     * @param requestDto (Optional) An object containing the filtering and paginating
     * conditions for the results.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the results and some of the additional information for pagination.
     * @example getListAsync();
     * @example getListAsync(treatmentListRequestDto);
     *
     * @throws {ValidationError} Throws when the specified data is invalid.
     */
    async getListAsync(requestDto?: ListRequestDto): Promise<ListResponseDto> {
        return await apiClient.getAsync("/treatment", requestDto);
    },

    /**
     * Retrieves the details of the treatment with the specified id.
     *
     * @param id A {@link number} representing the id of the treatment to be retrieved.
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * an object containing the details of the treatment.
     * @example getDetailAsync(1);
     *
     * @throws {NotFoundError} Throws when the treatment which has the specified id
     * doesn't exist or has already been deleted.
     */
    async getDetailAsync(id: number): Promise<ResponseDtos.Treatment.Detail> {
        return await apiClient.getAsync(`/treatment/${id}`);
    },

    /**
     * Creates a new treatment with the specified data.
     *
     * @param requestDto An object implementing the {@link RequestDtos.Treatment.Upsert}
     * interface, containing the data for a new treatment.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a
     * {@link number} representing the id of the new treatment.
     *
     * @throws {ValidationError} Throws when the specified data violates validation errors.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to perform the operation.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {OperationError} Throws when the customer with the id specified by the value of
     * the property `customerId` or the user with the id specified by the value of the property
     * `TherapistId` in the argument for the `requestDto` parameter doesn't exist or has
     * already been deleted.
     */
    async createAsync(requestDto: RequestDtos.Treatment.Upsert): Promise<number> {
        return await apiClient.postAsync("/treatment", requestDto);
    },

    /**
     * Updates the treatment which has the specified id.
     *
     * @param id A {@link number} representing the id of the treatment to be updated.
     * @param requestDto An object implementing the {@link RequestDtos.Treatment.Upsert}
     * interface and containing the data to be updated.
     * @returns A {@link Promise} representing the asynchronous operation.
     *
     * @throws {ValidationError} Throws when the specified data violates validation rules.
     * @throws {NotFoundError} Throws when the treatment with the specified id doesn't exist or
     * has already been deleted.
     * @throws {AuthorizationError} Throws when the user doesn't have enough permission to set
     * the value for one or some of the treatment properties.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {OperationError} Throws when the customer with the id specified by the value of
     * the property `customerId` or the user with the id specified by the value of the property
     * `TherapistId` in the argument for the `requestDto` parameter doesn't exist or has
     * already been deleted.
     */
    async updateAsync(
        id: number,
        requestDto: RequestDtos.Treatment.Upsert): Promise<void> {
        return await apiClient.putAndIgnoreAsync(`/treatment/${id}`, requestDto);
    },

    /**
     * Delete an existing treatment with the specified id.
     *
     * @param id A {@link number} representing the id of the treatment to be deleted.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @remarks Of the treatment cannot be deleted entirely due to the existence of some
     * related data, it will be soft-deleted instead.
     *
     * @throws {NotFoundError} Throws when the treatment with the specified id doesn't exist or
     * has already been deleted.
     * @throws {AuthorizationError} Throws when the user doesn't have enough permissions to set
     * the value for on or some of the treatment properties.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     */
    async deleteAsync(id: number): Promise<void> {
        return await apiClient.deleteAndIgnoreAsync(`/treatment/${id}`);
    },

    /**
     * Retrieve all fields those are used as options to sort the results in list retrieving
     * operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the options with name and display names of the fields and the
     * default field.
     * @example getListSortingOptionsAsync();
     */
    async getListSortingOptionsAsync(): Promise<ResponseDtos.List.SortingOptions> {
        return await apiClient.getAsync("/treatment/listSortingOptions");
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
        return await apiClient.getAsync("/treatment/listMonthYearOptions");
    },

    /**
     * Check if the requesting user has permission to create a new treatment.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * `true` if the requesting user has the permission. Otherwise, `false`.
     * @example getCreatingPermissionAsync();
     */
    async getCreatingPermissionAsync(): Promise<boolean> {
        return await apiClient.getAsync("/treatment/creatingPermission");
    },

    /**
     * Check if the requesting user has permission to create a new treatment and retrieve the
     * authorization information for creating operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the authorization information for the operation when the requesting
     * user has permission to perform the operation. Otherwise, `null`.
     * @example getCreatingAuthorizationAsync();
     */
    async getCreatingAuthorizationAsync()
        : Promise<ResponseDtos.Treatment.CreatingAuthorization | null> {
        return await apiClient.getAsync("/treatment/creatingAuthorization");
    }
};

/**
 * A service to send requests and handle responses which are related to treatment operations.
 *
 * @returns An object containing the methods which perform the operations.
 */
export function useTreatmentService() {
    return service;
}