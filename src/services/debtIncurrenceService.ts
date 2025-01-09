import { useApiClient } from "./apiClient";

type ListRequestDto = RequestDtos.DebtIncurrence.List;
type UpsertRequestDto = RequestDtos.DebtIncurrence.Upsert;
type ListResponseDto = ResponseDtos.DebtIncurrence.List;
type CreatingAuthorizationResponseDto = ResponseDtos.DebtIncurrence.CreatingAuthorization;

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves a list of debt incurrences with the basic information, based on the specified
     * filtering, sorting and paginating conditions.
     *
     * @param requestDto (Optional) An object containing the conditions for the results.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the results and the additional information for pagination.
     * @example getListAsync();
     * @example getListAsync(debtRequestDtos.Incurrence.List);
     *
     * @throws {ValidationError} Throws when the data specified in the `requestDto` argument is
     * invalid.
     */
    async getListAsync(requestDto?: ListRequestDto): Promise<ListResponseDto> {
        return apiClient.getAsync("/debtIncurrence", requestDto);
    },

    /**
     * Retrieves the details of a specific debt incurrence by its id.
     *
     * @param id A {@link number} representing the id of the debt incurrence to retrieve.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the details of the debt incurrence.
     * @example getDetailAsync(1);
     *
     * @throws {NotFoundError} Throws when the debt incurrence specified by the `id` argument
     * doesn't exist or has already been deleted.
     */
    async getDetailAsync(id: number): Promise<ResponseDtos.DebtIncurrence.Detail> {
        return apiClient.getAsync(`/debtIncurrence/${id}`);
    },

    /**
     * Creates a new debt incurrence based on the specified data.
     *
     * @param requestDto An object containing the data for the creating operation.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a
     * {@link number} representing the id of the new debt incurrence.
     * @example createAsync(debtRequestDtos.Incurrence.Upsert);
     *
     * @throws {ValidationError} Throws when the data specified by the `requestDto` argument is
     * invalid.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to specify a value for the `incurredDateTime` property in the `requestDto`
     * argument.
     * @throws {ConcurrencyError} Throws when the information of the requesting user has been
     * deleted before the operation.
     * @throws {OperationError} Throws when the customer which has the id specified by the
     * value of the `customerId` property in the `requestDto` argument doesn't exist or has
     * already been deleted.
     */
    async createAsync(requestDto: RequestDtos.DebtIncurrence.Upsert): Promise<number> {
        return await apiClient.postAsync("/debtIncurrence", requestDto);
    },

    /**
     * Updates an existing debt incurrence, based on the id of the customer to which it
     * belongs, its id and the specified data.
     *
     * @param id A {@link number} representing the id of the debt incurrence to update.
     * @param requestDto An object containing the data for the updating operation.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example updateAsync(1, debtRequestDtos.Incurrence.Upsert);
     *
     * @throws {ValidationError} Throws when the data specified by the `requestDto` argument is
     * invalid.
     * @throws {NotFoundError} Throws when the debt incurrence with the id specified by the
     * `id` argument doesn't exist or has already been deleted.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to specify a value for the `incurredDateTime` property in the `requestDto`
     * argument.
     * @throws {ConcurrencyError} Throws under the following circumstances:
     * - When the information of the requesting user has been deleted before the operation.
     * - When the debt incurrence information has been modified before the operation.
     * @throws {OperationError} Throws under the following circumstances:
     * - When the `incurredDateTime` property in the `requestDto` argument is specified a value
     * while the debt incurrence has already been locked.
     * - When the remaining debt amount of the specified customer becomes negative after the
     * operation.
     */
    async updateAsync(id: number, requestDto: UpsertRequestDto): Promise<void> {
        return await apiClient.putAndIgnoreAsync(`/debtIncurrence/${id}`, requestDto);
    },

    /**
     * Deletes an existing debt incurrence based on its id.
     *
     * @param id A {@link number} representing the id of the debt incurrence to delete.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example deleteAsync(1);
     *
     * @throws {NotFoundError} Throws when the debt incurrence specified by the `id` argument
     * doesn't exist or has already been deleted.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to delete the specified debt incurrence.
     * @throws {ConcurrencyError} Throws under the following circumstances:
     * - When the information of the requesting user has been deleted before the operation.
     * - When the debt incurrence has been modified before the operation.
     * @throws {OperationError} Throws when the remaining debt amount of the specified customer
     * becomes negative after the operation.
     */
    async deleteAsync(id: number): Promise<void> {
        return await apiClient.deleteAndIgnoreAsync(`/debtIncurrence/${id}`);
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
        return await apiClient.getAsync("/debtIncurrence/sortingOptions");
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
        return await apiClient.getAsync("/debtIncurrence/monthYearOptions");
    },

    /**
     * Check if the requesting user has permission to create a new debt incurrence.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * `true` if the requesting user has the permission. Otherwise, `false`.
     * @example getCreatingPermissionAsync();
     */
    async getCreatingPermissionAsync(): Promise<boolean> {
        return await apiClient.getAsync("/debtIncurrence/creatingPermission");
    },

    /**
     * Check if the requesting user has permission to create a new debt incurrence and retrieve
     * the authorization information for creating operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the authorization information for the operation when the requesting
     * user has permission to perform the operation. Otherwise, `null`.
     * @example getCreatingAuthorizationAsync();
     */
    async getCreatingAuthorizationAsync() : Promise<CreatingAuthorizationResponseDto> {
        return await apiClient.getAsync("/debtIncurrence/creatingAuthorization");
    }
};

/**
 * A service to send the requests and handle the responses representing the operations which
 * are related to customer debt incurrence.
 *
 * @returns An object containing the methods to perform the operations.
 */
export function useDebtIncurrenceService() {
    return service;
}