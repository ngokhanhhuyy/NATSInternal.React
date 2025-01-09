import { useApiClient } from "./apiClient";

type ListRequestDto = RequestDtos.DebtPayment.List;
type UpsertRequestDto = RequestDtos.DebtPayment.Upsert;
type ListResponseDto = ResponseDtos.DebtPayment.List;
type CreatingAuthorizationResponseDto = ResponseDtos.DebtPayment.CreatingAuthorization;

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves a list of debt payments with the basic information, based on the specified
     * filtering, sorting and paginating conditions.
     *
     * @param requestDto (Optional) An object containing the conditions for the results.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the results and the additional information for pagination.
     * @example getListAsync();
     * @example getListAsync(debtRequestDtos.Payment.List);
     *
     * @throws {ValidationError} Throws when the data specified in the `requestDto` argument is
     * invalid.
     */
    async getListAsync(requestDto?: ListRequestDto): Promise<ListResponseDto> {
        return await apiClient.getAsync("/debtPayment", requestDto);
    },

    /**
     * Retrieves the details of a specific debt payment by its id.
     *
     * @param id A {@link number} representing the id of the debt payment to retrieve.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the details of the debt payment.
     * @example getDetailAsync(1);
     *
     * @throws {NotFoundError} Throws when the debt payment specified by the `id` argument
     * doesn't exist or has already been deleted.
     */
    async getDetailAsync(id: number): Promise<ResponseDtos.DebtPayment.Detail> {
        return await apiClient.getAsync(`/debtPayment/${id}`);
    },

    /**
     * Creates a new debt payment based on the specified data from the request.
     *
     * @param requestDto An object containing the data for the creating operation.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a
     * {@link number} representing the id of the new debt payment.
     * @example createAsync(debtRequestDtos.Payment.Upsert);
     *
     * @throws {ValidationError} Throws when the data specified by the `requestDto` argument is
     * invalid.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to specify a value for the `statsDateTime` property in the8 `requestDto`
     * argument.
     * @throws {ConcurrencyError} Throws when the information of the requesting user has been
     * deleted before the operation.
     * @throws {OperationError} Throws under the following circumstances:
     * - The customer specified by the `customerId` property in the `requestDto` argument
     * doesn't exist or has already been deleted.
     * - The remaining debt amount of the specified customer becomes negative after the
     * operation.
     */
    async createAsync(requestDto: RequestDtos.DebtPayment.Upsert): Promise<number> {
        return await apiClient.postAsync("/debtPayment", requestDto);
    },

    /**
     * Updates an existing debt payment, based on its id the provided data.
     *
     * @param id A {@link number} value representing the id of the debt payment to update.
     * @param requestDto An object containing the data for the updating operation.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example updateAsync(1, debtRequestDtos.Payment.Upsert);
     *
     * @throws {ValidationError} Throws when the data specified by the `requestDto` argument is
     * invalid.
     * @throws {NotFoundError} Throws when the debt payment specified by the `id` argument
     * doesn't exist or has already been deleted.
     * @throws {AuthorizationError} Throws under the following circumstances:
     * - When the requesting user doesn't have enough permissions to update the debt payment.
     * - When the requesting user can update the debt payment, but doesn't have enough
     * permissions to specify a value for the `statsDateTime` property in the `requestDto`
     * argument.
     * @throws {OperationError} Throws under the following circumstances:
     * - When the `statsDateTime` property in the `requestDto` argument is specified a value
     * while the debt amount has already been locked.
     * - When the remaining debt amount of the associated customer becomes negative after the
     * operation.
     * @throws {ConcurrencyError} Throws under the following circumstances:
     * - When the debt payment has been modified by another process before the operation.
     * - When the information of the requesting user has been deleted by another process before
     * the operation.
     */
    async updateAsync(id: number, requestDto: UpsertRequestDto): Promise<void> {
        return await apiClient.putAndIgnoreAsync(`/debtPayment/${id}`, requestDto);
    },

    /**
     * Deletes an existing debt payment, specified by its id.
     *
     * @param id A {@link number} representing the id of the debt payment to delete.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example deleteAsync(1);
     *
     * @throws {NotFoundError} Throws when the debt payment with the specified id doesn't exist
     * or has already been deleted.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to delete the specified debt payment.
     * @throws {OperationError} Throws under the following circumstances:
     * - When the debt payment is locked.
     * - When the specified customer's remaining debt amount becomes negative after the
     * operation.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     */
    async deleteAsync(id: number): Promise<void> {
        return await apiClient.deleteAndIgnoreAsync(`debtPayment/${id}`);
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
        return await apiClient.getAsync("/debtPayment/sortingOptions");
    },

    /**
     * Retrieve month year options which user can select as the filtering condition and the
     * default option, used in the list retrieving operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the options.
     * @example getListSortingOptionsAsync();
     */
    async getListMonthYearOptionsAsync(): Promise<ResponseDtos.List.MonthYearOptions> {
        return await apiClient.getAsync("/debtPayment/monthYearOptions");
    },

    /**
     * Check if the requesting user has permission to create a new debt payment.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * `true` if the requesting user has the permission. Otherwise, `false`.
     * @example getCreatingPermissionAsync();
     */
    async getCreatingPermissionAsync(): Promise<boolean> {
        return await apiClient.getAsync("/debtPayment/creatingPermission");
    },

    /**
     * Check if the requesting user has permission to create a new debt payment and retrieve
     * the authorization information for creating operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the authorization information for the operation when the requesting
     * user has permission to perform the operation. Otherwise, `null`.
     * @example getCreatingAuthorizationAsync();
     */
    async getCreatingAuthorizationAsync(): Promise<CreatingAuthorizationResponseDto> {
        return await apiClient.getAsync("/debtPayment/creatingAuthorization");
    }
};

/**
 * A service to send the requests and handle the repsonses representing the operations which
 * are related to customer debt payment.
 * 
 * @returns An object containing the methods to perform the operations.
 */
export function useDebtPaymentService() {
    return service;
}