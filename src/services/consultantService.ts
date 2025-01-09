import { useApiClient } from "./apiClient";

type ListRequestDto = RequestDtos.Consultant.List;
type ListResponseDto = ResponseDtos.Consultant.List;

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves a list of consultants with the basic information, based on the specified
     * filtering, sorting and paginating conditions.
     *
     * @param requestDto (Optional) An object containing the conditions for the results.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the results.
     * @example getListAsync();
     * @example getListAsync(consultantListRequestDto);
     */
    async getListAsync(requestDto?: ListRequestDto): Promise<ListResponseDto> {
        return await apiClient.getAsync("/consultant", requestDto);
    },

    /**
     * Retrieves the details of a specific consultant, specified by the id of the consultant.
     *
     * @param id A {@link number} representing the id of the consultant to retrieve.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the details of the consultant.
     */
    async getDetailAsync(id: number): Promise<ResponseDtos.Consultant.Detail> {
        return await apiClient.getAsync(`/consultant/${id}`);
    },

    /**
     * Creates a new consultant with the specified data.
     *
     * @param requestDto An object containing the data for the operation.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a
     * {@link number} representing the id of the new consultant.
     * @example createAsync(consultantUpsertRequestDto);
     *
     * @throws {ValidationError} Throws when the data specified in the `requestDto` argument is
     * invalid.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to create a new consultant or to specify a value for the property
     * `statsDateTime` in the `requestDto` argument.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {OperationError} Throws when the requesting user has been deleted before the
     * operation.
     * @throws {OperationError} Throws when the customer with the id specified by the value of
     * the property `customerId` in the `requestDto` argument doesn't exist or has already been
     * deleted.
     */
    async createAsync(requestDto: RequestDtos.Consultant.Upsert): Promise<number> {
        return await apiClient.postAsync("/consultant", requestDto);
    },

    /**
     * Updates an existing consultant with the specified data.
     *
     * @param id A {@link number} representing the id of the consultant.
     * @param requestDto An object containing the data for the updating operation.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example updateAsync(1, consultantUpsertRequestDto);
     *
     * @throws {ValidationError} Throws when the data specified in the `requestDto` argument is
     * invalid.
     * @throws {NotFoundError} Throws when the consultant with the specified id doesn't exist
     * or has already been deleted.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to create a new consultant or to specify a value for the property
     * `statsDateTime` in the `requestDto` argument.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {OperationError} Throws when the value for the `statsDateTime` property in the
     * `requestDto` argument is specified when the consultant has already been locked.
     * @throws {OperationError} Throws when the requesting user has been deleted before the
     * operation.
     * @throws {OperationError} Throws when the customer with the id specified by the value of
     * the property `customerId` in the `requestDto` argument doesn't exist or has already been
     * deleted.
     */
    async updateAsync(
        id: number,
        requestDto: RequestDtos.Consultant.Upsert): Promise<void> {
        return await apiClient.putAndIgnoreAsync(`/consultant/${id}`, requestDto);
    },

    /**
     * Deletes an existing consultant by its id.
     *
     * @param id A {@link number} representing the id of the consultant.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example deleteAsync(1);
     *
     * @throws {NotFoundError} Throws when the consultant with the specified id doesn't exist
     * or has already been deleted.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {OperationError} Throws when the consultant's deletion is restricted due to the
     * existence of some related data.
     */
    async deleteAsync(id: number): Promise<void> {
        return await apiClient.deleteAndIgnoreAsync(`/consultant/${id}`);
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
        return await apiClient.getAsync("/consultant/listSortingOptions");
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
        return await apiClient.getAsync("/consultant/listMonthYearOptions");
    },

    /**
     * Check if the requesting user has permission to create a new consultant.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * `true` if the requesting user has the permission. Otherwise, `false`.
     * @example getCreatingPermissionAsync();
     */
    async getCreatingPermissionAsync(): Promise<boolean> {
        return await apiClient.getAsync("/consultant/creatingPermission");
    },

    /**
     * Check if the requesting user has permission to create a new consultant and retrieve
     * the authorization information for creating operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the authorization information for the operation when the requesting
     * user has permission to perform the operation. Otherwise, `null`.
     * @example getCreatingAuthorizationAsync();
     */
    async getCreatingAuthorizationAsync()
        : Promise<ResponseDtos.Consultant.CreatingAuthorization | null> {
        return await apiClient.getAsync("/consultant/creatingAuthorization");
    }
};

/**
 * A service to send requests and handle responses which represent the consultant-related
 * operations.
 *
 */
export function useConsultantService() {
    return service;
}