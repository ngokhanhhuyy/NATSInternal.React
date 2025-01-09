import { useApiClient } from "./apiClient";

type ListRequestDto = RequestDtos.Expense.List;
type ListResponseDto = ResponseDtos.Expense.List;

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves a list of expenses with the basic information, based on the specified
     * filtering, sorting and paginating conditions.
     *
     * @param requestDto An object containing the conditions for the results.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the results and the additional information for the pagination.
     * @example getListAsync(expenseListRequestDto);
     *
     * @throws {ValidationError} Throws when the values for the conditions specified in the
     * `requestDto` is invalid.
     */
    async getListAsync(requestDto?: ListRequestDto): Promise<ListResponseDto> {
        return await apiClient.getAsync("/expense", requestDto);
    },

    /**
     * Retrieves the details of a specific expense, based on the specified id.
     *
     * @param id A {@link number} representing the id of the expense to retrieve.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the details of the expense.
     * @example getDetailAsync(1);
     *
     * @throws {NotFoundError} Throws when the expense with the specified id doesn't exist or
     * has already been deleted.
     */
    async getDetailAsync(id: number): Promise<ResponseDtos.Expense.Detail> {
        return await apiClient.getAsync(`/expense/${id}`);
    },

    /**
     * Creates a new expense with the specified data.
     *
     * @param requestDto An object containing the data for the new expense.
     * @returns A {@link number} representing the asynchronous operation, which result is a
     * {@link number} representing the id of the created expense.
     * @example createAsync(expenseUpsertRequestDto);
     *
     * @throws {ValidationError} Throws when the provided data in the argument for the
     * `requestDto` parameter is invalid.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {AuthorizationError} Throws when the value for the `statsDateTime` property has
     * been provided in the `requestDto`, but the requesting user doesn't have enough
     * permissions to do so.
     * @throws {OperationError} Throws when a requesting-user-related conflict or a
     * payee-related conflict occurs during the operation.
     */
    async createAsync(requestDto: RequestDtos.Expense.Upsert): Promise<number> {
        return await apiClient.postAsync("/expense", requestDto);
    },

    /**
     * Updates an existing expense with the specified data.
     *
     * @param id The id of the expense to update.
     * @param requestDto An object containing the data for the expense to be updated.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example updateAsync(1, expenseUpsertRequestDto);
     *
     * @throws {ValidationError} Throws when the provided data in the argument for the
     * `requestDto` parameter is invalid.
     * @throws {NotFoundError} Throws when the expense with the specified id doesn't exist or
     * has already been deleted.
     * @throws {AuthorizationError} Throws when the value for the `statsDateTime` property has
     * been provided in the `requestDto`, but the requesting user doesn't have enough
     * permissions to do so.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {OperationError} Throws when a requesting-user-related conflict or a
     * payee-related conflict occurs during the operation.
     */
    async updateAsync(id: number, requestDto: RequestDtos.Expense.Upsert): Promise<void> {
        return await apiClient.putAndIgnoreAsync(`/expense/${id}`, requestDto);
    },

    /**
     * Deletes an existing expense with the specified data.
     *
     * @param id The id of the expense to delete.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example deleteAsync(1);
     *
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to perform the operation.
     * @throws {NotFoundError} Throws when the expense with the specified id doesn't exist or
     * has already been deleted.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {OperationError} Throws when the expense's deletion is restricted due to the
     * existence of some related data.
     */
    async deleteAsync(id: number): Promise<void> {
        return await apiClient.deleteAndIgnoreAsync(`/expense/${id}`);
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
        return await apiClient.getAsync("/expense/listSortingOptions");
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
        return await apiClient.getAsync("/expense/listMonthYearOptions");
    },

    /**
     * Check if the requesting user has permission to create a new expense.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * `true` if the requesting user has the permission. Otherwise, `false`.
     * @example getCreatingPermissionAsync();
     */
    async getCreatingPermissionAsync(): Promise<boolean> {
        return await apiClient.getAsync("/expense/creatingPermission");
    },

    /**
     * Check if the requesting user has permission to create a new expense and retrieve
     * the authorization information for creating operation.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the authorization information for the operation when the requesting
     * user has permission to perform the operation. Otherwise, `null`.
     * @example getCreatingAuthorizationAsync();
     */
    async getCreatingAuthorizationAsync()
        : Promise<ResponseDtos.Expense.CreatingAuthorization | null> {
        return await apiClient.getAsync("/expense/creatingAuthorization");
    }
};

/**
 * A service to send the requests and handle the responses representing the expense-related
 * operations.
 *
 * @returns An object containing the methods to perform the operations.
 */
export function useExpenseService() {
    return service;
}